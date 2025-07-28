import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface WhitelistRequest {
  id: string;
  wallet_address: string;
  name: string;
  email: string;
  company?: string;
  reason: string;
  defi_experience?: string;
  submitted_at: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  updated_at?: string;
}

export interface WhitelistedAddress {
  id?: number;
  address: string;
  added_at: string;
  created_at?: string;
}