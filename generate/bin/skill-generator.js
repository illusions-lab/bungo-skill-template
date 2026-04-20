#!/usr/bin/env node
// skill-generator CLI
//
// Usage:
//   skill-generator validate [<yaml>]
//   skill-generator generate [--only=og,social,print,all] [<yaml>]
//
// デフォルト yaml は ../illusions-skill.yaml （generate/ から見て1つ上）

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

import { ASSETS, GROUPS, DEFAULT_OUTPUT, DIST_DIR } from '../src/config.js'
import { resolveContent } from '../src/content-loader.js'
import { validateSkill, ValidationError } from '../src/validator.js'
import { buildFontResolver, loadFontBuffer } from '../src/font-resolver.js'
import { renderSvg } from '../src/pipelines/svg-render.js'
import { outlineTextInSvg } from '../src/pipelines/outline-text.js'
import { svgToPng } from '../src/pipelines/svg-to-png.js'
import { pngToJpg } from '../src/pipelines/png-to-jpg.js'
import { svgToPdf } from '../src/pipelines/svg-to-pdf.js'
import { svgToPsd } from '../src/pipelines/svg-to-psd.js'
import { wrapJapanese } from '../src/text/budoux-wrap.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const GENERATE_DIR = path.resolve(__dirname, '..')



function parseCli(argv) {
  const cmd = argv[0]
  const { values, positionals } = parseArgs({
    args: argv.slice(1),
    options: {
      only: { type: 'string' },
      help: { type: 'boolean', short: 'h' },
    },
    allowPositionals: true,
    strict: false,
  })
  return { cmd, opts: values, positional: positionals }
}

function defaultYamlPath(repoRoot) {
  return path.join(repoRoot, 'illusions-skill.yaml')
}

function findRepoRoot(yamlArg) {
  if (yamlArg) return path.dirname(path.resolve(yamlArg))
  // generate/ ディレクトリの一つ上を repo root とする
  return path.resolve(GENERATE_DIR, '..')
}

function expandTargets(onlyArg) {
  const tokens = (onlyArg ?? 'all').split(',').map((s) => s.trim()).filter(Boolean)
  const set = new Set()
  for (const t of tokens) {
    if (GROUPS[t]) {
      for (const a of GROUPS[t]) set.add(a)
    } else if (ASSETS[t]) {
      set.add(t)
    } else {
      throw new Error(`Unknown target: ${t}. Valid: ${Object.keys(GROUPS).concat(Object.keys(ASSETS)).join(', ')}`)
    }
  }
  return [...set]
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
}

function buildContext(meta, assetSpec, repoRoot, fontResolver) {
  // テキストの事前折返し（philosophy / sample / citations / methodology）
  const fontBodyPath = fontResolver(meta.design.font_body)
  const fontMonoPath = fontResolver(meta.design.font_mono)

  // Tier 別折返し幅と font-size（テンプレと整合させる必要あり）
  // poster-medium: width 4961, philosophy 内幅 ≈ 3961
  // poster-large: width 7016, philosophy 内幅 ≈ 5616
  // 簡略化: asset の width に応じて算出
  const W = assetSpec.width
  const innerWidth = Math.floor(W * 0.78)
  const philFontSize = W > 6000 ? 68 : W > 4000 ? 48 : 36
  const citFontSize = W > 6000 ? 48 : 36
  const methFontSize = W > 6000 ? 36 : 28

  const wrappedPhilosophy = meta.tier_4?.philosophy
    ? wrapJapanese(stripMd(meta.tier_4.philosophy), innerWidth, philFontSize, fontBodyPath).slice(0, 6)
    : null
  const wrappedSample = meta.tier_4?.sample_output
    ? wrapJapanese(stripMd(meta.tier_4.sample_output), innerWidth, philFontSize, fontBodyPath).slice(0, 6)
    : null
  const wrappedCitations = meta.tier_5?.citations
    ? wrapJapanese(stripMd(meta.tier_5.citations), innerWidth, citFontSize, fontBodyPath).slice(0, 10)
    : null
  const wrappedMethodology = meta.tier_5?.methodology
    ? wrapJapanese(meta.tier_5.methodology, innerWidth, methFontSize, fontMonoPath).slice(0, 5)
    : null

  const tagline = meta.tier_1?.tagline ?? ''
  const taglineLines = tagline
    .split('、')
    .map((s, i, a) => (i < a.length - 1 ? s + '、' : s))
    .filter(Boolean)

  return {
    ...meta,
    width: assetSpec.width,
    height: assetSpec.height,
    portraitDataURI: meta.portrait?.dataURI ?? null,
    kanjiDataURI: meta.kanjiDataURI ?? null,
    kanjiGlowDataURI: meta.kanjiGlowDataURI ?? null,
    taglineLines,
    wrappedPhilosophy,
    wrappedSample,
    wrappedCitations,
    wrappedMethodology,
  }
}

