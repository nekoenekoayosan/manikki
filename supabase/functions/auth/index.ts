// Edge Function: 認証処理
// フロントエンドのAPIキーを隠すため、認証処理をサーバーサイドで行う

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface LoginRequest {
  email: string
  password: string
  action: 'login' | 'register'
}

serve(async (req: Request) => {
  // CORS設定（フロントエンドから呼び出せるようにする）
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  // プリフライトリクエスト対応
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // 環境変数からSupabaseの設定を取得（APIキーがここで隠される）
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    // Supabaseクライアントを初期化（サーバーサイド用）
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // リクエストボディを解析
    const requestData: LoginRequest = await req.json()
    
    let result
    
    if (requestData.action === 'register') {
      // 新規登録
      result = await supabase.auth.signUp({
        email: requestData.email,
        password: requestData.password,
      })
    } else {
      // ログイン
      result = await supabase.auth.signInWithPassword({
        email: requestData.email,
        password: requestData.password,
      })
    }

    // エラーチェック
    if (result.error) {
      throw result.error
    }

    // 成功レスポンス（ユーザー情報とセッション情報を返す）
    return new Response(
      JSON.stringify({
        success: true,
        user: result.data.user,
        session: result.data.session,
        message: requestData.action === 'register' ? '登録完了' : 'ログイン成功'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )

  } catch (error) {
    console.error('認証エラー:', error)
    
    // エラーレスポンス
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        message: 'ログインに失敗しました'
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )
  }
})