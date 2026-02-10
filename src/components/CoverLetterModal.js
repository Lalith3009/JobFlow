import React, { useState, useEffect, useCallback } from 'react';
import { S } from '../styles/styles';
import { useResume } from '../context/ResumeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export function CoverLetterModal({ job, onClose, onToast }) {
  const { resumeText } = useResume();
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCached, setIsCached] = useState(false);
  const [cachedDate, setCachedDate] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchCoverLetter = useCallback(async (skipCache = false) => {
    setLoading(true);
    setIsCached(false);

    // Check cache
    if (!skipCache && user && supabase) {
      try {
        const { data } = await supabase
          .from('cover_letters')
          .select('*')
          .eq('job_id', job.id)
          .eq('user_id', user.id)
          .single();

        if (data) {
          setContent(data.content);
          setIsCached(true);
          setCachedDate(data.updated_at);
          setLoading(false);
          return;
        }
      } catch { /* no cache, proceed */ }
    }

    // Call API
    try {
      const ctrl = new AbortController();
      setTimeout(() => ctrl.abort(), 30000);

      const res = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: job.description || '',
          resumeText: resumeText || '',
          jobTitle: job.title,
          company: job.company,
          location: job.location || ''
        }),
        signal: ctrl.signal
      });

      const data = await res.json();
      if (data.coverLetter) {
        setContent(data.coverLetter);

        // Save to cache
        if (user && supabase) {
          try {
            await supabase.from('cover_letters').upsert({
              job_id: job.id,
              user_id: user.id,
              content: data.coverLetter,
              updated_at: new Date().toISOString()
            }, { onConflict: 'job_id,user_id' });
          } catch { /* silent */ }
        }
      } else {
        setContent('Failed to generate cover letter. Please try again.');
      }
    } catch {
      setContent('Failed to generate cover letter. Please check your connection and try again.');
    }
    setLoading(false);
  }, [job, resumeText, user]);

  useEffect(() => { fetchCoverLetter(); }, [fetchCoverLetter]);

  const handleRegenerate = () => {
    fetchCoverLetter(true);
    if (onToast) onToast('Regenerating cover letter...');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      if (onToast) onToast('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = content;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={{ ...S.modal, maxWidth: 640 }} onClick={e => e.stopPropagation()}>
        <div style={S.modalHead}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Cover Letter</h2>
              {isCached && <span style={S.cachedBadge}>Cached</span>}
            </div>
            <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 13 }}>
              {job.title} @ {job.company}
              {cachedDate && isCached && <span style={{ marginLeft: 8, color: 'var(--text-dim)' }}>{fmtDate(cachedDate)}</span>}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {!loading && (
              <button style={{ ...S.secBtn, padding: '6px 14px', fontSize: 12 }} onClick={handleRegenerate} aria-label="Regenerate cover letter">
                Re-generate
              </button>
            )}
            <button style={S.modalX} onClick={onClose} aria-label="Close modal">×</button>
          </div>
        </div>
        <div style={S.coverBody}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={S.spinner} />
              <p style={{ color: 'var(--text-muted)', marginTop: 24, fontSize: 14 }}>Generating your cover letter...</p>
            </div>
          ) : (
            <>
              {!resumeText && (
                <div style={{ ...S.warning, marginBottom: 20 }}>
                  <b>Missing Resume:</b> Upload your resume in the Resume tab for a personalized cover letter.
                </div>
              )}
              <div style={S.coverText}>{content}</div>
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button style={S.copyBtn} onClick={handleCopy} aria-label="Copy cover letter to clipboard">
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
