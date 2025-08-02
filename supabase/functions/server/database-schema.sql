-- Enable Row Level Security
ALTER TABLE IF EXISTS public.document_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create user profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    subscription_tier TEXT DEFAULT 'free',
    documents_analyzed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create document analyses table
CREATE TABLE IF NOT EXISTS public.document_analyses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_size BIGINT,
    file_type TEXT,
    analysis_language TEXT DEFAULT 'en',
    analysis_type TEXT DEFAULT 'full',
    extracted_text TEXT,
    analysis_result JSONB,
    summary_data JSONB,
    audio_data JSONB,
    status TEXT DEFAULT 'completed',
    processing_time_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create document sharing table
CREATE TABLE IF NOT EXISTS public.document_shares (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID REFERENCES public.document_analyses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    shared_with_email TEXT,
    share_token TEXT UNIQUE,
    permissions TEXT[] DEFAULT ARRAY['read'],
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create usage analytics table
CREATE TABLE IF NOT EXISTS public.usage_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, -- 'analyze', 'summarize', 'audio_convert', 'chat'
    feature_used TEXT, -- 'document_analyzer', 'summarizer', 'echo_verse', 'chatbot'
    language_used TEXT,
    processing_time_ms INTEGER,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create API keys table for enterprise users
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    key_name TEXT NOT NULL,
    api_key TEXT UNIQUE NOT NULL,
    permissions TEXT[] DEFAULT ARRAY['analyze', 'summarize'],
    rate_limit INTEGER DEFAULT 100, -- requests per hour
    is_active BOOLEAN DEFAULT true,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Row Level Security Policies

-- User profiles: users can only see/edit their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Document analyses: users can only see/edit their own documents
CREATE POLICY "Users can view own documents" ON public.document_analyses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents" ON public.document_analyses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents" ON public.document_analyses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents" ON public.document_analyses
    FOR DELETE USING (auth.uid() = user_id);

-- Document shares: users can see shares they created or were shared with
CREATE POLICY "Users can view relevant shares" ON public.document_shares
    FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.email() = shared_with_email
    );

CREATE POLICY "Users can create shares" ON public.document_shares
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Usage analytics: users can only see their own analytics
CREATE POLICY "Users can view own analytics" ON public.usage_analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics" ON public.usage_analytics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- API keys: users can only manage their own API keys
CREATE POLICY "Users can view own API keys" ON public.api_keys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own API keys" ON public.api_keys
    FOR ALL USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_document_analyses_user_id ON public.document_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_document_analyses_created_at ON public.document_analyses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_document_shares_document_id ON public.document_shares(document_id);
CREATE INDEX IF NOT EXISTS idx_usage_analytics_user_id ON public.usage_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_analytics_created_at ON public.usage_analytics(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_api_key ON public.api_keys(api_key);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_updated_at_user_profiles
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_document_analyses
    BEFORE UPDATE ON public.document_analyses
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create function to increment document count
CREATE OR REPLACE FUNCTION public.increment_documents_analyzed()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.user_profiles 
    SET documents_analyzed = documents_analyzed + 1
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-increment document count
CREATE TRIGGER increment_user_document_count
    AFTER INSERT ON public.document_analyses
    FOR EACH ROW EXECUTE FUNCTION public.increment_documents_analyzed();