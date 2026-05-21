// Edge Function: 投稿一覧取得
// ユーザーの投稿一覧を安全に取得

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req: Request) => {
  // CORS設定
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // 認証チェック
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('認証が必要です')
    }

    // 環境変数からSupabaseの設定を取得
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // ユーザー認証確認
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      throw new Error('無効な認証です')
    }

    // パラメータ解析（ページネーション用）
    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // ユーザーの投稿一覧を取得（新しい順）
    const { data: entries, error: fetchError } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (fetchError) {
      throw fetchError
    }

    // 天気アイコン変換（表示用）
    const entriesWithIcons = entries.map(entry => ({
      ...entry,
      weather_icon: getWeatherIcon(entry.weather),
      formatted_date: new Date(entry.created_at).toLocaleDateString('ja-JP', {
        month: '2-digit',
        day: '2-digit'
      }),
      formatted_amount: entry.amount ? `¥${entry.amount.toLocaleString()}` : null
    }))

    // 成功レスポンス
    return new Response(
      JSON.stringify({
        success: true,
        entries: entriesWithIcons,
        pagination: {
          page,
          limit,
          total: entries.length,
          has_more: entries.length === limit
        }
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )

  } catch (error) {
    console.error('一覧取得エラー:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        message: 'データの取得に失敗しました'
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

// 天気情報から絵文字アイコンを取得
function getWeatherIcon(weather: string | null): string {
  if (!weather) return '☀️'
  
  switch (weather.toLowerCase()) {
    case 'clear': return '☀️'
    case 'clouds': return '☁️'
    case 'rain': return '🌧️'
    case 'snow': return '❄️'
    case 'thunderstorm': return '⛈️'
    case 'drizzle': return '🌦️'
    case 'mist':
    case 'fog': return '🌫️'
    default: return '☀️'
  }
}