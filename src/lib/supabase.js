import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

console.log('[JobFlow] Supabase configured:', isSupabaseConfigured);
console.log('[JobFlow] Supabase URL:', supabaseUrl ? supabaseUrl.substring(0, 30) + '...' : 'NOT SET');

if (typeof window !== 'undefined' && isSupabaseConfigured) {
  window.__JOBFLOW_CONFIG__ = {
    supabaseUrl,
    supabaseKey: supabaseAnonKey
  };
  
  try {
    localStorage.setItem('jobflow_supabase_url', supabaseUrl);
    localStorage.setItem('jobflow_supabase_key', supabaseAnonKey);
  } catch (e) {}
}

// Auth functions
export const signInWithGoogle = async () => {
  if (!supabase) {
    console.error('[JobFlow] Supabase not configured');
    return { data: null, error: new Error('Supabase not configured') };
  }
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });
  return { data, error };
};

export const signOut = async () => {
  if (!supabase) return { error: null };
  
  try {
    localStorage.removeItem('jobflow_extension_data');
  } catch (e) {}
  
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentSession = async () => {
  if (!supabase) return null;
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (e) {
    console.error('[JobFlow] Get session error:', e);
    return null;
  }
};

// Sync session to localStorage for extension
export const syncSessionForExtension = async () => {
  if (!supabase || !isSupabaseConfigured) return;
  
  const session = await getCurrentSession();
  
  if (session) {
    const extensionData = {
      config: {
        supabaseUrl,
        supabaseKey: supabaseAnonKey
      },
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        user: {
          id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata
        }
      },
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem('jobflow_extension_data', JSON.stringify(extensionData));
    } catch (e) {}
  }
};
