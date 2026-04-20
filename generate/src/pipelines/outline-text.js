// SVG 中の <text class="outline"> を <path> に変換
// → Adobe Illustrator がフォント無しでも正しく表示できる

import { loadOpentypeFont } from '../text/font-cache.js'
import { DEFAULT_DESIGN } from '../config.js'

const ATTR_CACHE = new Map()
function attrRegex(name) {
  let re = ATTR_CACHE.get(name)
  if (!re) {
    re = new RegExp(`\\b${name}="([^"]*)"`)
    ATTR_CACHE.set(name, re)
  }
  return re
}

/**
 * SVG 文字列から <text class="outline" ...>...</text> を抽出して <path> に置換
 * @param {string} svgString
 * @param {(family: string) => string} fontResolver - family 名 → TTF path
 * @returns {string}
 */
export function outlineTextInSvg(svgString, fontResolver) {
  // 簡易パーサ: class="outline" を含む <text> 要素をすべて変換
  // 属性順は問わない、self-closing でないものだけ対応
  const TEXT_RE = /<text\b([^>]*\bclass="[^"]*\boutline\b[^"]*"[^>]*)>([^<]*)<\/text>/g

  return svgString.replace(TEXT_RE, (_match, attrs, content) => {
    const text = content.trim()
    if (!text) return ''

    const family = extractAttr(attrs, 'font-family') ?? DEFAULT_DESIGN.font_title
    const fontSize = parseFloat(extractAttr(attrs, 'font-size') ?? '24')
    const x = parseFloat(extractAttr(attrs, 'x') ?? '0')
    const y = parseFloat(extractAttr(attrs, 'y') ?? '0')
    const fill = extractAttr(attrs, 'fill') ?? 'currentColor'
    const id = extractAttr(attrs, 'id')
    const textAnchor = extractAttr(attrs, 'text-anchor') ?? 'start'

    let font
    try {
      font = loadOpentypeFont(fontResolver(family))
    } catch (e) {
      console.warn(`[outline-text] cannot load ${family}: ${e.message}`)
      return _match
    }

    // text-anchor 適用のため事前に幅測定
    const advance = font.getAdvanceWidth(text, fontSize)
    let xOffset = x
    if (textAnchor === 'middle') xOffset = x - advance / 2
    else if (textAnchor === 'end') xOffset = x - advance

    const otPath = font.getPath(text, xOffset, y, fontSize)
    const d = otPath.toPathData(2)

    const idAttr = id ? ` id="${id}"` : ''
    return `<path${idAttr} d="${d}" fill="${fill}" />`
  })
}

function extractAttr(attrs, name) {
  const m = attrs.match(attrRegex(name))
  return m ? m[1] : null
}
