// Supabase と 外部API の設定
// このファイルは .gitignore に含まれているため、Git にコミットされません

const CONFIG = {
    // Supabase プロジェクト設定
    SUPABASE_URL: 'https://qifodldzjlahyvpmlhvj.supabase.co',

    // anon key（公開用・フロントエンドに含めて安全）
    SUPABASE_ANON_KEY: 'sb_publishable_5AIte-lmF8WFvo9lQv9zzQ_qd2iz4xy',

    // Edge Functions のエンドポイント
    EDGE_FUNCTIONS: {
        AUTH: '/functions/v1/auth',
        CREATE_ENTRY: '/functions/v1/create-entry',
        GET_ENTRIES: '/functions/v1/get-entries',
        GET_WEATHER: '/functions/v1/get-weather',
    },

    // 環境設定
    ENVIRONMENT: 'production'
};

// ブラウザ環境で利用可能にする
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}