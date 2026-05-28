// Edge Function: 投稿作成
// 投稿データの保存 + 天気取得 + Notion同期を安全に実行

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface CreateEntryRequest {
  content: string
  amount?: number
  category?: string
  latitude?: number
  longitude?: number
}

interface WeatherData {
  weather: string
  temperature: number
  humidity: number
  pressure: number
}

serve(async (req: Request) => {
  // CORS設定
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // 認証チェック（Authorizationヘッダーから）
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('認証が必要です')
    }

    // 環境変数からAPIキーを取得
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const openWeatherKey = Deno.env.get('OPENWEATHER_API_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // リクエストデータを解析
    const requestData: CreateEntryRequest = await req.json()

    // 1. 天気情報を取得（OpenWeather API）
    let weatherData: WeatherData | null = null
    
    if (requestData.latitude && requestData.longitude) {
      try {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${requestData.latitude}&lon=${requestData.longitude}&appid=${openWeatherKey}&units=metric&lang=ja`
        
        const weatherResponse = await fetch(weatherUrl)
        const weatherJson = await weatherResponse.json()
        
        if (weatherResponse.ok) {
          weatherData = {
            weather: weatherJson.weather[0].main.toLowerCase(),
            temperature: Math.round(weatherJson.main.temp),
            humidity: weatherJson.main.humidity,
            pressure: weatherJson.main.pressure,
          }
        }
      } catch (error) {
        console.warn('天気取得失敗:', error)
        // 天気取得失敗は致命的エラーにしない
      }
    }

    // 2. ユーザー情報を取得（認証チェック込み）
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      throw new Error('無効な認証です')
    }

    // 3. Supabaseにデータを保存
    const entryData = {
      user_id: user.id,
      content: requestData.content,
      amount: requestData.amount || null,
      category: requestData.category || null,
      weather: weatherData?.weather || null,
      temperature: weatherData?.temperature || null,
      humidity: weatherData?.humidity || null,
      pressure: weatherData?.pressure || null,
    }

    const { data: entry, error: insertError } = await supabase
      .from('entries')
      .insert(entryData)
      .select()
      .single()

    if (insertError) {
      throw insertError
    }

    // 4. 将来：Notion同期（今回は省略、後で実装）
    // TODO: Notion APIを呼び出してページを作成

    // 成功レスポンス
    return new Response(
      JSON.stringify({
        success: true,
        entry: entry,
        weather: weatherData,
        message: '投稿が保存されました'
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    )

  } catch (error) {
    console.error('投稿作成エラー:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        message: '投稿の保存に失敗しました'
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