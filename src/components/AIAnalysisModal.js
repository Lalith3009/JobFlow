import React, { useState, useEffect, useCallback } from 'react';
import { S } from '../styles/styles';
import { useResume } from '../context/ResumeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { localAnalyze } from '../lib/localAnalyze';

function hashText(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const chr = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash.toString(36);
}

export function AIAnalysisModal({ job, onClose, onToast }) {
  const { resumeText } = useResume();
  const { user } = useAuth();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCached, setIsCached] = useState(false);
  const [cachedDate, setCachedDate] = useState(null);
  const [resumeChanged, setResumeChanged] = useState(false);

  const currentHash = resumeText ? hashText(resumeText) : null;

  const fetchAnalysis = useCallback(async (skipCache = false) => {
    setLoading(true);
    setIsCached(false);
    setResumeChanged(false);

    // Check cache first
    if (!skipCache && user && supabase) {
      try {
        const { data } = await supabase
          .from('job_analyses')
          .select('*')
          .eq('job_id', job.id)
          .eq('user_id', user.id)
          .single();

        if (data) {
          setResult(data.analysis);
          setIsCached(true);
          setCachedDate(data.updated_at);
          if (currentHash && data.resume_hash && data.resume_hash !== currentHash) {
            setResumeChanged(true);
          }
          setLoading(false);
          return;
        }
      } catch { /* no cache found, proceed */ }
    }

    // Call API
    try {
      const ctrl = new AbortController();
      setTimeout(() => ctrl.abort(), 25000);

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: job.description || '',
          resumeText: resumeText || '',
          jobTitle: job.title,
          company: job.company
        }),
        signal: ctrl.signal
      });

      const data = await res.json();
      const analysis = data.analysis || localAnalyze(job.description, resumeText);
      setResult(analysis);

      // Save to cache (only if API result, not local fallback)
      if (data.analysis && user && supabase) {
        try {
          await supabase.from('job_analyses').upsert({
            job_id: job.id,
            user_id: user.id,
            analysis: data.analysis,
            resume_hash: currentHash,
            updated_at: new Date().toISOString()
          }, { onConflict: 'job_id,user_id' });
        } catch { /* silent */ }
      }
    } catch {
      setResult(localAnalyze(job.description, resumeText));
    }
    setLoading(false);
  }, [job, resumeText, user, currentHash]);

  useEffect(() => { fetchAnalysis(); }, [fetchAnalysis]);

  const handleReanalyze = () => {
    fetchAnalysis(true);
    if (onToast) onToast('Re-analyzing with latest data...');
  };

  const getColor = (s) => s >= 70 ? 'var(--success)' : s >= 50 ? 'var(--warning)' : 'var(--error)';
  const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const ScoreRing = ({ score, color }) => {
    const size = 96;
    const strokeWidth = 7;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    return (
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--border-secondary)" strokeWidth={strokeWidth} />
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 26, fontWeight: 700, color, letterSpacing: '-0.02em', lineHeight: 1 }}>{score}%</span>
          <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 }}>Match</span>
        </div>
      </div>
    );
  };

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={{ ...S.modal, maxWidth: 600 }} onClick={e => e.stopPropagation()}>
        <div style={S.modalHead}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>AI Analysis</h2>
              {isCached && <span style={S.cachedBadge}>Cached</span>}
            </div>
            <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 13 }}>
              {job.title} @ {job.company}
              {cachedDate && isCached && <span style={{ marginLeft: 8, color: 'var(--text-dim)' }}>{fmtDate(cachedDate)}</span>}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {!loading && (
              <button style={{ ...S.secBtn, padding: '6px 14px', fontSize: 12 }} onClick={handleReanalyze} aria-label="Re-analyze job">
                Re-analyze
              </button>
            )}
            <button style={S.modalX} onClick={onClose} aria-label="Close modal">×</button>
          </div>
        </div>
        <div style={S.aiBody}>
          {resumeChanged && (
            <div style={{ ...S.warning, marginBottom: 20 }}>
              Your resume has changed since this analysis. Click <b>Re-analyze</b> for updated results.
            </div>
          )}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={S.spinner} />
              <p style={{ color: 'var(--text-muted)', marginTop: 24, fontSize: 14 }}>Analyzing job compatibility...</p>
            </div>
          ) : result ? (
            <>
              <div style={S.scoreBox}>
                <ScoreRing score={result.matchScore} color={getColor(result.matchScore)} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{result.matchLevel}</span>
                    {result.experienceLevel && <span style={S.lvlBadge}>{result.experienceLevel}</span>}
                  </div>
                  {result.summary && <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{result.summary}</p>}
                </div>
              </div>
              <div style={S.skillsGrid}>
                <div style={S.skillsBox}>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)', marginBottom: 12, letterSpacing: 0.5, textTransform: 'uppercase' }}>Matching Skills</h4>
                  <div style={S.tags}>
                    {(result.skills?.matched || []).map((s, i) => <span key={i} style={S.tagG}>{s}</span>)}
                    {!result.skills?.matched?.length && <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>No direct skill matches</span>}
                  </div>
                </div>
                <div style={S.skillsBox}>
                  <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--error)', marginBottom: 12, letterSpacing: 0.5, textTransform: 'uppercase' }}>Skills to Develop</h4>
                  <div style={S.tags}>
                    {(result.skills?.missing || []).slice(0, 8).map((s, i) => <span key={i} style={S.tagR}>{s}</span>)}
                    {!result.skills?.missing?.length && <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>No missing skills detected</span>}
                  </div>
                </div>
              </div>

              {/* Action Items */}
              {result.actionItems?.length > 0 && (
                <div style={S.recsBox}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>Action Items</h4>
                  {result.actionItems.slice(0, 4).map((item, i) => {
                    const a = typeof item === 'string' ? { action: item, priority: 'medium' } : item;
                    const pColor = a.priority === 'high' ? 'var(--error)' : a.priority === 'low' ? 'var(--text-dim)' : 'var(--warning)';
                    return (
                      <div key={i} style={{ marginBottom: 12, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <span style={{
                          flexShrink: 0, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 4, marginTop: 3,
                          background: 'var(--bg-hover)', color: pColor, textTransform: 'uppercase', letterSpacing: 0.5,
                        }}>{a.priority || 'tip'}</span>
                        <span style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{a.action}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Interview Prep & Resume Keywords */}
              {(result.interviewTopics?.length > 0 || result.resumeKeywords?.length > 0) && (
                <div style={S.skillsGrid}>
                  {result.interviewTopics?.length > 0 && (
                    <div style={S.skillsBox}>
                      <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-light)', marginBottom: 12, letterSpacing: 0.5, textTransform: 'uppercase' }}>Interview Prep</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {result.interviewTopics.slice(0, 4).map((t, i) => (
                          <div key={i} style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                            <span style={{ color: 'var(--wishlist)', flexShrink: 0 }}>-</span><span>{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.resumeKeywords?.length > 0 && (
                    <div style={S.skillsBox}>
                      <h4 style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', marginBottom: 12, letterSpacing: 0.5, textTransform: 'uppercase' }}>Resume Keywords</h4>
                      <div style={S.tags}>
                        {result.resumeKeywords.slice(0, 6).map((k, i) => (
                          <span key={i} style={{
                            display: 'inline-block', padding: '5px 12px', background: 'var(--accent-muted)',
                            color: 'var(--accent-light)', borderRadius: 8, fontSize: 12, fontWeight: 500,
                            border: '1px solid rgba(99,102,241,0.2)', lineHeight: 1.4, whiteSpace: 'nowrap',
                          }}>{k}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Fallback: old-style recommendations if no actionItems */}
              {!result.actionItems?.length && result.recommendations?.length > 0 && (
                <div style={S.recsBox}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>Recommendations</h4>
                  {result.recommendations.slice(0, 3).map((t, i) => (
                    <div key={i} style={{ marginBottom: 10, fontSize: 14, color: 'var(--text-muted)', display: 'flex', gap: 10 }}>
                      <span style={{ color: 'var(--accent)' }}>→</span><span>{t}</span>
                    </div>
                  ))}
                </div>
              )}
              {!resumeText && (
                <div style={S.warning}>
                  <b>Missing Resume:</b> Upload your resume in the Resume tab to get a personalized analysis.
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              No analysis available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
