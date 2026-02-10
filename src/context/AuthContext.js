import React, { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      if (data.session) {
        localStorage.setItem('jobflow_ext', JSON.stringify({
          url: SUPABASE_URL, key: SUPABASE_KEY,
          token: data.session.access_token, user: data.session.user
        }));
      }
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => {
      setUser(s?.user || null);
      if (s) localStorage.setItem('jobflow_ext', JSON.stringify({
        url: SUPABASE_URL, key: SUPABASE_KEY, token: s.access_token, user: s.user
      }));
    });
    return () => subscription.unsubscribe();
  }, []);

  const signIn = () => supabase?.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin }});
  const signOut = async () => { localStorage.clear(); await supabase?.auth.signOut(); setUser(null); };

  return <AuthContext.Provider value={{ user, loading, signIn, signOut }}>{children}</AuthContext.Provider>;
}
