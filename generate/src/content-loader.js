// illusions-skill.yaml + 参照される *.md ファイルをまとめてロード
// design / output / tier のマージとデフォルト適用も担当

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'
import { Resvg } from '@resvg/resvg-js'
import { DEFAULT_DESIGN, DEFAULT_OUTPUT } from './config.js'
import { resolveFontPath } from './font-resolver.js'
import { loadOpentypeFont } from './text/font-cache.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PLACEHOLDER_PORTRAIT = path.resolve(__dirname, '../assets/placeholder-portrait.jpg')
const KANJI_SVG = path.resolve(__dirname, '../assets/illusions-kanji.svg')

export function loadSkillMeta(yamlPath) {
  const raw = fs.readFileSync(yamlPath, 'utf-8')
  const data = yaml.load(raw)
  if (!data || typeof data !== 'object') {
    throw new Error(`${yamlPath} is empty or not an object`)
  }
  return data
}

export function resolveContent(meta, repoRoot) {
  const design = { ...DEFAULT_DESIGN, ...(meta.design ?? {}) }
  // *_ref フィールドのファイルを読み込み
  // tier が YAML に無いケースは null を返す（degradation contract）
  return {
    ...meta,
    design,
    output: { ...DEFAULT_OUTPUT, ...(meta.output ?? {}) },
    tier_4: meta.tier_4
      ? {
          ...meta.tier_4,
          philosophy: readRefFile(meta.tier_4.philosophy_ref, repoRoot),
          sample_output: readRefFile(meta.tier_4.sample_output_ref, repoRoot),
        }
      : null,
    tier_5: meta.tier_5
      ? {
          ...meta.tier_5,
          full_layers: readRefFile(meta.tier_5.full_layers_ref, repoRoot),
          citations: readRefFile(meta.tier_5.citations_ref, repoRoot),
        }
      : null,
    portrait: resolvePortrait(meta.tier_1?.portrait, repoRoot),
    ...loadKanjiDataURIs({
      keyKanji: meta.tier_1?.key_kanji,
      fontFamily: design.font_title,
      accentColor: design.accent_color,
      fallbackSvgPath: KANJI_SVG,
    }),
  }
}

function readRefFile(relPath, repoRoot) {
  if (!relPath) return null
  const full = path.join(repoRoot, relPath)
  if (!fs.existsSync(full)) {
    console.warn(`[CONTENT MISSING] ${relPath} not found (referenced in YAML)`)
    return null
  }
  return fs.readFileSync(full, 'utf-8')
}

function resolvePortrait(relPath, repoRoot) {
  const candidates = []
  if (relPath) candidates.push(path.join(repoRoot, relPath))
  candidates.push(PLACEHOLDER_PORTRAIT)

  for (const full of candidates) {
    if (!fs.existsSync(full)) continue
    const ext = path.extname(full).slice(1).toLowerCase()
    if (full === PLACEHOLDER_PORTRAIT && relPath) {
      console.warn(`[PORTRAIT MISSING] ${relPath} not found, using placeholder`)
    }
    const buf = fs.readFileSync(full)
    const mime =
      ext === 'svg'
        ? 'image/svg+xml'
        : ext === 'jpg' || ext === 'jpeg'
          ? 'image/jpeg'
          : ext === 'png'
            ? 'image/png'
            : ext === 'webp'
              ? 'image/webp'
              : 'application/octet-stream'
    return { dataURI: `data:${mime};base64,${buf.toString('base64')}` }
  }
  return null
}

function loadKanjiDataURIs({ keyKanji, fontFamily, accentColor, fallbackSvgPath }) {
  // ロゴSVG (generate/assets/illusions-kanji.svg) を最優先で使う
  if (fs.existsSync(fallbackSvgPath)) {
    return renderKanjiDataURIs(fs.readFileSync(fallbackSvgPath, 'utf-8'))
  }

  // ロゴSVGが無い場合のみフォントから生成（skill派生リポ用フォールバック）
  const char = typeof keyKanji === 'string' ? Array.from(keyKanji.trim())[0] : null
  if (char) {
    try {
      const font = loadOpentypeFont(resolveFontPath(fontFamily ?? DEFAULT_DESIGN.font_title))
      return renderKanjiDataURIs(buildKanjiSvg(char, font, accentColor ?? '#f5f5f5'))
    } catch (e) {
      console.warn(`[KANJI FALLBACK] could not render "${char}": ${e.message}`)
    }
  }

  return { kanjiDataURI: null, kanjiGlowDataURI: null }
}

function renderKanjiDataURIs(svgRaw) {
  if (!svgRaw) return { kanjiDataURI: null, kanjiGlowDataURI: null }

  // クリスプ版（透明背景・512×512）
  const crisp = new Resvg(svgRaw, { fitTo: { mode: 'width', value: 512 } })
  const kanjiDataURI = `data:image/png;base64,${crisp.render().asPng().toString('base64')}`

  // グロー + クリスプをベイクした1024×1024 PNG（kanjiは中央の512×512領域）
  const innerMatch = svgRaw.match(/<svg[^>]*>([\s\S]*)<\/svg>/)
  const inner = innerMatch ? innerMatch[1] : ''
  const composite = `<svg xmlns="http://www.w3.org/2000/svg" width="2048" height="2048" viewBox="0 0 2048 2048">
    <defs><filter id="_blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="45"/></filter></defs>
    <g transform="translate(768,768)">
      <g filter="url(#_blur)" opacity="0.9">${inner}</g>
      <g filter="url(#_blur)" opacity="0.6">${inner}</g>
      ${inner}
    </g>
  </svg>`
  const comp = new Resvg(composite, { fitTo: { mode: 'width', value: 1024 } })
  const kanjiGlowDataURI = `data:image/png;base64,${comp.render().asPng().toString('base64')}`

  return { kanjiDataURI, kanjiGlowDataURI }
}

function buildKanjiSvg(char, font, fill) {
  // renderKanjiDataURIs は 512×512 viewBox を前提（illusions-kanji.svg と同一形式）
  const baseSize = 400
  const initial = font.getPath(char, 0, 0, baseSize)
  const bbox = initial.getBoundingBox()
  const glyphWidth = Math.max(bbox.x2 - bbox.x1, 1)
  const glyphHeight = Math.max(bbox.y2 - bbox.y1, 1)
  const targetGlyphSize = 380  // 512 viewBoxに対して余白16px程度
  const scale = Math.min(targetGlyphSize / glyphWidth, targetGlyphSize / glyphHeight)
  const scaledPath = font.getPath(char, 0, 0, baseSize * scale)
  const scaledBox = scaledPath.getBoundingBox()
  const centerX = (scaledBox.x1 + scaledBox.x2) / 2
  const centerY = (scaledBox.y1 + scaledBox.y2) / 2
  const tx = 256 - centerX
  const ty = 256 - centerY

  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <path d="${scaledPath.toPathData(2)}" transform="translate(${tx} ${ty})" fill="${fill}" />
  </svg>`
}

export function getTier(meta, n) {
  return meta[`tier_${n}`]
}

export function isTierAvailable(meta, n) {
  return Boolean(getTier(meta, n))
}
