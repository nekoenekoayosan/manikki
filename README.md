# お金日記 (Money Diary)

一言の日記と、その日に使ったお金を一緒に気軽に記録できる Web アプリ。

## 概要

- 家計簿のような「全部記録しなきゃ」のプレッシャーを軽減
- 日記のような「何を書こう」の負担を軽減
- 書きたいときに、書きたいことだけ投稿
- Notion に自動同期で振り返り・整理が可能

## 主な機能

- **一言投稿**: テキストで気軽に投稿
- **金額記録**: 任意で金額を追加（レシートOCR対応）
- **天気自動取得**: 現在地の天気・気温を自動記録
- **Notion同期**: 投稿内容を見やすく整形してNotionに自動追加
- **micro:bit連携**: 室温・明るさセンサー（オプション）

## 技術スタック

- **フロントエンド**: HTML + CSS + JavaScript（素のJS）
- **データベース**: Supabase（PostgreSQL）
- **認証**: Supabase Auth
- **デプロイ**: Vercel
- **外部API**: OpenWeather（天気）、Claude API（OCR）、Notion API（同期）

## 開発状況

- [x] 環境準備
- [ ] 認証機能
- [ ] 基本的な投稿・表示機能
- [ ] 外部API連携
- [ ] micro:bit連携

## ローカル開発

```bash
# リポジトリをクローン
git clone https://github.com/nekoenekoayosan/manikki.git
cd manikki

# ローカルサーバーで起動（例：Python）
python -m http.server 8000
# または Node.js の場合
npx serve .
```

## デプロイURL

🚀 **本番環境**: https://manikki.vercel.app

📱 ライブデモ：上記URLから実際にアプリを試せます！