-- Supabase Database Schema for Enhanced Analytics Dashboard
-- Requirements: 7.1, 7.3

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Collections cache table
CREATE TABLE IF NOT EXISTS cached_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_id VARCHAR(100) NOT NULL UNIQUE,
    collection_name VARCHAR(255) NOT NULL,
    description TEXT,
    floor_price DECIMAL(18, 8) DEFAULT 0,
    volume_24h DECIMAL(18, 8) DEFAULT 0,
    sales_24h INTEGER DEFAULT 0,
    total_items INTEGER DEFAULT 0,
    unique_owners INTEGER DEFAULT 0,
    change_24h DECIMAL(8, 4) DEFAULT 0,
    whale_count INTEGER DEFAULT 0,
    average_holding_period INTEGER DEFAULT 0,
    market_cap DECIMAL(18, 8) DEFAULT 0,
    image_url TEXT,
    rarity_distribution JSONB,
    price_history JSONB,
    volume_history JSONB,
    top_traits JSONB,
    market_health JSONB,
    metadata JSONB,
    cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '5 minutes'),
    access_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NFTs cache table
CREATE TABLE IF NOT EXISTS cached_nfts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nft_id VARCHAR(100) NOT NULL UNIQUE,
    collection_id VARCHAR(100) NOT NULL,
    collection_name VARCHAR(255) NOT NULL,
    nft_name VARCHAR(255) NOT NULL,
    description TEXT,
    serial_number INTEGER,
    rarity VARCHAR(50),
    current_price DECIMAL(18, 8) DEFAULT 0,
    last_sale_price DECIMAL(18, 8) DEFAULT 0,
    owner_address VARCHAR(100),
    mint_date TIMESTAMP WITH TIME ZONE,
    traits JSONB,
    image_url TEXT,
    rarity_analysis JSONB,
    price_history JSONB,
    ownership_history JSONB,
    estimated_value DECIMAL(18, 8) DEFAULT 0,
    market_position JSONB,
    metadata JSONB,
    cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '5 minutes'),
    access_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Price history cache table
CREATE TABLE IF NOT EXISTS cached_price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_id VARCHAR(100) NOT NULL,
    days_range INTEGER NOT NULL,
    price_data JSONB NOT NULL,
    cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '10 minutes'),
    access_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(collection_id, days_range)
);

-- Volume history cache table
CREATE TABLE IF NOT EXISTS cached_volume_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_id VARCHAR(100) NOT NULL,
    days_range INTEGER NOT NULL,
    volume_data JSONB NOT NULL,
    cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '10 minutes'),
    access_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(collection_id, days_range)
);

-- Whale activities cache table
CREATE TABLE IF NOT EXISTS cached_whale_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id VARCHAR(100) NOT NULL UNIQUE,
    wallet_address VARCHAR(100) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL,
    nft_id VARCHAR(100),
    collection_id VARCHAR(100),
    amount DECIMAL(18, 8) DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    is_large_transaction BOOLEAN DEFAULT FALSE,
    market_impact JSONB,
    metadata JSONB,
    cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '2 minutes'),
    access_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market activity cache table
CREATE TABLE IF NOT EXISTS cached_market_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_type VARCHAR(20) NOT NULL,
    nft_id VARCHAR(100),
    nft_name VARCHAR(255),
    collection_name VARCHAR(255),
    price DECIMAL(18, 8) DEFAULT 0,
    from_address VARCHAR(100),
    to_address VARCHAR(100),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    transaction_hash VARCHAR(100),
    block_height BIGINT,
    metadata JSONB,
    cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 minute'),
    access_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cache statistics table
CREATE TABLE IF NOT EXISTS cache_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    total_entries INTEGER DEFAULT 0,
    hit_count BIGINT DEFAULT 0,
    miss_count BIGINT DEFAULT 0,
    hit_rate DECIMAL(5, 2) DEFAULT 0,
    memory_usage_bytes BIGINT DEFAULT 0,
    oldest_entry TIMESTAMP WITH TIME ZONE,
    newest_entry TIMESTAMP WITH TIME ZONE,
    last_cleanup TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(table_name)
);

-- Indexes for performance optimization

-- Collections indexes
CREATE INDEX IF NOT EXISTS idx_cached_collections_collection_id ON cached_collections(collection_id);
CREATE INDEX IF NOT EXISTS idx_cached_collections_expires_at ON cached_collections(expires_at);
CREATE INDEX IF NOT EXISTS idx_cached_collections_last_accessed ON cached_collections(last_accessed);
CREATE INDEX IF NOT EXISTS idx_cached_collections_floor_price ON cached_collections(floor_price);
CREATE INDEX IF NOT EXISTS idx_cached_collections_volume_24h ON cached_collections(volume_24h);

