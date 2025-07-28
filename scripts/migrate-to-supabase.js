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
  console.log('Example:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateToSupabase() {
  try {
    console.log('🚀 Starting migration to Supabase...');

    // Migrate whitelist data
    const whitelistPath = path.join(process.cwd(), 'src/data/whitelist.json');
    if (fs.existsSync(whitelistPath)) {
      const whitelistData = JSON.parse(fs.readFileSync(whitelistPath, 'utf8'));
      
      if (whitelistData.whitelistedAddresses && whitelistData.whitelistedAddresses.length > 0) {
        const addressesToInsert = whitelistData.whitelistedAddresses.map(address => ({
          address: address.toLowerCase(),
          added_at: whitelistData.lastUpdated || new Date().toISOString()
        }));

        const { error: whitelistError } = await supabase
          .from('whitelisted_addresses')
          .upsert(addressesToInsert, { onConflict: 'address' });

        if (whitelistError) {
          console.error('❌ Error migrating whitelist:', whitelistError);
        } else {
          console.log(`✅ Migrated ${addressesToInsert.length} whitelisted addresses`);
        }
      }
    }

    // Migrate whitelist requests data
    const requestsPath = path.join(process.cwd(), 'src/data/whitelist-requests.json');
    if (fs.existsSync(requestsPath)) {
      const requestsData = JSON.parse(fs.readFileSync(requestsPath, 'utf8'));
      
      if (requestsData.requests && requestsData.requests.length > 0) {
        const requestsToInsert = requestsData.requests.map(req => ({
          id: req.id,
          wallet_address: req.walletAddress.toLowerCase(),
          name: req.name,
          email: req.email,
          company: req.company || null,
          reason: req.reason,
          defi_experience: req.defiExperience || null,
          submitted_at: req.submittedAt,
          status: req.status
        }));

        const { error: requestsError } = await supabase
          .from('whitelist_requests')
          .upsert(requestsToInsert, { onConflict: 'id' });

        if (requestsError) {
          console.error('❌ Error migrating requests:', requestsError);
        } else {
          console.log(`✅ Migrated ${requestsToInsert.length} whitelist requests`);
        }
      }
    }

    console.log('🎉 Migration completed successfully!');
    
    // Verify migration
    const { data: addresses } = await supabase.from('whitelisted_addresses').select('count');
    const { data: requests } = await supabase.from('whitelist_requests').select('count');
    
    console.log(`📊 Final counts:`);
    console.log(`   - Whitelisted addresses: ${addresses?.[0]?.count || 0}`);
    console.log(`   - Whitelist requests: ${requests?.[0]?.count || 0}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateToSupabase();