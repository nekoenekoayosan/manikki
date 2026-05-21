// 設定ファイルの例
// 実際の設定は config.js にコピーしてください（gitignoreに含まれます）

const CONFIG = {
    // Supabase 設定
    SUPABASE_URL: 'https://qifodldzjlahyvpmlhvj.supabase.co',
    SUPABASE_ANON_KEY: 'YOUR_ANON_KEY_HERE', // 実際のキーに置き換えてください
    
    // 外部API設定（後で使用）
    OPENWEATHER_API_KEY: 'YOUR_OPENWEATHER_KEY_HERE',
    
    // 環境設定
    ENVIRONMENT: 'development' // 'development' または 'production'
};

// ブラウザ環境で利用可能にする
window.CONFIG = CONFIG;