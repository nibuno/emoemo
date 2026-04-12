# CLAUDE.md

このファイルはAIエージェント（Claude等）向けの開発ガイドラインです。

## プロジェクトの文脈

- 開発者: @nibuno（普段はDjango + Vue.jsで開発）
- 目的: TypeScript学習 & 趣味開発
- 優先度: 動くものを作る < TypeScriptの型を意識した学習

## 開発コマンド

```bash
npm run dev      # 開発サーバー起動 → http://localhost:5173/emoemo/
npm run build    # 本番ビルド
npm run lint     # ESLint実行
npm run preview  # ビルド後のプレビュー
```

## コーディング方針

### TypeScript
- `any` は使わない。型定義を明示する
- 型は別ファイル（`types/` ディレクトリ）に切り出すことを検討
- コンポーネントのPropsは必ず型定義する

### React
- 関数コンポーネント + Hooks を使用
- 状態管理は最初はuseStateで十分。複雑になったらuseReducerを検討
- コンポーネントは小さく保つ

### スタイリング
- 初期段階ではCSS Modulesまたはインラインスタイルで進める
- 必要に応じてTailwind CSS等の導入を検討

### ディレクトリ構成（予定）
```
src/
├── components/     # UIコンポーネント
│   ├── SettingsPanel/
│   ├── TextInput/
│   └── Preview/
├── hooks/          # カスタムフック
├── types/          # 型定義
├── utils/          # ユーティリティ関数
└── App.tsx
```

## 技術選定の理由

| 選定 | 理由 |
|------|------|
| React | TypeScriptとの統合が自然。型推論が効きやすい |
| Vite | 設定が軽量。学習のノイズが少ない |
| Canvas API | 画像生成に必要。ライブラリなしで基礎を学ぶ |

## 意思決定ログ

- 2025-12-18: React + TypeScript + Vite で開始
- Vue.jsも候補だったが、TypeScript学習目的ならReactの方が型の恩恵を受けやすいと判断

## 注意事項

- 過度な抽象化は避ける（学習目的なので、シンプルに保つ）
- ライブラリ追加は最小限に（まずは標準APIで実装を試みる）
- 迷ったら@nibunoに確認する

## 環境変数の取り扱い

- `VITE_` prefix の env は **ビルド時にバンドル JS へ焼き込まれる = 公開情報**
- 秘匿値（API キー・トークン等）は絶対に `VITE_*` に入れない。Workers 側など非公開な経路に置く
- Workers URL のような "どうせ公開される値" のみ `VITE_*` に入れて `.env.production` にコミットしてよい
