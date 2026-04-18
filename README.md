# [作家名]-skill （テンプレートから生成）

> *[作家名]を、1 つのプロンプトへと蒸留します。*

このリポジトリは [`illusions-lab/bungo-skill-template`](https://github.com/illusions-lab/bungo-skill-template) から生成されました。親工房 [`illusions-lab/bungo-skill`](https://github.com/illusions-lab/bungo-skill)（文豪.skill）のスクリプトと方法論に従って、[作家名] の文体 DNA を蒸留します。

---

## 使い方（このテンプレートを複製する側の手引書）

### 1. テンプレートから新しい作家リポジトリを作る

GitHub の **"Use this template"** ボタン、あるいはローカルで：

```bash
# GitHub CLI を使う場合
gh repo create illusions-lab/太宰治-skill --template illusions-lab/bungo-skill-template --private

# ローカル clone から初期化する場合
git clone https://github.com/illusions-lab/bungo-skill-template ~/Repositories/太宰治-skill
cd ~/Repositories/太宰治-skill
rm -rf .git
git init
git add . && git commit -m "init: spawn from bungo-skill-template"
```

### 2. 親工房（文豪.skill）を用意する

作品集を解析するスクリプトは親工房に住んでいる。子リポにはコピーしない。

```bash
# まだ無ければ clone
git clone https://github.com/illusions-lab/bungo-skill ~/bungo-skill

# Python 依存（venv 推奨）
cd ~/bungo-skill
python3 -m venv .venv
.venv/bin/pip install 'fugashi[unidic-lite]' pdfplumber ebooklib beautifulsoup4
```

### 3. 作品集を `sources/works/` に配置する

```bash
# 青空文庫の場合（太宰治 = 人物番号 000035）
git clone --depth 1 https://github.com/aozorabunko/aozorabunko /tmp/aozora-tmp
cp /tmp/aozora-tmp/cards/000035/files/*.txt sources/works/
rm -rf /tmp/aozora-tmp
```

`sources/**` は `.gitignore` で除外されている。著作権配慮のため子リポには commit されない。

### 4. 統計を計算する

```bash
# PDF/epub/html を正規化（青空文庫 txt はそのままでも通る）
~/bungo-skill/.venv/bin/python ~/bungo-skill/scripts/normalize_text.py sources/works/

# L1-L3 統計を JSON で出す
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
# GitHub 側で repo を作成したあと
git remote add origin git@github.com:illusions-lab/[作家名]-skill.git
git push -u origin main
```

インストール側は：

```bash
npx skills add illusions-lab/[作家名]-skill
```

---

## リポジトリ構造

```
[作家名]-skill/
├── SKILL.md                    憑依本体（14 層 × 5 カテゴリ）
├── README.md                   この文書
├── LICENSE                     MIT
├── .gitignore                  sources/ を除外
├── references/
│   ├── research/
│   │   ├── 01-voice.md         聲（L1-L3）
│   │   ├── 02-eye.md           眼（L4-L6）
│   │   ├── 03-bones.md         骨（L7-L9）
│   │   ├── 04-soul.md          魂（L10-L12）
│   │   ├── 05-boundary.md      界（L13-L14）
│   │   └── stats.json          stylometry.py の生出力
│   └── wikipedia/
│       ├── ja.md
│       └── en.md
└── sources/                    GIT 除外、ユーザー持込
    └── works/
```

---

## 倫理・法的

- **作品集は公有領域または正規ライセンス下のもののみ**。青空文庫は日本の著作権法で保護期間が満了した作品を公開している。
- **生存作家は原則として対象外**。例外として本人許諾を得た場合のみ。
- 生成文は [作家名] 本人の作ではない。蒸留プロンプトによる再構成である旨、skill 起動時に明示される。
- L12 人格推定は**公開情報からの推定**であり、臨床的診断ではない。

---

## 親工房との関係

- **[illusions-lab/bungo-skill](https://github.com/illusions-lab/bungo-skill)**（文豪.skill）：作家を蒸留する方法論と道具。本リポは工房で蒸留された成果物。
- **[illusions-lab/bungo-skill-template](https://github.com/illusions-lab/bungo-skill-template)**：新規作家リポの雛形。本リポはこの雛形から派生。
- **[alchaincyf/nuwa-skill](https://github.com/alchaincyf/nuwa-skill)**（女娲.skill）：思考方式を蒸留する姉妹工房。

---

> *この雛形は [文豪.skill](https://github.com/illusions-lab/bungo-skill) が蒸留の再現性を保つために用意したものです。*