-- NFTs indexes
CREATE INDEX IF NOT EXISTS idx_cached_nfts_nft_id ON cached_nfts(nft_id);
CREATE INDEX IF NOT EXISTS idx_cached_nfts_collection_id ON cached_nfts(collection_id);
CREATE INDEX IF NOT EXISTS idx_cached_nfts_owner_address ON cached_nfts(owner_address);
CREATE INDEX IF NOT EXISTS idx_cached_nfts_expires_at ON cached_nfts(expires_at);
CREATE INDEX IF NOT EXISTS idx_cached_nfts_current_price ON cached_nfts(current_price);
CREATE INDEX IF NOT EXISTS idx_cached_nfts_rarity ON cached_nfts(rarity);

-- Price history indexes
CREATE INDEX IF NOT EXISTS idx_cached_price_history_collection_days ON cached_price_history(collection_id, days_range);
CREATE INDEX IF NOT EXISTS idx_cached_price_history_expires_at ON cached_price_history(expires_at);

-- Volume history indexes
CREATE INDEX IF NOT EXISTS idx_cached_volume_history_collection_days ON cached_volume_history(collection_id, days_range);
CREATE INDEX IF NOT EXISTS idx_cached_volume_history_expires_at ON cached_volume_history(expires_at);

-- Whale activities indexes
CREATE INDEX IF NOT EXISTS idx_cached_whale_activities_wallet ON cached_whale_activities(wallet_address);
CREATE INDEX IF NOT EXISTS idx_cached_whale_activities_collection ON cached_whale_activities(collection_id);
CREATE INDEX IF NOT EXISTS idx_cached_whale_activities_timestamp ON cached_whale_activities(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_cached_whale_activities_expires_at ON cached_whale_activities(expires_at);
CREATE INDEX IF NOT EXISTS idx_cached_whale_activities_large_tx ON cached_whale_activities(is_large_transaction) WHERE is_large_transaction = TRUE;

-- Market activity indexes
CREATE INDEX IF NOT EXISTS idx_cached_market_activity_timestamp ON cached_market_activity(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_cached_market_activity_collection ON cached_market_activity(collection_name);
CREATE INDEX IF NOT EXISTS idx_cached_market_activity_expires_at ON cached_market_activity(expires_at);
CREATE INDEX IF NOT EXISTS idx_cached_market_activity_price ON cached_market_activity(price DESC);

-- GIN indexes for JSONB columns
CREATE INDEX IF NOT EXISTS idx_cached_collections_rarity_distribution ON cached_collections USING GIN(rarity_distribution);
CREATE INDEX IF NOT EXISTS idx_cached_collections_market_health ON cached_collections USING GIN(market_health);
CREATE INDEX IF NOT EXISTS idx_cached_nfts_traits ON cached_nfts USING GIN(traits);
CREATE INDEX IF NOT EXISTS idx_cached_nfts_rarity_analysis ON cached_nfts USING GIN(rarity_analysis);
CREATE INDEX IF NOT EXISTS idx_cached_whale_activities_metadata ON cached_whale_activities USING GIN(metadata);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_cached_collections_name_search ON cached_collections USING GIN(to_tsvector('english', collection_name));
CREATE INDEX IF NOT EXISTS idx_cached_nfts_name_search ON cached_nfts USING GIN(to_tsvector('english', nft_name));

-- Functions for automatic cache cleanup

-- Function to clean expired entries
CREATE OR REPLACE FUNCTION cleanup_expired_cache_entries()
RETURNS INTEGER AS $$
DECLARE
    total_deleted INTEGER := 0;
    deleted_count INTEGER;
BEGIN
    -- Clean expired collections
    DELETE FROM cached_collections WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    total_deleted := total_deleted + deleted_count;
    
    -- Clean expired NFTs
    DELETE FROM cached_nfts WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    total_deleted := total_deleted + deleted_count;
    
    -- Clean expired price history
    DELETE FROM cached_price_history WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    total_deleted := total_deleted + deleted_count;
    
    -- Clean expired volume history
    DELETE FROM cached_volume_history WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    total_deleted := total_deleted + deleted_count;
    
    -- Clean expired whale activities
    DELETE FROM cached_whale_activities WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    total_deleted := total_deleted + deleted_count;
    
    -- Clean expired market activity
    DELETE FROM cached_market_activity WHERE expires_at < NOW();
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    total_deleted := total_deleted + deleted_count;
    
    RETURN total_deleted;
END;
$$ LANGUAGE plpgsql;

-- Function to update cache statistics
CREATE OR REPLACE FUNCTION update_cache_statistics()
RETURNS VOID AS $$
BEGIN
    -- Update statistics for each table
    INSERT INTO cache_statistics (table_name, total_entries, oldest_entry, newest_entry, last_cleanup)
    VALUES 
        ('cached_collections', 
         (SELECT COUNT(*) FROM cached_collections), 
         (SELECT MIN(created_at) FROM cached_collections),
         (SELECT MAX(created_at) FROM cached_collections),
         NOW()),
        ('cached_nfts', 
         (SELECT COUNT(*) FROM cached_nfts), 
         (SELECT MIN(created_at) FROM cached_nfts),
         (SELECT MAX(created_at) FROM cached_nfts),
         NOW()),
        ('cached_price_history', 
         (SELECT COUNT(*) FROM cached_price_history), 
         (SELECT MIN(created_at) FROM cached_price_history),
         (SELECT MAX(created_at) FROM cached_price_history),
         NOW()),
        ('cached_volume_history', 
         (SELECT COUNT(*) FROM cached_volume_history), 
         (SELECT MIN(created_at) FROM cached_volume_history),
         (SELECT MAX(created_at) FROM cached_volume_history),
         NOW()),
        ('cached_whale_activities', 
         (SELECT COUNT(*) FROM cached_whale_activities), 
         (SELECT MIN(created_at) FROM cached_whale_activities),
         (SELECT MAX(created_at) FROM cached_whale_activities),
         NOW()),
        ('cached_market_activity', 
         (SELECT COUNT(*) FROM cached_market_activity), 
         (SELECT MIN(created_at) FROM cached_market_activity),
         (SELECT MAX(created_at) FROM cached_market_activity),
         NOW())
    ON CONFLICT (table_name) DO UPDATE SET
        total_entries = EXCLUDED.total_entries,
        oldest_entry = EXCLUDED.oldest_entry,
        newest_entry = EXCLUDED.newest_entry,
        last_cleanup = EXCLUDED.last_cleanup,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all cache tables
CREATE TRIGGER update_cached_collections_updated_at 
    BEFORE UPDATE ON cached_collections 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cached_nfts_updated_at 
    BEFORE UPDATE ON cached_nfts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cached_price_history_updated_at 
    BEFORE UPDATE ON cached_price_history 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cached_volume_history_updated_at 
    BEFORE UPDATE ON cached_volume_history 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cached_whale_activities_updated_at 
    BEFORE UPDATE ON cached_whale_activities 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cached_market_activity_updated_at 
    BEFORE UPDATE ON cached_market_activity 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cache_statistics_updated_at 
    BEFORE UPDATE ON cache_statistics 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE cached_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE cached_nfts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cached_price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE cached_volume_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE cached_whale_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE cached_market_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE cache_statistics ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY "Allow read access to cached_collections" ON cached_collections FOR SELECT USING (true);
CREATE POLICY "Allow read access to cached_nfts" ON cached_nfts FOR SELECT USING (true);
CREATE POLICY "Allow read access to cached_price_history" ON cached_price_history FOR SELECT USING (true);
CREATE POLICY "Allow read access to cached_volume_history" ON cached_volume_history FOR SELECT USING (true);
CREATE POLICY "Allow read access to cached_whale_activities" ON cached_whale_activities FOR SELECT USING (true);
CREATE POLICY "Allow read access to cached_market_activity" ON cached_market_activity FOR SELECT USING (true);
CREATE POLICY "Allow read access to cache_statistics" ON cache_statistics FOR SELECT USING (true);

-- Allow write access to service role only
CREATE POLICY "Allow service role to manage cached_collections" ON cached_collections FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role to manage cached_nfts" ON cached_nfts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role to manage cached_price_history" ON cached_price_history FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role to manage cached_volume_history" ON cached_volume_history FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role to manage cached_whale_activities" ON cached_whale_activities FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role to manage cached_market_activity" ON cached_market_activity FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role to manage cache_statistics" ON cache_statistics FOR ALL USING (auth.role() = 'service_role');

-- Create a scheduled job to clean up expired entries (requires pg_cron extension)
-- This would be set up in the Supabase dashboard or via SQL if pg_cron is available
-- SELECT cron.schedule('cleanup-expired-cache', '*/5 * * * *', 'SELECT cleanup_expired_cache_entries();');
-- SELECT cron.schedule('update-cache-stats', '0 * * * *', 'SELECT update_cache_statistics();');

-- Views for easier querying

-- Active (non-expired) collections view
CREATE OR REPLACE VIEW active_cached_collections AS
SELECT * FROM cached_collections 
WHERE expires_at > NOW()
ORDER BY last_accessed DESC;

-- Active (non-expired) NFTs view
CREATE OR REPLACE VIEW active_cached_nfts AS
SELECT * FROM cached_nfts 
WHERE expires_at > NOW()
ORDER BY last_accessed DESC;

-- Recent whale activities view
CREATE OR REPLACE VIEW recent_whale_activities AS
SELECT * FROM cached_whale_activities 
WHERE expires_at > NOW() AND timestamp > (NOW() - INTERVAL '24 hours')
ORDER BY timestamp DESC;

-- Cache performance summary view
CREATE OR REPLACE VIEW cache_performance_summary AS
SELECT 
    table_name,
    total_entries,
    hit_rate,
    memory_usage_bytes / 1024 / 1024 AS memory_usage_mb,
    EXTRACT(EPOCH FROM (newest_entry - oldest_entry)) / 3600 AS data_age_hours,
    last_cleanup
FROM cache_statistics
ORDER BY total_entries DESC;