// 雑な markdown stripping: 行頭の # や - を除去、コードフェンス除去
function stripMd(md) {
  return md
    .split(/\n/)
    .filter((line) => !line.startsWith('```'))
    .map((line) => line.replace(/^#+\s*/, '').replace(/^[-*]\s*/, '・').replace(/`/g, ''))
    .filter((line) => line.trim() !== '')
    .join('\n')
}

function uniqueDesignFontFamilies(meta) {
  return [...new Set([meta.design.font_title, meta.design.font_mono, meta.design.font_body])]
}

async function generateAsset(assetId, assetSpec, meta, repoRoot, fonts) {
  const { fontResolver, fontBuffers } = fonts
  console.log(`\n[${assetId}] ${assetSpec.width}×${assetSpec.height} (tier ${assetSpec.tier})`)

  if (!meta[`tier_${assetSpec.tier}`] && assetSpec.tier > 1) {
    console.warn(`  [SKIP] tier_${assetSpec.tier} missing in YAML`)
    return { skipped: true }
  }

  const context = buildContext(meta, assetSpec, repoRoot, fontResolver)
  let svg = renderSvg(assetSpec.template, context)
  svg = outlineTextInSvg(svg, fontResolver)

  const outDir = path.resolve(repoRoot, DIST_DIR)
  ensureDir(path.join(outDir, '_'))
  const outputPath = (ext) => path.join(outDir, `${assetId}.${ext}`)

  const formats = assetSpec.formats
  const isOg = assetId === 'og'
  const jpgQuality = meta.output?.jpg_quality ?? DEFAULT_OUTPUT.jpg_quality
  const outputs = {}

  if (formats.includes('svg')) {
    const svgPath = outputPath('svg')
    fs.writeFileSync(svgPath, svg)
    outputs.svg = svgPath
    console.log(`  ✓ ${path.relative(repoRoot, svgPath)}`)
  }

  // PNG/PDF は独立なので並列。JPG は PNG 後段。PSD はメモリ重いので別チェーン。
  const lightTasks = []

  if (formats.includes('png')) {
    lightTasks.push((async () => {
      const pngPath = outputPath('png')
      svgToPng(svg, pngPath, {
        fontBuffers,
        defaultFontFamily: meta.design.font_body,
        fitToWidth: assetSpec.width,
        resourcesDir: GENERATE_DIR,
      })
      outputs.png = pngPath
      console.log(`  ✓ ${path.relative(repoRoot, pngPath)}`)


      if (formats.includes('jpg')) {
        const jpgPath = outputPath('jpg')
        await pngToJpg(pngPath, jpgPath, { quality: jpgQuality })
        outputs.jpg = jpgPath
        console.log(`  ✓ ${path.relative(repoRoot, jpgPath)}`)
      }
    })())
  }

  if (formats.includes('pdf')) {
    lightTasks.push((async () => {
      const pdfPath = outputPath('pdf')
      try {
        await svgToPdf(svg, {
          width: assetSpec.width,
          height: assetSpec.height,
          outputPath: pdfPath,
          fontResolver,
          fontFamilies: uniqueDesignFontFamilies(meta),
        })
        outputs.pdf = pdfPath
        console.log(`  ✓ ${path.relative(repoRoot, pdfPath)}`)
      } catch (e) {
        console.warn(`  [WARN] PDF generation failed: ${e.message}`)
      }
    })())
  }

  await Promise.all(lightTasks)

  const wantsPsd = formats.includes('psd')
  const wantsPsb = formats.includes('psb')
  if (wantsPsd || wantsPsb) {
    const ext = wantsPsb ? 'psb' : 'psd'
    const psdPath = outputPath(ext)
    try {
      const result = await svgToPsd(svg, {
        width: assetSpec.width,
        height: assetSpec.height,
        outputPath: psdPath,
        fontBuffers,
        format: wantsPsb ? 'psb' : 'auto', // PSD は auto で dimension >30k のとき PSB に昇格
        defaultFontFamily: meta.design.font_body,
      })
      outputs[ext] = psdPath
      console.log(`  ✓ ${path.relative(repoRoot, psdPath)} (${result.format}, ${result.layerCount} layers, ${(result.bytes / 1024 / 1024).toFixed(1)}MB)`)
    } catch (e) {
      console.warn(`  [WARN] PSD/PSB generation failed: ${e.message}`)
    }
  }

  return { outputs }
}

async function cmdValidate(positional) {
  const repoRoot = findRepoRoot(positional[0])
  const yamlPath = positional[0] ? path.resolve(positional[0]) : defaultYamlPath(repoRoot)
  console.log(`Validating ${yamlPath}...`)
  try {
    const result = validateSkill(yamlPath)
    console.log('✓ Schema valid')
    console.log(`  Available fonts:`)
    for (const f of result.availableFonts) {
      console.log(`    - ${f.family}`)
    }
    process.exit(0)
  } catch (e) {
    if (e instanceof ValidationError) {
      console.error(e.message)
      process.exit(1)
    }
    throw e
  }
}

async function cmdGenerate(positional, opts) {
  const repoRoot = findRepoRoot(positional[0])
  const yamlPath = positional[0] ? path.resolve(positional[0]) : defaultYamlPath(repoRoot)

  // Validate first
  let validation
  try {
    validation = validateSkill(yamlPath)
  } catch (e) {
    console.error('Validation failed before generate:')
    console.error(e.message)
    process.exit(1)
  }

  const meta = resolveContent(validation.meta, repoRoot)
  const fontResolver = buildFontResolver()
  const fontBuffers = uniqueDesignFontFamilies(meta).map((f) => loadFontBuffer(f))

  const targets = expandTargets(opts.only)
  console.log(`Generating ${targets.length} asset(s): ${targets.join(', ')}`)

  for (const assetId of targets) {
    const assetSpec = ASSETS[assetId]
    if (!assetSpec) {
      console.warn(`Unknown asset: ${assetId}, skip`)
      continue
    }
    try {
      await generateAsset(assetId, assetSpec, meta, repoRoot, { fontResolver, fontBuffers })
    } catch (e) {
      console.error(`[${assetId}] FAILED: ${e.message}`)
      console.error(e.stack)
    }
  }

  console.log('\nDone.')
}

async function main() {
  const { cmd, opts, positional } = parseCli(process.argv.slice(2))
  switch (cmd) {
    case 'validate':
      return cmdValidate(positional)
    case 'generate':
      return cmdGenerate(positional, opts)
    case undefined:
    case 'help':
    case '--help':
    case '-h':
      console.log(`Usage:
  skill-generator validate [<yaml>]
  skill-generator generate [--only=og,social,print,all] [<yaml>]

Default <yaml>: <repo-root>/illusions-skill.yaml`)
      process.exit(0)
    default:
      console.error(`Unknown command: ${cmd}`)
      process.exit(1)
  }
}

main().catch((e) => {
  console.error(e.stack ?? e.message)
  process.exit(1)
})
