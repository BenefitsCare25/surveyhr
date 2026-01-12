import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Debug logging for environment variables
console.log('[Supabase] Environment check:', {
  hasUrl: !!supabaseUrl,
  urlPrefix: supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'NOT SET',
  hasAnonKey: !!supabaseAnonKey,
  anonKeyPrefix: supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'NOT SET',
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase] ERROR: Environment variables are not set!', {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? 'SET' : 'MISSING',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseAnonKey ? 'SET' : 'MISSING',
  });
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
