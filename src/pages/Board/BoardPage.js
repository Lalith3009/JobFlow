import React, { useState, useMemo, useCallback } from 'react';
import { S } from '../../styles/styles';
import { useJobs } from '../../context/JobsContext';
import { JobCard } from './JobCard';

const COLS = [
  { id: 'wishlist', label: 'Wishlist', color: 'var(--wishlist)' },
  { id: 'applied', label: 'Applied', color: 'var(--applied)' },
  { id: 'interview', label: 'Interview', color: 'var(--interview)' },
  { id: 'offer', label: 'Offer', color: 'var(--offer)' },
  { id: 'rejected', label: 'Rejected', color: 'var(--rejected)' },
];

const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest First' },
  { id: 'oldest', label: 'Oldest First' },
  { id: 'company', label: 'Company A-Z' },
  { id: 'title', label: 'Title A-Z' },
];

const STATUS_LABELS = { wishlist: 'Wishlist', applied: 'Applied', interview: 'Interview', offer: 'Offer', rejected: 'Rejected' };

export function BoardPage({ onAdd, onAnalyze, onCoverLetter, onEdit, onDuplicate, onToast, stats }) {
  const { jobs, updateJob, deleteJob, loading } = useJobs();
  const [dragId, setDragId] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [confetti, setConfetti] = useState(false);

  const filteredJobs = useMemo(() => {
    let result = jobs;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(j =>
        j.title?.toLowerCase().includes(q) ||
        j.company?.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q)
      );
    }
    const sorted = [...result];
    switch (sortBy) {
      case 'oldest': sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)); break;
      case 'company': sorted.sort((a, b) => (a.company || '').localeCompare(b.company || '')); break;
      case 'title': sorted.sort((a, b) => (a.title || '').localeCompare(b.title || '')); break;
      default: sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); break;
    }
    return sorted;
  }, [jobs, search, sortBy]);

  const triggerConfetti = useCallback(() => {
    setConfetti(true);
    setTimeout(() => setConfetti(false), 2500);
  }, []);

  const handleDrop = async (status) => {
    if (dragId) {
      const job = jobs.find(j => j.id === dragId);
      if (job && job.status !== status) {
        const prevStatus = job.status;
        await updateJob(dragId, { status });
        // Confetti on offer
        if (status === 'offer') triggerConfetti();
        // Undo toast
        if (onToast) {
          onToast(
            `Moved to ${STATUS_LABELS[status]}`,
            { label: 'Undo', onClick: () => updateJob(dragId, { status: prevStatus }) }
          );
        }
      }
    }
    setDragId(null);
    setDragOver(null);
  };

  const handleMove = async (jobId, newStatus) => {
    const job = jobs.find(j => j.id === jobId);
    if (job && job.status !== newStatus) {
      const prevStatus = job.status;
      await updateJob(jobId, { status: newStatus });
      if (newStatus === 'offer') triggerConfetti();
      if (onToast) {
        onToast(
          `Moved to ${STATUS_LABELS[newStatus]}`,
          { label: 'Undo', onClick: () => updateJob(jobId, { status: prevStatus }) }
        );
      }
    }
  };

  // Empty board onboarding
  if (!loading && jobs.length === 0) {
    return (
      <div style={S.page} className="page-transition">
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
          <div style={{ textAlign: 'center', maxWidth: 480 }}>
            <div style={{ marginBottom: 24 }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
            </div>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, letterSpacing: '-0.02em' }}>
              Welcome to JobFlow
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
              Start tracking your job applications. Add your first job to see it on the Kanban board, get AI-powered analysis, and generate cover letters.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={S.addBtn} onClick={onAdd} className="btn-hover">
                <span>+</span> Add Your First Job
              </button>
            </div>
            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 48 }}>
              {[
                [<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, 'AI Analysis', 'Get skill match scores'],
                [<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>, 'Cover Letters', 'Generate tailored letters'],
                [<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, 'Analytics', 'Track your progress'],
              ].map(([icon, title, desc], i) => (
                <div key={i} style={{ textAlign: 'center', maxWidth: 140 }}>
                  <div style={{ marginBottom: 8 }}>{icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page} className="page-transition">
      {/* Confetti overlay */}
      {confetti && (
        <div className="confetti-container" aria-hidden="true">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="confetti-piece" style={{
              '--x': `${Math.random() * 100}vw`,
              '--r': `${Math.random() * 360}deg`,
              '--d': `${0.5 + Math.random() * 1.5}s`,
              '--c': ['#10b981', '#6366f1', '#f59e0b', '#3b82f6', '#8b5cf6', '#ef4444'][i % 6],
            }} />
          ))}
        </div>
      )}

      <header style={S.header} className="board-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
          <div style={{ flexShrink: 0 }}>
            <h1 style={S.title}>Job Board</h1>
            <p style={S.subtitle}>Manage your applications & track progress</p>
          </div>
          <div className="stats-inline" style={S.statsInline}>
            <div style={S.statPill}>
              <span style={{ ...S.statNumSm, color: 'var(--text-primary)' }}>{stats.total}</span>
              <span style={S.statLblSm}>Total</span>
            </div>
            <div style={S.statDivSm} />
            {COLS.slice(0, 4).map(c => (
              <div key={c.id} style={S.statPill}>
                <span style={{ ...S.statNumSm, color: c.color }}>{stats[c.id]}</span>
                <span style={S.statLblSm}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          {/* Sort */}
          <div style={{ position: 'relative' }}>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{
                appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
                padding: '8px 30px 8px 10px', background: 'var(--bg-card)', border: '1px solid var(--border-primary)',
                borderRadius: 8, color: 'var(--text-muted)', fontSize: 12, fontWeight: 500, fontFamily: 'inherit',
                cursor: 'pointer', outline: 'none', transition: 'border-color 0.2s',
              }}
            >
              {SORT_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
            <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-dim)', fontSize: 10 }}>▼</span>
          </div>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search jobs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: search ? 200 : 160,
                padding: '8px 12px 8px 32px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-primary)',
                borderRadius: 8,
                color: 'var(--text-primary)',
                fontSize: 13,
                outline: 'none',
                transition: 'width 0.2s, border-color 0.2s',
                fontFamily: 'inherit',
              }}
            />
            <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-dim)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', width: 18, height: 18, background: 'var(--border-secondary)', border: 'none', borderRadius: '50%', color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
              >×</button>
            )}
          </div>
          <button style={S.addBtn} onClick={onAdd} className="btn-hover" aria-label="Add new job" title="Add new job (N)">
            <span>+</span> Add Job
            <span style={{ fontSize: 10, opacity: 0.6, marginLeft: 4, padding: '1px 5px', background: 'rgba(255,255,255,0.15)', borderRadius: 4, fontWeight: 600 }}>N</span>
          </button>
        </div>
      </header>

      {loading ? (
        <div style={S.loading}><div style={S.spinner} /></div>
      ) : (
        <div style={S.kanbanContainer}>
          <div style={S.kanban}>
            {COLS.map(col => {
              const colJobs = filteredJobs.filter(j => j.status === col.id);
              const isOver = dragOver === col.id;
              return (
                <div
                  key={col.id}
                  className={isOver ? 'column-drag-over' : ''}
                  style={{
                    ...S.column,
                    borderColor: isOver ? col.color : 'var(--border-primary)',
                    background: 'var(--bg-secondary)',
                  }}
                  onDragOver={e => { e.preventDefault(); setDragOver(col.id); }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={() => handleDrop(col.id)}
                >
                  {/* Accent bar */}
                  <div style={{ height: 3, borderRadius: '16px 16px 0 0', background: col.color }} />
                  <div style={{ ...S.colHead, background: 'var(--bg-secondary)', backdropFilter: 'blur(8px)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.color }} />
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{col.label}</span>
                    </div>
                    <span style={{ ...S.count, background: 'var(--bg-hover)', color: col.color }}>
                      {colJobs.length}
                    </span>
                  </div>
                  <div style={S.colBody} role="list">
                    {colJobs.map((job, i) => (
                      <JobCard
                        key={job.id}
                        job={job}
                        index={i}
                        isDragging={dragId === job.id}
                        onDragStart={() => setDragId(job.id)}
                        onDragEnd={() => setDragId(null)}
                        onAnalyze={() => onAnalyze(job)}
                        onCoverLetter={() => onCoverLetter(job)}
                        onDelete={() => deleteJob(job.id)}
                        onMove={(s) => handleMove(job.id, s)}
                        onEdit={() => onEdit(job)}
                        onDuplicate={() => onDuplicate(job)}
                      />
                    ))}
                    {colJobs.length === 0 && (
                      <div style={S.empty}>
                        <span style={{ fontWeight: 600, color: 'var(--text-dim)', fontStyle: 'normal' }}>
                          {search ? 'No matches' : 'No jobs yet'}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                          {search ? 'Try a different search' : 'Drag jobs here or click Add Job'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
