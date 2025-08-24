# フレーム単位コマ送りプレイヤー

動画ファイルをフレーム単位で精密に制御できるWebアプリケーションです。VideoDecoder APIとFFmpeg.wasmの2つの実装を並列で提供し、比較検証が可能です。

## 機能

- フレーム単位での前進・後退（±1フレーム、±10フレーム）
- 可変速再生（0.25x～2x）
- 60fps更新による滑らかな再生
- フレーム番号と時刻の同時表示
- 動画メタデータの表示（解像度、フレームレート、ビットレート等）

## 技術スタック

- React 19 + TypeScript
- Vite（ビルドツール）
- Mantine v8（UIライブラリ）
- Biome（リンター・フォーマッター）

## セットアップ

### 必要要件

- Node.js 24
- pnpm 10

### インストール

```bash
pnpm install
```

### 開発サーバー起動

```bash
pnpm dev
```

### ビルド

```bash
pnpm build
```

### コード品質チェック

```bash
pnpm check  # Biomeによるリント・フォーマット
```

## プロジェクト構成

```
src/
├── components/
│   ├── VideoDecoderPlayer/    # VideoDecoder API実装
│   │   └── SimpleVideoPlayer.tsx
│   ├── FFmpegPlayer/          # FFmpeg.wasm実装
│   │   └── SimpleFFmpegPlayer.tsx
│   └── VideoFilePicker/       # ファイル選択UI
│       └── VideoFilePicker.tsx
├── App.tsx                    # メインコンポーネント
└── main.tsx                   # エントリーポイント
```

## 実装の違い

### VideoDecoder API版
- ブラウザネイティブのHTML5 video要素を使用
- 低レイテンシーで軽量な実装

### FFmpeg.wasm版
- WebAssemblyコンパイル版FFmpegを使用
- より高度な動画処理が可能

## ブラウザ要件

- Chrome/Edge 94以上
- Firefox 100以上
- Safari 15.4以上

## ライセンス

MIT