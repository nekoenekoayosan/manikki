-- お金日記アプリのテーブル作成SQL
-- Supabase ダッシュボードの SQL Editor で実行してください

-- 1. entries テーブル（記録本体）
CREATE TABLE entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    amount INTEGER NULL,
    category TEXT NULL,
    weather TEXT NULL,
    temperature NUMERIC NULL,
    room_temp NUMERIC NULL,
    brightness INTEGER NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    notion_page_id TEXT NULL
);

-- 2. user_settings テーブル（Notion連携設定用、将来拡張）
CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    notion_token TEXT NULL,
    notion_database_id TEXT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. インデックス作成（クエリ高速化）
CREATE INDEX entries_user_id_idx ON entries(user_id);
CREATE INDEX entries_created_at_idx ON entries(created_at DESC);

-- 4. Row Level Security (RLS) を有効化
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- 5. RLS ポリシー設定（ユーザーは自分のデータのみアクセス可能）

-- entries テーブルのポリシー
CREATE POLICY "Users can view own entries" 
    ON entries FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own entries" 
    ON entries FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entries" 
    ON entries FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own entries" 
    ON entries FOR DELETE 
    USING (auth.uid() = user_id);

-- user_settings テーブルのポリシー
CREATE POLICY "Users can view own settings" 
    ON user_settings FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" 
    ON user_settings FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" 
    ON user_settings FOR UPDATE 
    USING (auth.uid() = user_id);

-- 6. 実行確認クエリ（テーブル作成確認用）
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('entries', 'user_settings')
ORDER BY table_name, ordinal_position;