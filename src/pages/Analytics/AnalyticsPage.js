import React, { useMemo } from 'react';
import { S } from '../../styles/styles';
import { useJobs } from '../../context/JobsContext';

const PIPELINE = [
  { id: 'wishlist', label: 'Wishlist', color: 'var(--wishlist)' },
  { id: 'applied', label: 'Applied', color: 'var(--applied)' },
  { id: 'interview', label: 'Interview', color: 'var(--interview)' },
  { id: 'offer', label: 'Offer', color: 'var(--offer)' },
  { id: 'rejected', label: 'Rejected', color: 'var(--rejected)' },
];

const STATUS_COLORS = {
  wishlist: 'var(--wishlist)', applied: 'var(--applied)', interview: 'var(--interview)',
  offer: 'var(--offer)', rejected: 'var(--rejected)',
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function AnalyticsPage({ stats }) {
  const { jobs } = useJobs();
  const maxCount = Math.max(...PIPELINE.map(p => stats[p.id] || 0), 1);

  // Weekly activity: jobs added per day for the last 7 days
  const weeklyData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      const count = jobs.filter(j => {
        const created = new Date(j.created_at);
        return created >= d && created < next;
      }).length;
      days.push({ label: DAYS[d.getDay()], count, isToday: i === 0 });
    }
    return days;
  }, [jobs]);
  const weekMax = Math.max(...weeklyData.map(d => d.count), 1);

  // Response rate
  const responseRate = stats.total > 0 ? Math.round(((stats.interview + stats.offer) / stats.total) * 100) : 0;

  return (
    <div style={S.page} className="page-transition">
      <header style={S.header}>
        <div>
          <h1 style={S.title}>Analytics</h1>
          <p style={S.subtitle}>Insights into your job search performance</p>
        </div>
      </header>
      <div style={S.analyticsContent}>
        <div style={S.analyticsGrid}>
          {[
            [<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>, stats.total, 'Total Jobs', 'var(--text-primary)'],
            [<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>, stats.applied, 'Applied', 'var(--applied)'],
            [<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>, stats.interview, 'Interviews', 'var(--interview)'],
            [<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>, stats.offer, 'Offers', 'var(--offer)'],
          ].map(([icon, val, label, color], i) => (
            <div key={i} style={S.aCard} className="card-hover">
              <div style={{ ...S.aIcon, color }}>{icon}</div>
              <span style={{ fontSize: 32, fontWeight: 700, color, letterSpacing: '-0.03em' }}>{val}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 500 }}>{label}</span>
            </div>
          ))}
        </div>

        <div style={S.pipelineBox}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, color: 'var(--text-primary)' }}>Application Pipeline</h3>
          {PIPELINE.map((p) => (
            <div key={p.id} style={S.pipelineRow}>
              <div style={S.pipelineLabel}>{p.label}</div>
              <div style={S.pipelineTrack}>
                <div style={{
                  ...S.pipelineBar,
                  width: `${Math.max((stats[p.id] / maxCount) * 100, stats[p.id] > 0 ? 8 : 0)}%`,
                  background: p.color,
                  animation: 'barGrow 0.8s ease',
                }}>
                  {stats[p.id] > 0 && stats[p.id]}
                </div>
              </div>
              <div style={S.pipelineCount}>{stats[p.id]}</div>
            </div>
          ))}
        </div>

        <div className="analytics-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 32, border: '1px solid var(--border-primary)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, color: 'var(--text-primary)' }}>Weekly Activity</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
              {weeklyData.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: d.count > 0 ? 'var(--text-primary)' : 'var(--border-tertiary)', fontWeight: 600 }}>{d.count || ''}</span>
                  <div style={{
                    width: '100%',
                    maxWidth: 32,
                    height: `${Math.max((d.count / weekMax) * 80, d.count > 0 ? 12 : 4)}px`,
                    background: d.isToday ? 'linear-gradient(180deg, var(--accent), var(--wishlist))' : d.count > 0 ? 'var(--border-secondary)' : 'var(--bg-elevated)',
                    borderRadius: 6,
                    transition: 'height 0.5s ease',
                  }} />
                  <span style={{ fontSize: 11, color: d.isToday ? 'var(--accent-light)' : 'var(--text-dim)', fontWeight: d.isToday ? 600 : 400 }}>{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', borderRadius: 16, padding: 32, border: '1px solid var(--border-primary)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, color: 'var(--text-primary)' }}>Response Rate</h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div style={{ position: 'relative', width: 100, height: 100 }}>
                <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border-secondary)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="var(--accent)" strokeWidth="8"
                    strokeLinecap="round" strokeDasharray={2 * Math.PI * 42} strokeDashoffset={2 * Math.PI * 42 * (1 - responseRate / 100)}
                    style={{ transition: 'stroke-dashoffset 1s ease' }} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>{responseRate}%</span>
                </div>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' }}>
                {stats.interview + stats.offer} response{stats.interview + stats.offer !== 1 ? 's' : ''} out of {stats.total} application{stats.total !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        <div style={S.recentCard}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, color: 'var(--text-primary)' }}>Recent Activity</h3>
          {jobs.length > 0 ? jobs.slice(0, 5).map(job => {
            const statusColor = STATUS_COLORS[job.status] || 'var(--text-muted)';
            return (
              <div key={job.id} style={S.recentItem}>
                <div style={{ ...S.compLogoSm, background: 'var(--accent-muted)', color: statusColor }}>
                  {job.company?.[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{job.company}</div>
                </div>
                <div style={{
                  padding: '4px 10px',
                  background: 'var(--bg-hover)',
                  borderRadius: 6,
                  fontSize: 12,
                  color: statusColor,
                  textTransform: 'capitalize',
                  fontWeight: 600,
                  border: '1px solid var(--border-primary)',
                  whiteSpace: 'nowrap',
                }}>{job.status}</div>
              </div>
            );
          }) : (
            <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: 40 }}>
              No activity recorded yet. Start by adding jobs to your board.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
