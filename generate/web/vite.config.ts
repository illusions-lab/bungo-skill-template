import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import yaml from '@rollup/plugin-yaml'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// docs/ ディレクトリは GitHub Pages の配信元
export default defineConfig({
  plugins: [vue(), yaml()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@root': resolve(__dirname, '../..'),
    },
  },
  build: {
    outDir: resolve(__dirname, '../../docs'),
    // docs/fonts/ など既存 commit 済みファイルを保護するため emptyOutDir: false
    // 古い hash 付き成果物が残る場合は `npm run clean` (rm -rf docs/assets docs/.vite) で対応
    emptyOutDir: false,
    assetsDir: 'assets',
  },
  base: './',
  server: { port: 5173 },
})
