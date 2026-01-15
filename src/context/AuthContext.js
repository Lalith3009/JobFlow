import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured, signOut as supabaseSignOut, syncSessionForExtension } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState(null);

  useEffect(() => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured) {
      console.error('[JobFlow] Supabase not configured. Check environment variables.');
      setConfigError('Supabase not configured. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY');
      setLoading(false);
      return;
    }

    // Get initial session with timeout
    const initAuth = async () => {
      try {
        // Set a timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          console.warn('[JobFlow] Auth initialization timeout');
          setLoading(false);
        }, 5000);

        const { data: { session }, error } = await supabase.auth.getSession();
        
        clearTimeout(timeoutId);
        
        if (error) {
          console.error('[JobFlow] Get session error:', error);
        }
        
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await syncSessionForExtension();
        }
      } catch (error) {
        console.error('[JobFlow] Auth init error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[JobFlow] Auth state changed:', event);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await syncSessionForExtension();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sync session periodically for extension
  useEffect(() => {
    if (!user || !isSupabaseConfigured) return;

    const interval = setInterval(() => {
      syncSessionForExtension();
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  const signOut = async () => {
    await supabaseSignOut();
    setUser(null);
  };

  const value = {
    user,
    loading,
    configError,
    signOut,
    isAuthenticated: !!user,
    isConfigured: isSupabaseConfigured
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
