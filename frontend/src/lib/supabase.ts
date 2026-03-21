import { createClient } from '@supabase/supabase-js';

// Access environment variables from import.meta.env (Vite standard)
// or process.env (if defined in vite.config.ts)
const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

// Check if the variables are actually set and not just the placeholder strings
const isConfigured = supabaseUrl && 
                   supabaseAnonKey && 
                   supabaseUrl !== 'your_supabase_url' && 
                   supabaseUrl !== '';

// Only create the client if we have the required URL and Key
// Otherwise, we'll export a proxy that throws a descriptive error when accessed
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : new Proxy({} as any, {
      get: (target, prop) => {
        // Allow some basic property access to prevent immediate crashes during render
        // but throw when actual data operations are attempted
        if (prop === 'from') {
          return () => {
            console.error('Supabase client is not initialized. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables (AI Studio Secrets).');
            return {
              select: () => ({ order: () => Promise.resolve({ data: [], error: new Error('Supabase not configured') }) }),
              insert: () => Promise.resolve({ error: new Error('Supabase not configured') }),
              delete: () => ({ eq: () => Promise.resolve({ error: new Error('Supabase not configured') }) }),
            };
          };
        }
        
        throw new Error(
          'Supabase client is not initialized. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables (AI Studio Secrets).'
        );
      }
    });
