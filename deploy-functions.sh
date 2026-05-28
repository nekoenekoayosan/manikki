#!/bin/bash

# Supabase Edge Functions デプロイスクリプト
# 使用前に SUPABASE_ACCESS_TOKEN 環境変数を設定してください

echo "🚀 Edge Functions をデプロイしています..."

# プロジェクトにリンク
echo "📡 プロジェクトをリンク中..."
supabase link --project-ref qifodldzjlahyvpmlhvj

# 各Edge Functionをデプロイ
echo "🔐 認証 Edge Function をデプロイ中..."
supabase functions deploy auth --no-verify-jwt

echo "✍️ 投稿作成 Edge Function をデプロイ中..."
supabase functions deploy create-entry

echo "📋 一覧取得 Edge Function をデプロイ中..."
supabase functions deploy get-entries

echo "🌤 天気取得 Edge Function をデプロイ中..."
supabase functions deploy get-weather

echo "✅ デプロイ完了！"
echo ""
echo "📌 次に必要なこと:"
echo "1. Supabase ダッシュボードで環境変数を設定"
echo "   - SUPABASE_URL"
echo "   - SUPABASE_SERVICE_ROLE_KEY"  
echo "   - OPENWEATHER_API_KEY"
echo "2. https://manikki.vercel.app でテスト"