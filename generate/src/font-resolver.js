// フォント解決: generate/assets/fonts/<Family_Slug>/*.ttf のみ
// カスタムフォントもここに追加する（generate に集約してフラット化）

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GENERATOR_FONTS_DIR = path.resolve(__dirname, '../assets/fonts')

export function familyToSlug(family) {
  return family.replace(/\s+/g, '_')
}

export function listAvailableFonts() {
  const sources = []
  if (fs.existsSync(GENERATOR_FONTS_DIR)) {
    for (const dir of fs.readdirSync(GENERATOR_FONTS_DIR)) {
      const full = path.join(GENERATOR_FONTS_DIR, dir)
      if (fs.statSync(full).isDirectory()) {
        sources.push({ family: dir.replace(/_/g, ' '), path: full })
      }
    }
  }
  return sources
}

function findTtfRecursive(dir, depth = 2) {
  const out = []
  if (!fs.existsSync(dir)) return out
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory() && depth > 0) {
      out.push(...findTtfRecursive(full, depth - 1))
    } else if (entry.isFile() && /\.(ttf|otf)$/i.test(entry.name)) {
      out.push(full)
    }
  }
  return out
}

const resolveCache = new Map()

export function resolveFontPath(family, { weight = 'Regular' } = {}) {
  const cacheKey = `${family}\0${weight}`
  const cached = resolveCache.get(cacheKey)
  if (cached) return cached

  const slug = familyToSlug(family)
  const dir = path.join(GENERATOR_FONTS_DIR, slug)
  const files = findTtfRecursive(dir)

  if (files.length === 0) {
    const available = listAvailableFonts()
      .map((f) => `  - ${f.family}`)
      .join('\n')
    throw new Error(
      `Font "${family}" not found in ${GENERATOR_FONTS_DIR}. Available:\n${available || '  (none)'}`,
    )
  }

  const exactMatch = files.find((f) =>
    path.basename(f).toLowerCase().includes(`-${weight.toLowerCase()}`),
  )
  const looseMatch =
    exactMatch ??
    files.find((f) => path.basename(f).toLowerCase().includes(weight.toLowerCase()))
  // variable font は opentype.js のサポートが弱いため最後に回す
  const nonVariable = files.find((f) => !/variable/i.test(path.basename(f)))
  const result = exactMatch ?? looseMatch ?? nonVariable ?? files[0]
  resolveCache.set(cacheKey, result)
  return result
}

export function loadFontBuffer(family, opts) {
  return fs.readFileSync(resolveFontPath(family, opts))
}

export function buildFontResolver() {
  return (family, opts) => resolveFontPath(family, opts)
}
