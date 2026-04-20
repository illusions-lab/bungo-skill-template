// illusions-skill.yaml + 参照される *.md ファイルをまとめてロード
// design / output / tier のマージとデフォルト適用も担当

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import yaml from 'js-yaml'
import { DEFAULT_DESIGN, DEFAULT_OUTPUT } from './config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PLACEHOLDER_PORTRAIT = path.resolve(__dirname, '../assets/placeholder-portrait.jpg')

export function loadSkillMeta(yamlPath) {
  const raw = fs.readFileSync(yamlPath, 'utf-8')
  const data = yaml.load(raw)
  if (!data || typeof data !== 'object') {
    throw new Error(`${yamlPath} is empty or not an object`)
  }
  return data
}

export function resolveContent(meta, repoRoot) {
  // *_ref フィールドのファイルを読み込み
  // tier が YAML に無いケースは null を返す（degradation contract）
  return {
    ...meta,
    design: { ...DEFAULT_DESIGN, ...(meta.design ?? {}) },
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

export function getTier(meta, n) {
  return meta[`tier_${n}`]
}

export function isTierAvailable(meta, n) {
  return Boolean(getTier(meta, n))
}
