import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Loading } from './Loading';
import { ConfigError } from './ConfigError';
import { LoginPage } from './LoginPage';
import { Dashboard } from './Dashboard';

export function Router() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState('board');
  if (!supabase) return <ConfigError />;
  if (loading) return <Loading />;
  if (!user) return <LoginPage />;
  return <Dashboard page={page} setPage={setPage} />;
}
