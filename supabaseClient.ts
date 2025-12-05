
import { createClient } from '@supabase/supabase-js';

// Safely access environment variables with fallback
const env = (import.meta as any).env || {};

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // We don't throw an error here to allow the app to render in "Offline/Demo" mode if keys are missing
  console.warn('Missing Supabase environment variables. Admin features will not work.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);
