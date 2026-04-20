import fs from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import yaml from '@rollup/plugin-yaml'
import yamlParser from 'js-yaml'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const REPO_ROOT = resolve(__dirname, '../..')
const OUT_DIR = resolve(REPO_ROOT, 'docs')
const SKILL_META_PATH = resolve(REPO_ROOT, 'illusions-skill.yaml')
const DIST_OG_PATH = resolve(REPO_ROOT, 'dist/og.png')
const DOCS_OG_PATH = resolve(OUT_DIR, 'repository-open-graph.png')

interface SkillMeta {
  name?: string
  homepage?: string
  tier_1?: { tagline?: string }
  tier_2?: { description?: string }
}

function loadSkillMeta(): SkillMeta {
  const raw = fs.readFileSync(SKILL_META_PATH, 'utf-8')
  return (yamlParser.load(raw) as SkillMeta) ?? {}
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function resolveOgImage(meta: SkillMeta): string {
  if (meta.homepage) {
    try {
      return new URL('repository-open-graph.png', meta.homepage.endsWith('/') ? meta.homepage : `${meta.homepage}/`).toString()
    } catch {
      // Fall through to relative path if homepage is malformed.
    }
  }
  return './repository-open-graph.png'
}

function resolveOgSource(): string | null {
  return fs.existsSync(DIST_OG_PATH) ? DIST_OG_PATH : null
}

function skillMetaHtmlPlugin(): Plugin {
  return {
    name: 'skill-meta-html',
    transformIndexHtml(html) {
      const meta = loadSkillMeta()
      const title = meta.name?.trim() || 'skill'
      const description = meta.tier_2?.description?.trim() || meta.tier_1?.tagline?.trim() || title
      const ogImage = resolveOgImage(meta)

      return html
        .replaceAll('<%- title %>', escapeHtml(title))
        .replaceAll('<%- description %>', escapeHtml(description))
        .replaceAll('<%- ogImage %>', escapeHtml(ogImage))
    },
  }
}

function copyOgAssetPlugin(): Plugin {
  return {
    name: 'copy-og-asset',
    closeBundle() {
      const source = resolveOgSource()
      if (!source) {
        console.warn('[skill-web] dist/og.png not found; run generator before build')
        return
      }

      fs.mkdirSync(OUT_DIR, { recursive: true })
      fs.copyFileSync(source, DOCS_OG_PATH)
    },
  }
}

// docs/ ディレクトリは GitHub Pages の配信元
export default defineConfig({
  plugins: [vue(), yaml(), skillMetaHtmlPlugin(), copyOgAssetPlugin()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@root': REPO_ROOT,
    },
  },
  build: {
    outDir: OUT_DIR,
    // docs/fonts/ など既存 commit 済みファイルを保護するため emptyOutDir: false
    // 古い hash 付き成果物が残る場合は `npm run clean` (rm -rf docs/assets docs/.vite) で対応
    emptyOutDir: false,
    assetsDir: 'assets',
  },
  base: './',
  server: { port: 5173 },
})
