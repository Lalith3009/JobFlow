import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const JobsContext = createContext();
export const useJobs = () => useContext(JobsContext);

export function JobsProvider({ children }) {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    if (!user || !supabase) { setJobs([]); setLoading(false); return; }
    const { data } = await supabase.from('jobs').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setJobs(data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  useEffect(() => {
    if (!user || !supabase) return;
    const channel = supabase.channel('jobs').on('postgres_changes',
      { event: '*', schema: 'public', table: 'jobs', filter: `user_id=eq.${user.id}` }, () => fetchJobs()
    ).subscribe();
    return () => channel.unsubscribe();
  }, [user, fetchJobs]);

  const addJob = async (job) => {
    const { data, error } = await supabase.from('jobs').insert([{ ...job, user_id: user.id }]).select().single();
    if (error) throw error;
    setJobs(prev => [data, ...prev]);
    return data;
  };

  const updateJob = async (id, updates) => {
    await supabase.from('jobs').update(updates).eq('id', id);
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...updates } : j));
  };

  const deleteJob = async (id) => {
    await supabase.from('jobs').delete().eq('id', id);
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  const stats = {
    total: jobs.length,
    wishlist: jobs.filter(j => j.status === 'wishlist').length,
    applied: jobs.filter(j => j.status === 'applied').length,
    interview: jobs.filter(j => j.status === 'interview').length,
    offer: jobs.filter(j => j.status === 'offer').length,
    rejected: jobs.filter(j => j.status === 'rejected').length,
  };

  return <JobsContext.Provider value={{ jobs, loading, addJob, updateJob, deleteJob, stats }}>{children}</JobsContext.Provider>;
}
