// Supabase と 外部API の設定
// このファイルは .gitignore に含まれているため、Git にコミットされません

const CONFIG = {
    // Supabase プロジェクト設定（URLのみ、APIキーは含まない）
    SUPABASE_URL: 'https://qifodldzjlahyvpmlhvj.supabase.co',
    
    // Edge Functions のエンドポイント
    EDGE_FUNCTIONS: {
        AUTH: '/functions/v1/auth',
        CREATE_ENTRY: '/functions/v1/create-entry', 
        GET_ENTRIES: '/functions/v1/get-entries'
    },
    
    // 🔒 すべてのAPIキー（anon key含む）はEdge Functionsで管理
    // フロントエンドには一切のAPIキーを含めません
    
    // 環境設定
    ENVIRONMENT: 'development'
};

// ブラウザ環境で利用可能にする
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}