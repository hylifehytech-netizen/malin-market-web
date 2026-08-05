import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://staging-malin-market.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'staging-anon-key-placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
