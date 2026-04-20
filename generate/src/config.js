// 全媒体・全形式・全Tier の単一定義ファイル
// すべて px @ 300dpi で記述（A4 = 210×297mm × 11.811px/mm）

export const SUPPORTED_SCHEMA_VERSIONS = ['1']

// ───────────────────────────────────────────────
// アセット定義: id, size, tier, formats, template
// ───────────────────────────────────────────────
// 出力ポリシー:
//   - すべて dist/ 直下にフラットに出力（ネスト無し）
//   - ファイル名 = アセット ID + 形式拡張子（例: dist/og.png, dist/a4.pdf）
//   - 形式は PNG + PDF のみ（OG/SNS は PNG、印刷物は PNG+PDF）
//   - 必要になれば formats に 'svg', 'jpg', 'psd', 'psb' を追加可能
//   - OG だけは GitHub の自動 OG 機能のため repo root にもコピーされる（CLI が処理）
export const ASSETS = {
  og: {
    width: 1280,
    height: 640,
    tier: 1,
    formats: ['png'],
    template: 'og-image.svg.hbs',
  },
  'social-card': {
    width: 1200,
    height: 630,
    tier: 2,
    formats: ['png'],
    template: 'social-card.svg.hbs',
  },
  'social-square': {
    width: 1080,
    height: 1080,
    tier: 2,
    formats: ['png'],
    template: 'social-square.svg.hbs',
  },
  'social-story': {
    width: 1080,
    height: 1920,
    tier: 3,
    formats: ['png'],
    template: 'social-story.svg.hbs',
  },
  a4: {
    width: 2480,
    height: 3508,
    tier: 3,
    formats: ['png', 'pdf'],
    template: 'poster-small.svg.hbs',
  },
  a3: {
    width: 3508,
    height: 4961,
    tier: 3,
    formats: ['png', 'pdf'],
    template: 'poster-small.svg.hbs',
  },
  b2: {
    width: 5906,
    height: 8350,
    tier: 4,
    formats: ['png', 'pdf'],
    template: 'poster-medium.svg.hbs',
  },
  a2: {
    width: 4961,
    height: 7016,
    tier: 4,
    formats: ['png', 'pdf'],
    template: 'poster-medium.svg.hbs',
  },
  a1: {
    width: 7016,
    height: 9933,
    tier: 5,
    formats: ['png', 'pdf'],
    template: 'poster-large.svg.hbs',
  },
  b1: {
    width: 8350,
    height: 11811,
    tier: 5,
    formats: ['png', 'pdf'],
    template: 'poster-large.svg.hbs',
  },
}

export const DIST_DIR = 'dist'

// ───────────────────────────────────────────────
// グループ（CLI --only=og,social,print 用）
// ───────────────────────────────────────────────
export const GROUPS = {
  og: ['og'],
  social: ['social-card', 'social-square', 'social-story'],
  print: ['a4', 'a3', 'b2', 'a2', 'a1', 'b1'],
  all: ['og', 'social-card', 'social-square', 'social-story', 'a4', 'a3', 'b2', 'a2', 'a1', 'b1'],
}

// ───────────────────────────────────────────────
// PSD/PSB 制限
// ───────────────────────────────────────────────
export const PSD_MAX_DIMENSION = 30_000 // PSD 仕様の最大辺
export const PSD_MAX_FILE_SIZE = 1.8 * 1024 ** 3 // 安全マージン込み 1.8GB

// ───────────────────────────────────────────────
// デフォルト出力設定
// ───────────────────────────────────────────────
export const DEFAULT_OUTPUT = {
  jpg_quality: 90,
  pdf_color_space: 'rgb',
  large_format: 'psb',
}

// ───────────────────────────────────────────────
// デフォルトデザイントークン
// ───────────────────────────────────────────────
export const DEFAULT_DESIGN = {
  accent_color: '#6B7280',
  background: '#0d0d0d',
  noise_opacity: 0.04,
  font_title: 'Zen Antique',
  font_mono: 'Fira Code',
  font_body: 'Zen Antique',
}
