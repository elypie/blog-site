/* Ely's Blog - Environment & Supabase Configuration Loader */

window.ENV = window.ENV || {};

// Read from Vercel / Environment injections or window config
window.ENV.SUPABASE_URL = window.ENV_SUPABASE_URL || localStorage.getItem('elys_supabase_url') || '';
window.ENV.SUPABASE_ANON_KEY = window.ENV_SUPABASE_ANON_KEY || localStorage.getItem('elys_supabase_anon_key') || '';

// Helper to check if Supabase is properly configured
function isSupabaseConfigured() {
  return Boolean(
    window.ENV.SUPABASE_URL && 
    window.ENV.SUPABASE_URL.startsWith('https://') && 
    window.ENV.SUPABASE_ANON_KEY
  );
}
