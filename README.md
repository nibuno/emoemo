# emoemo

Slack / Discord 向けのカスタム絵文字をブラウザで作れる、かんたん emoji メーカー。

**公開先**: https://nibuno.github.io/emoemo/

![emoemo](./public/ogp.png)

## 特徴

- テキストを入力するだけで 128×128 の PNG を生成・ダウンロード
- 複数フォント・カラーのプレビューを並べて比較しながら選択
- 「おまかせ」ボタンで入力テキストに合うフォントと色を AI が提案
- ブラウザ内で完結（「おまかせ」実行時のみ外部エンドポイントにテキストを送信）

## 技術スタック

- フロントエンド: React + TypeScript + Vite + Tailwind CSS（Canvas API で描画）
- 「おまかせ」バックエンド: [emoemo-proxy](https://github.com/nibuno/emoemo-proxy)（Cloudflare Workers + Workers AI）

## 開発

```bash
npm install
npm run dev      # http://localhost:5173/emoemo/
npm run build
npm run lint
npm run preview
```

## 環境変数

`VITE_AUTO_STYLE_ENDPOINT` に emoemo-proxy の URL を設定する。未設定の場合は「おまかせ」ボタンのみエラーになり、他の機能は通常どおり動作する。

```sh
cp .env.example .env.local
# .env.local を編集
```

### ⚠️ VITE_* は公開前提
`VITE_` で始まる環境変数は **Vite のビルド時にバンドル JS へ焼き込まれる**。デプロイ後はブラウザの DevTools から誰でも参照できる公開情報になる。

- 公開して問題ない値（API エンドポイントの URL など）のみ `VITE_*` に入れる
- API キー・トークン・シークレット等は **絶対に `VITE_*` に入れない**。Workers 側など非公開な場所に置く
- `.env.production` は GitHub にコミット済み（URL は公開情報のため）。`.env.local` は gitignore 継続

## ディレクトリ構成

```
src/
├── components/   UI コンポーネント
├── hooks/        カスタムフック
├── utils/        描画・API クライアント
├── types/        型定義
└── constants.ts  フォント・カラー定義
```

## 補足

TypeScript 学習を兼ねた個人プロジェクトです。Issue は歓迎しますが、PR は事前にご相談ください。AI エージェント向けの開発ガイドラインは [CLAUDE.md](./CLAUDE.md) を参照。
