import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';

const JobsContext = createContext({});

export const useJobs = () => useContext(JobsContext);

export const JobsProvider = ({ children }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async () => {
    if (!user || !isSupabaseConfigured || !supabase) {
      setJobs([]);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setJobs(data || []);
    } catch (err) {
      console.error('[JobFlow] Fetch jobs error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    if (!user || !isSupabaseConfigured || !supabase) return;

    const subscription = supabase
      .channel('jobs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jobs',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setJobs(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setJobs(prev => prev.map(j => j.id === payload.new.id ? payload.new : j));
          } else if (payload.eventType === 'DELETE') {
            setJobs(prev => prev.filter(j => j.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const addJob = async (jobData) => {
    if (!user || !supabase) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('jobs')
      .insert([{
        ...jobData,
        user_id: user.id,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateJob = async (jobId, updates) => {
    if (!supabase) throw new Error('Not configured');
    
    const { data, error } = await supabase
      .from('jobs')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const deleteJob = async (jobId) => {
    if (!supabase) throw new Error('Not configured');
    
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId);

    if (error) throw error;
  };

  const getStats = () => {
    return {
      total: jobs.length,
      wishlist: jobs.filter(j => j.status === 'wishlist').length,
      applied: jobs.filter(j => j.status === 'applied').length,
      interview: jobs.filter(j => j.status === 'interview').length,
      offer: jobs.filter(j => j.status === 'offer').length,
      rejected: jobs.filter(j => j.status === 'rejected').length
    };
  };

  const value = {
    jobs,
    loading,
    error,
    addJob,
    updateJob,
    deleteJob,
    refreshJobs: fetchJobs,
    getStats
  };

  return (
    <JobsContext.Provider value={value}>
      {children}
    </JobsContext.Provider>
  );
};
