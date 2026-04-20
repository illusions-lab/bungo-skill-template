// SVG → PDF (pdfkit + svg-to-pdfkit)
//
// 注: 当初 fontkit でプリサブセット化していたが、subset 化したフォントを PDFKit に
//     渡すと cmap subtable 不整合で「Cannot read properties of undefined (reading 'tables')」
//     エラーになる。PDFKit は内部で auto-subsetting するので、TTF path を直接渡す方式に変更。
//     CJK の埋込サイズが大きい場合は、後で fontkit ベースの自前 subset → 別途検討。

import fs from 'node:fs'
import PDFDocument from 'pdfkit'
import SVGtoPDF from 'svg-to-pdfkit'

/**
 * @param {string} svgString
 * @param {object} opts
 * @param {number} opts.width - PDF page width (px)
 * @param {number} opts.height
 * @param {string} opts.outputPath
 * @param {(family: string) => string} opts.fontResolver - family → TTF path
 * @param {string[]} opts.fontFamilies - 事前 register するフォント名
 */
export async function svgToPdf(svgString, opts) {
  const { width, height, outputPath, fontResolver, fontFamilies } = opts

  const doc = new PDFDocument({ size: [width, height], compress: true, autoFirstPage: true })
  const stream = fs.createWriteStream(outputPath)
  doc.pipe(stream)

  // フォント事前登録: TTF path をそのまま渡す
  // （PDFKit が内部で fontkit を使い、auto-subsetting する）
  for (const family of fontFamilies) {
    try {
      const ttfPath = fontResolver(family)
      doc.registerFont(family, ttfPath)
    } catch (e) {
      console.warn(`[svg-to-pdf] font register failed for ${family}: ${e.message}`)
    }
  }

  SVGtoPDF(doc, svgString, 0, 0, {
    fontCallback: (family /* , bold, italic */) => family,
    width,
    height,
  })

  doc.end()
  await new Promise((resolve, reject) => {
    stream.on('finish', resolve)
    stream.on('error', reject)
  })
}
