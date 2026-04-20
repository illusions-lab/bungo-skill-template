# CONTRIBUTING

このリポジトリは **bungo-skill-template** — 作家の文体 DNA を AI prompt に蒸留するためのテンプレート。新しい作家 skill を作るときは、このリポを clone して以下のファイルを編集します。

## 編集する3つのもの

1. **`illusions-skill.yaml`** — メタデータ（名前、説明、タグ、デザイントークン）
2. **`README.md`** — GitHub ショーケース兼作業手引き
3. **`sources/portrait.jpg`** — 作家の肖像画

これだけで、GitHub Actions が自動で:

- `dist/og.png`（OG 画像、PNG — Pages デプロイで `docs/repository-open-graph.png` にコピー）
- 各種 SNS 画像（Instagram square / story、Twitter card、PNG）
- 印刷ポスター（A4〜B1、PNG + PDF）
- `docs/` 配下の静的ホームページ（GitHub Pages 配信）

を生成します。

## ローカル動作確認

```bash
# Generator（同梱）
cd generate && npm install
npm run generate -- --only=og        # OG だけ生成
npm run generate                     # 全部生成
```

Web プレビュー:

```bash
cd generate/web
npm install
npm run dev   # localhost:5173
```

CI でも既定ではこの `generate/web/` をそのまま使う。

## 配置されるディレクトリ

```
your-skill/
├── illusions-skill.yaml         ← 編集
├── README.md                     ← 編集
├── sources/
│   ├── portrait.jpg              ← 配置（顔/全身どちらでも）
│   └── content/
│       ├── philosophy.md         ← 大判ポスター用、任意
│       ├── sample.md             ← 任意
│       └── citations.md          ← 任意
├── generate/                     ← 宣伝用素材生成ツール一式
│   ├── web/                      ← GitHub Pages 用 Vite ソース
│   └── assets/fonts/             ← カスタムフォント追加先（Zen Antique・Fira Code 同梱）
│       └── My_Font/My-Font-Regular.ttf
└── docs/                         ← Vite ビルド出力（CI が自動生成、git 管理外）
```

## デザインに関する重要な注意

### PDF を Illustrator で編集する際の注意

タイトル（`font_title`）はビルド時に **アウトライン化（path 化）** されるため、
Illustrator にフォントが入っていなくても表示崩れしません。ただし **副作用**：
タイトル文字を Illustrator で直接編集することは**できません**。
タイトルを変えたいときは:

1. `illusions-skill.yaml` の `tier_1.name_ja` を編集
2. `npm run generate -- --only=og` で再生成

本文（philosophy / sample / citations）は PDF 内に編集可能テキストとして埋め込まれます。

### カスタムフォント

`design.font_title: "Some Other Font"` を YAML で指定する場合、TTF を以下に置く:

- `generate/assets/fonts/Some_Other_Font/Some-Other-Font-Regular.ttf`
  （Zen Antique・Fira Code はデフォルトで同梱済み）

`cd generate && node bin/skill-generator.js validate` で参照フォントが解決可能か事前確認できます。

## PSD/SVG/JPG/INDD などの追加フォーマットについて

現状の出力は **PNG + PDF** のみ。シンプルさを優先しています。
他形式が必要になったら `generate/src/config.js` の `ASSETS.formats` に追加してください。

- **SVG**: タイトルアウトライン化済み SVG が欲しい場合に追加可能。Illustrator/Inkscape 編集可
- **PSD/PSB**: ag-psd でレイヤー構造保持、ただし B1 サイズで 50MB+ になる
- **JPG**: SNS 軽量配信向け
- **INDD**: Adobe InDesign Server（有償ライセンス）が必要なため非対応。代替は PDF

## CI/CD

`main` への push で:

1. `validate-skill.yml` — YAML スキーマ検証 + OG smoke test（`dist/og.png` が生成できるか）
2. `generate-assets.yml` — OG / SNS 画像を生成 → Actions artifact にアップロード（自動コミットはしない）
3. `deploy-pages.yml` — OG 画像を生成 → `dist/og.png` を `docs/repository-open-graph.png` にコピー → `generate/web/` を Vite ビルド → GitHub Pages 配信
   - **任意**: 外部ソースを使いたい場合のみ `WEB_SOURCE=owner/repo@ref` を repo Variables に設定

GitHub Release を published にすると:

4. `release-print-assets.yml` — 印刷物（A4〜B1）を全形式生成 → ZIP 化して Release に添付

## トラブルシューティング

| 症状 | 原因 | 対処 |
|---|---|---|
| Validate エラー: tier_1 必須項目欠落 | YAML 不備 | `npm run generate -- --validate` でエラー詳細確認 |
| 印刷物の生成が OOM | A1/B1 で PSD 出力 | `large_format: psb` に切替（デフォルト） |
| Illustrator でフォント警告 | 本文テキストは `<text>` のまま | フォント代替で開いて編集 → 再生成 |
| PDF が大きい (>1MB) | フォント subsetting 失敗 | `fontkit` がコードポイント抽出できているか確認 |
| GitHub Pages が更新されない | OG 未生成 / build 対象ズレ | `make og && cd generate/web && npm run build` で再現確認 |
