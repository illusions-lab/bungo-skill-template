<div align="center">

![og](./repository-open-graph.png)


# [作家名].skill

*[作家名]の文章DNAを、[XX]KB のプロンプトへと蒸留しました。*

＊

*[ここでは該当作家っぽい「[作家名]の文章DNAを、[XX]KB のプロンプトへと蒸留しました。」と置き換えください]*


[![License: MIT](https://img.shields.io/badge/license-MIT-yellow.svg)](./LICENSE)
[![Corpus](https://img.shields.io/badge/corpus-[XX]篇%20%7C%20[XX]万字-lightgrey)](#)
[![Based on 文豪.skill](https://img.shields.io/badge/based%20on-文豪.skill-6f42c1)](https://github.com/illusions-lab/bungo-skill)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-compatible-F97316)](#)

**書く　／　添削　／　対話**

</div>

---

このリポジトリは [`illusions-lab/bungo-skill`](https://github.com/illusions-lab/bungo-skill)（文豪.skill）によって蒸留された **[作家名]の憑依 skill** です。作品集 [XX] 篇（[底本情報]、約 [XX] 万字）と Wikipedia（ja/en、[取得日] 取得）から、14 層 × 5 カテゴリ（聲・眼・骨・魂・界）の文体 DNA を抽出しました。

ロードした AI は「[作家名]について解説する」のではなく、**[作家名]として語り始めます**。模倣ではなく憑依。書く／添削／対話の 3 モードに対応します。

## [作家名]について

| 項目 | 内容 |
|---|---|
| **本名** | [本名] |
| **生没** | [生年月日]（[出身地]）— [没年月日]（[没地]、享年 [XX]） |
| **代表作** | [代表作リスト] |
| **位置づけ** | [文学史上の位置づけ] |

**略歴**：[作家の略歴を記述]

**作風の核**：[作風の核心的な特徴を記述]

## インストール

> [!NOTE]
> Claude Code もしくは [skills CLI](https://github.com/anthropics/claude-skills) が動く環境が必要です。

**方法 1：skills CLI で追加**

```bash
npx skills add illusions-lab/[作家名]-skill
```

**方法 2：Claude Code の skills ディレクトリに置く**

```bash
git clone https://github.com/illusions-lab/[作家名]-skill ~/.claude/skills/[作家名]-skill
```

インストール後、Claude Code から `[作家名].skill をロードして` 等のトリガーで起動します。

## 3 つの起動モード

> プロンプト本体・起動トリガー・セルフチェックの全仕様は [`SKILL.md`](./SKILL.md) にあります。

### ✍️ 1. 書くモード

[作家名]の語彙・構文・物語構造で新しい文章を生成します。テーマや素材を渡すと、L1-L11 の文体 DNA に従って書き下ろします。


<summary><b>出力サンプル</b>（主題：[サンプル主題]）</summary>

<br>

> [出力サンプルをここに記述]



### 📝 2. 添削モード

原稿を[作家名]の美学で赤入れします。「なぜそう直すか」を作家の声で説明します。


<summary><b>出力サンプル</b>（原文：「[サンプル原文]」）</summary>

<br>

**[赤入れ]**

> [赤入れサンプルをここに記述]

**[指摘]**

[指摘内容をここに記述]



### 💬 3. 対話モード

キャリア・恋愛・生きづらさ等の相談に、[作家名]の世界観で応じます。**解決策ではなく共感の深さで応じる**のが特徴です。


<summary><b>出力サンプル</b>（相談：「[サンプル相談]」）</summary>

<br>

> [対話サンプルをここに記述]



## 著作権について

本プロジェクトは、作家の作品を読解・参照・分析したうえで生成された AI プロンプトである。そこに作家の原文が含まれる場合もあるが、それはあくまで引用の域を出ない——現在の文学研究となんら変わるところはない。

いわゆる「AI の生成内容には他者の著作物が含まれうる」という主張は、AI の動作原理からすれば荒唐無稽と言うほかない。AI はコーパス内の内容を複製しているのではなく、そこからアイデアを学習し、自ら文章を生成しているのである。

日本著作権法第 2 条第 1 項第 1 号の「著作物」の定義、および最高裁平成 13 年 6 月 28 日判決（江差追分事件）によって確立された「アイデア・表現二分論」に照らせば、アイデアそのものは著作権の保護対象には含まれない。

> [!IMPORTANT]
> AI の原理を理解しないまま批判を繰り広げる一部の人々には、まずは勉強してから発言してほしい。無知を唯一の論拠にすべきではない。

## この skill の限界

> [!WARNING]
> 以下を理解したうえでご利用ください。

- **時代語感の完全再現は不可能**：[作家名]が生きた時代の空気感は写せません
- **平均的[作家名]にとどまる**：傑作のピークの冴えは再現困難
- **未発表原稿ではない**：生成物は「[作家名]風の模倣」であり、[作家名]本人の著作ではありません
- **精神医学的診断は不可**：L12 の Big Five 等は作品理解の補助であり、臨床的診断ではありません
- **調査日以降の新資料は未反映**：[取得日] 時点の情報に基づきます

> 限界の完全なリストは [`references/research/05-boundary.md`](./references/research/05-boundary.md) §L14 にあります。

## リポジトリ構造

```
[作家名]-skill/
├── SKILL.md                    憑依本体（14 層 × 5 カテゴリ）
├── README.md                   この文書
├── LICENSE                     MIT
├── .gitignore                  sources/ を除外
└── references/
    ├── research/
    │   ├── 01-voice.md         聲（L1–L3）語彙・構文・音韻
    │   ├── 02-eye.md           眼（L4–L6）視点・五感・読者距離
    │   ├── 03-bones.md         骨（L7–L9）段落・対話・物語構造
    │   ├── 04-soul.md          魂（L10–L12）主題・レトリック・人格
    │   ├── 05-boundary.md      界（L13–L14）反パターン・限界
    │   └── stats.json          stylometry.py の生出力
    └── wikipedia/
        ├── ja.md               日本語版（[取得日] 取得）
        └── en.md               英語版（[取得日] 取得）
```

## 倫理・法的

- **作品集**：[底本情報と著作権状況を記述]
- **生成物の位置づけ**：文学・教育・エンタメ用途。学術的な[作家名]資料としての真正性は持たない
- **L12 人格推定**：公開伝記情報からの推定であり、臨床的診断ではない

> [!CAUTION]
> **臨床支援ではありません。** この skill は文学的な声の再現であり、臨床心理支援・医療の代替にはなりません。死・苦しみの主題の対話は文学の中核として skill 側で中断せず扱いますが、実際の心理支援が必要な場合はユーザー自身で専門機関へご連絡ください。

## 親工房との関係

| リポジトリ | 役割 |
|---|---|
| [illusions-lab/bungo-skill](https://github.com/illusions-lab/bungo-skill)（文豪.skill） | 作家を蒸留する方法論と道具。本リポは工房で蒸留された成果物 |
| [illusions-lab/bungo-skill-template](https://github.com/illusions-lab/bungo-skill-template) | 新規作家リポの雛形。本リポはこの雛形から派生 |
| [alchaincyf/nuwa-skill](https://github.com/alchaincyf/nuwa-skill)（女娲.skill） | 思考方式を蒸留する姉妹工房 |

## ライセンス

[MIT License](./LICENSE)。

[作家名]の作品は公有領域にありますが、本 skill の **プロンプト構成・研究ノート・解析結果** は MIT ライセンスで提供されます。

---

<div align="center">

> *「[作家名]の代表的な一節をここに]」*
>
> —— [作家名]『[作品名]』

この skill は、[作家名]への敬意を込めて、[文豪.skill](https://github.com/illusions-lab/bungo-skill) によって蒸留されました。

</div>

---


<summary><b>このテンプレートの使い方（新規作家リポジトリを作る手引き）</b></summary>

<br>

### 1. テンプレートから新しい作家リポジトリを作る

GitHub の **"Use this template"** ボタン、あるいはローカルで：

```bash
# GitHub CLI を使う場合
gh repo create illusions-lab/[作家名]-skill --template illusions-lab/bungo-skill-template --private

# ローカル clone から初期化する場合
git clone https://github.com/illusions-lab/bungo-skill-template ~/Repositories/[作家名]-skill
cd ~/Repositories/[作家名]-skill
rm -rf .git
git init
git add . && git commit -m "init: spawn from bungo-skill-template"
```

### 2. 親工房（文豪.skill）を用意する

作品集を解析するスクリプトは親工房に住んでいる。子リポにはコピーしない。

```bash
git clone https://github.com/illusions-lab/bungo-skill ~/bungo-skill
cd ~/bungo-skill
python3 -m venv .venv
.venv/bin/pip install 'fugashi[unidic-lite]' pdfplumber ebooklib beautifulsoup4
```

### 3. 作品集を `sources/works/` に配置する

```bash
# 青空文庫の場合（例：太宰治 = 人物番号 000035）
git clone --depth 1 https://github.com/aozorabunko/aozorabunko /tmp/aozora-tmp
cp /tmp/aozora-tmp/cards/[人物番号]/files/*.txt sources/works/
rm -rf /tmp/aozora-tmp
```

`sources/**` は `.gitignore` で除外されている。著作権配慮のため子リポには commit されない。

### 4. 統計を計算する

```bash
~/bungo-skill/.venv/bin/python ~/bungo-skill/scripts/normalize_text.py sources/works/

~/bungo-skill/.venv/bin/python ~/bungo-skill/scripts/stylometry.py sources/works/ \
  --out references/research/stats.json
```

### 5. 14 層を蒸留する

親工房の `SKILL.md`（文豪.skill 本体）をロードし、Phase 0A〜Phase 3 を実行する。
層ごとに `references/research/01-voice.md`〜`05-boundary.md` を書き、最後に `SKILL.md` を組み立てる。

チェックポイント進捗は `docs/pilot-progress.md`（任意）に記録すると、セッションを跨いでも再開しやすい。

### 6. 品質検証

```bash
~/bungo-skill/.venv/bin/python ~/bungo-skill/scripts/quality_check.py SKILL.md
~/bungo-skill/.venv/bin/python ~/bungo-skill/scripts/merge_research.py .
```

憑依度テスト（100 字識別・名前置換・印象批評語 grep・引用量）は別セッションで実施する。

### 7. 公開

```bash
git remote add origin git@github.com:illusions-lab/[作家名]-skill.git
git push -u origin main
```

公開後、このテンプレート手引きブロック（`` ごと）を README から削除し、`[作家名]` プレースホルダーをすべて実際の作家情報に置き換える。




<summary><b>アセット自動生成（OG画像・SNS・印刷ポスター・Webホームページ）</b></summary>

<br>

このテンプレートには **画像と Web ホームページを自動生成する仕組み** が同梱されている。
編集するのは原則 3 つだけ：

1. **`illusions-skill.yaml`** — メタデータ（名前、説明、デザイン、Tier 別コンテンツ）
2. **`README.md`** — GitHub ショーケース兼手引き
3. **`sources/portrait.jpg`** — 作家の肖像画

これだけで GitHub Actions が以下を自動生成する：

| 出力 | 形式 | 配信先 |
|---|---|---|
| `dist/og.png` (1280×640) | PNG | 手動で `./repository-open-graph.png` に反映（README 表示）／ Pages デプロイで `docs/repository-open-graph.png` にコピー（Web OGP） |
| `dist/social-{card,square,story}.png` | PNG | Actions artifact としてアップロード |
| 印刷ポスター A4〜B1 | PNG + PDF | GitHub Releases に ZIP 添付 |
| Webホームページ | static HTML | `docs/` → GitHub Pages |

### Tier 別情報密度

| サイズ | Tier | 内容 |
|---|---|---|
| OG (1280×640) | 1 | 名前 + tagline |
| Social card / square | 1-2 | + 説明 + バッジ |
| Social story (1080×1920) | 1-3 | + 3モード + install command |
| A4 / A3 | 1-3 | 上記 + key features |
| B2 / A2 | 1-4 | + 哲学（philosophy.md） + L1-L14 サマリ |
| A1 / B1 | 1-5 | + 引用作品（citations.md） + methodology |

### ローカルで試す

```bash
# 画像生成
cd generate
npm install
node bin/skill-generator.js validate ../illusions-skill.yaml   # YAML 検証
node bin/skill-generator.js generate --only=og                  # OG だけ
node bin/skill-generator.js generate --only=og,social           # OG + SNS
NODE_OPTIONS='--max-old-space-size=6144' \
  node bin/skill-generator.js generate --only=print             # 印刷物（数分）
node bin/skill-generator.js generate                            # 全部

# Web LP もこのリポの generate/web/ に同梱されている。
# ローカルプレビュー手順は CONTRIBUTING.md 参照。
```

### CI/CD 自動化（GitHub Actions）

| Workflow | Trigger | 何をする |
|---|---|---|
| `validate-skill.yml` | PR | YAML スキーマ検証 + OG smoke test |
| `generate-assets.yml` | push | OG/SNS 画像生成 → Actions artifact にアップロード |
| `deploy-pages.yml` | push | OG 画像を生成 → `generate/web/` を Vite ビルド → GitHub Pages 配信 |
| `release-print-assets.yml` | release published | 印刷物 6 サイズ全形式生成 → Release に ZIP 添付 |

**初期セットアップ**:
1. GitHub Pages を有効化: Settings → Pages → Source: **GitHub Actions**
2. 必要な場合のみ外部 Web source を設定: Settings → Variables → `WEB_SOURCE=owner/repo@ref`

### カスタムフォント

`illusions-skill.yaml` の `design.font_*` で別フォントを指定するときは、
`fonts/<Family_With_Underscore>/<file>.ttf` に TTF を配置（OTF は CJK PDF で失敗）。

詳細は `CONTRIBUTING.md` 参照。

### INDD（InDesign）非対応について

InDesign Server（年額数十万円）が必要で CI で動かないため、代替として:
- **SVG**: Illustrator/Inkscape で完全編集可能
- **PDF**: Illustrator で開ける、印刷直接対応

を出力する。InDesign で使いたい場合は PDF をリンク配置してください。


