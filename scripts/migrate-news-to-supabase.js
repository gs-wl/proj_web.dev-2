const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateNewsToSupabase() {
  try {
    console.log('🚀 Starting news cache migration to Supabase...');

    // Check if old cache file exists
    const oldCachePath = path.join(process.cwd(), 'src/data/news-cache.json');
    
    if (fs.existsSync(oldCachePath)) {
      console.log('📁 Found existing news cache file');
      
      const cacheData = JSON.parse(fs.readFileSync(oldCachePath, 'utf8'));
      
      // Check if cache is still valid (not expired)
      const cacheAge = Date.now() - new Date(cacheData.lastUpdated).getTime();
      const isExpired = cacheAge > (24 * 60 * 60 * 1000); // 24 hours
      
      if (!isExpired) {
        console.log('📊 Migrating valid cache data...');
        
        const now = new Date();
        const expiresAt = new Date(now.getTime() + (24 * 60 * 60 * 1000)); // 24 hours from now
        
        const { error } = await supabase
          .from('news_cache')
          .upsert({
            cache_key: 'main_news_cache',
            twitter_posts: cacheData.twitterPosts || [],
            ai_news: cacheData.aiNews || [],
            last_updated: cacheData.lastUpdated,
            expires_at: expiresAt.toISOString(),
            version: cacheData.version || 1
          }, {
            onConflict: 'cache_key'
          });

        if (error) {
          console.error('❌ Error migrating cache:', error);
        } else {
          console.log('✅ Successfully migrated news cache data');
          console.log(`   - Twitter posts: ${cacheData.twitterPosts?.length || 0}`);
          console.log(`   - AI news: ${cacheData.aiNews?.length || 0}`);
          console.log(`   - Last updated: ${cacheData.lastUpdated}`);
        }
      } else {
        console.log('⏰ Existing cache is expired, skipping migration');
      }
      
      // Optionally remove the old cache file
      console.log('🗑️  Removing old cache file...');
      fs.unlinkSync(oldCachePath);
      console.log('✅ Old cache file removed');
      
    } else {
      console.log('📭 No existing news cache file found');
    }

    // Verify migration
    const { data: cacheCheck, error: checkError } = await supabase
      .from('news_cache')
      .select('cache_key, last_updated, twitter_posts, ai_news')
      .eq('cache_key', 'main_news_cache')
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('❌ Error verifying migration:', checkError);
    } else if (cacheCheck) {
      console.log('🎉 Migration verification successful!');
      console.log(`📊 Cache contains:`);
      console.log(`   - Twitter posts: ${cacheCheck.twitter_posts?.length || 0}`);
      console.log(`   - AI news: ${cacheCheck.ai_news?.length || 0}`);
      console.log(`   - Last updated: ${cacheCheck.last_updated}`);
    } else {
      console.log('📭 No cache data in Supabase (this is normal if no valid cache existed)');
    }

    console.log('🎉 News cache migration completed!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateNewsToSupabase();