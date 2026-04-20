// 日本語の自然な折返し: budoux で文節分割 → opentype.js で advance width 測定

import { loadDefaultJapaneseParser } from 'budoux'
import { loadOpentypeFont } from './font-cache.js'

const parser = loadDefaultJapaneseParser()

/**
 * @param {string} text - 折り返したい本文
 * @param {number} maxWidth - 最大幅 (px)
 * @param {number} fontSize - フォントサイズ (px)
 * @param {string} fontPath - TTF への絶対パス
 * @returns {string[]} - 行の配列
 */
export function wrapJapanese(text, maxWidth, fontSize, fontPath) {
  const font = loadOpentypeFont(fontPath)
  const lines = []
  for (const paragraph of text.split(/\n/)) {
    if (paragraph === '') {
      lines.push('')
      continue
    }
    const phrases = parser.parse(paragraph)
    let current = ''
    for (const phrase of phrases) {
      const candidate = current + phrase
      const width = font.getAdvanceWidth(candidate, fontSize)
      if (width > maxWidth && current) {
        lines.push(current)
        current = phrase
      } else {
        current = candidate
      }
    }
    if (current) lines.push(current)
  }
  return lines
}

/**
 * 文字列の advance width を返す（単行用）。
 */
export function measureText(text, fontSize, fontPath) {
  const font = loadOpentypeFont(fontPath)
  return font.getAdvanceWidth(text, fontSize)
}
