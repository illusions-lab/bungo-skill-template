// SVG → PSD/PSB (ag-psd)
//
// 戦略:
//   1. SVG 中の <g id="layer-..."> 要素を抽出
//   2. 各レイヤを単独で SVG にして resvg-js でラスタ化（透明背景を残す）
//   3. pngjs で PNG → RGBA Uint8Array 展開
//   4. ag-psd の `imageData` 形式で各レイヤを渡し、PSD/PSB を組み立て
//
// 制約:
//   - テキストレイヤ（編集可能テキスト）は出力しない、すべてラスタレイヤ
//   - テキスト編集が必要なら SVG/PDF を使う

import fs from 'node:fs'
import { Resvg } from '@resvg/resvg-js'
import { writePsdBuffer } from 'ag-psd'
import { PNG } from 'pngjs'
import { PSD_MAX_DIMENSION, PSD_MAX_FILE_SIZE, DEFAULT_DESIGN } from '../config.js'

/**
 * SVG 文字列から `<g id="...">...</g>` を抽出
 * id 無しの inner <g> にも balance-aware で対応。
 * 前提: テンプレートは block-form `<g id="...">` のみ使用、self-closing や SVG コメント中の </g> 無し
 */
function extractLayers(svgString) {
  const defsMatch = svgString.match(/<defs\b[^>]*>[\s\S]*?<\/defs>/)
  const defs = defsMatch ? defsMatch[0] : ''

  const layers = []
  const G_OPEN_WITH_ID = /<g\s+[^>]*\bid="([^"]+)"[^>]*>/g
  let m
  while ((m = G_OPEN_WITH_ID.exec(svgString)) !== null) {
    const startIdx = m.index
    const id = m[1]
    let depth = 1
    let i = G_OPEN_WITH_ID.lastIndex
    while (depth > 0 && i < svgString.length) {
      const nextOpenIdx = (() => {
        const re = /<g[\s>]/g
        re.lastIndex = i
        const r = re.exec(svgString)
        return r ? r.index : -1
      })()
      const nextCloseIdx = svgString.indexOf('</g>', i)
      if (nextCloseIdx === -1) break
      if (nextOpenIdx !== -1 && nextOpenIdx < nextCloseIdx) {
        depth++
        i = nextOpenIdx + 2
      } else {
        depth--
        i = nextCloseIdx + 4
      }
    }
    if (depth === 0) {
      layers.push({ id, content: svgString.slice(startIdx, i) })
      G_OPEN_WITH_ID.lastIndex = i
    }
  }
  return { defs, layers }
}

function buildLayerSvg(defs, layerContent, width, height) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${defs}${layerContent}</svg>`
}

function rasterizeLayer(layerSvg, width, _height, fontBuffers, defaultFontFamily) {
  const resvg = new Resvg(layerSvg, {
    font: { fontBuffers, loadSystemFonts: false, defaultFontFamily },
    fitTo: { mode: 'width', value: width },
    background: 'rgba(0,0,0,0)', // 透明背景
  })
  const png = resvg.render()
  return png.asPng() // PNG buffer
}

/**
 * PNG buffer を ag-psd の `imageData` 形式に変換
 * @returns {{ width: number, height: number, data: Uint8Array }}
 */
function pngBufferToImageData(pngBuffer) {
  const png = PNG.sync.read(pngBuffer)
  return {
    width: png.width,
    height: png.height,
    data: new Uint8Array(png.data.buffer, png.data.byteOffset, png.data.byteLength),
  }
}

/**
 * @param {string} svgString
 * @param {object} opts
 * @param {number} opts.width
 * @param {number} opts.height
 * @param {string} opts.outputPath
 * @param {Buffer[]} opts.fontBuffers
 * @param {'psd' | 'psb' | 'auto'} [opts.format='auto']
 */
export async function svgToPsd(svgString, opts) {
  const {
    width,
    height,
    outputPath,
    fontBuffers,
    format = 'auto',
    defaultFontFamily = DEFAULT_DESIGN.font_body,
  } = opts

  const usePsb =
    format === 'psb' ||
    (format === 'auto' && Math.max(width, height) > PSD_MAX_DIMENSION)

  if (!usePsb && Math.max(width, height) > PSD_MAX_DIMENSION) {
    throw new Error(
      `Dimension ${width}×${height} exceeds PSD max ${PSD_MAX_DIMENSION}; use psb`,
    )
  }

  const { defs, layers } = extractLayers(svgString)

  // ベース合成（全レイヤ表示）も最上位の image として持たせると Photoshop が開きやすい
  const composedPng = rasterizeLayer(svgString, width, height, fontBuffers, defaultFontFamily)
  const composedImageData = pngBufferToImageData(composedPng)

  const psdLayers = []
  for (const { id, content } of layers) {
    const layerSvg = buildLayerSvg(defs, content, width, height)
    const layerPng = rasterizeLayer(layerSvg, width, height, fontBuffers, defaultFontFamily)
    const imageData = pngBufferToImageData(layerPng)
    psdLayers.push({
      name: id,
      imageData,
      opacity: 1,
      blendMode: 'normal',
    })
  }

  const psd = {
    width,
    height,
    imageData: composedImageData,
    children: psdLayers,
  }

  const buffer = writePsdBuffer(psd, { psb: usePsb })

  if (!usePsb && buffer.byteLength > PSD_MAX_FILE_SIZE) {
    throw new Error(
      `PSD output ${(buffer.byteLength / 1024 ** 3).toFixed(2)}GB exceeds ${(PSD_MAX_FILE_SIZE / 1024 ** 3).toFixed(2)}GB; use psb`,
    )
  }

  fs.writeFileSync(outputPath, buffer)
  return { format: usePsb ? 'psb' : 'psd', bytes: buffer.byteLength, layerCount: psdLayers.length }
}
