import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // During build time on Vercel, these might be missing if not set in project settings.
  // We throw a more descriptive error.
  throw new Error(
    "Missing Supabase Environment Variables! " +
    "Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your Vercel Project Settings."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
