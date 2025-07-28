-- Create whitelist_requests table
CREATE TABLE IF NOT EXISTS whitelist_requests (
  id TEXT PRIMARY KEY,
  wallet_address TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  reason TEXT NOT NULL,
  defi_experience TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create whitelisted_addresses table
CREATE TABLE IF NOT EXISTS whitelisted_addresses (
  id SERIAL PRIMARY KEY,
  address TEXT NOT NULL UNIQUE,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_whitelist_requests_wallet_address ON whitelist_requests(wallet_address);
CREATE INDEX IF NOT EXISTS idx_whitelist_requests_status ON whitelist_requests(status);
CREATE INDEX IF NOT EXISTS idx_whitelisted_addresses_address ON whitelisted_addresses(address);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for whitelist_requests
DROP TRIGGER IF EXISTS update_whitelist_requests_updated_at ON whitelist_requests;
CREATE TRIGGER update_whitelist_requests_updated_at
    BEFORE UPDATE ON whitelist_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE whitelist_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE whitelisted_addresses ENABLE ROW LEVEL SECURITY;

-- Create news_cache table
CREATE TABLE IF NOT EXISTS news_cache (
  id SERIAL PRIMARY KEY,
  cache_key TEXT NOT NULL UNIQUE,
  twitter_posts JSONB DEFAULT '[]'::jsonb,
  ai_news JSONB DEFAULT '[]'::jsonb,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for news cache
CREATE INDEX IF NOT EXISTS idx_news_cache_key ON news_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_news_cache_expires ON news_cache(expires_at);

-- Enable RLS for news_cache
ALTER TABLE news_cache ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your auth requirements)
-- For now, allow all operations (you can restrict this later)
CREATE POLICY "Allow all operations on whitelist_requests" ON whitelist_requests
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on whitelisted_addresses" ON whitelisted_addresses
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on news_cache" ON news_cache
  FOR ALL USING (true) WITH CHECK (true);