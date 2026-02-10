import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { S } from '../../styles/styles';

const STATUS_COLORS = { wishlist: 'var(--wishlist)', applied: 'var(--applied)', interview: 'var(--interview)', offer: 'var(--offer)', rejected: 'var(--rejected)' };
const STATUS_LABELS = { wishlist: 'Wishlist', applied: 'Applied', interview: 'Interview', offer: 'Offer', rejected: 'Rejected' };

export function JobCard({ job, isDragging, onDragStart, onDragEnd, onAnalyze, onCoverLetter, onDelete, onMove, onEdit, onDuplicate, index = 0 }) {
  const [menu, setMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const menuBtnRef = useRef(null);

  const fmtDate = (d) => {
    if (!d) return '';
    const diff = Math.floor((Date.now() - new Date(d)) / 86400000);
    return diff === 0 ? 'Today' : diff === 1 ? 'Yesterday' : diff < 7 ? `${diff}d ago` : new Date(d).toLocaleDateString();
  };

  const openMenu = useCallback(() => {
    if (menuBtnRef.current) {
      const rect = menuBtnRef.current.getBoundingClientRect();
      const menuWidth = 160;
      const menuHeight = 300;
      const spaceBelow = window.innerHeight - rect.bottom;
      const top = spaceBelow < menuHeight ? rect.top - menuHeight - 4 : rect.bottom + 4;
      let left = rect.right - menuWidth;
      if (left < 8) left = 8;
      if (left + menuWidth > window.innerWidth - 8) left = window.innerWidth - menuWidth - 8;
      setMenuPos({ top, left });
    }
    setMenu(true);
  }, []);

  const closeMenu = useCallback(() => { setMenu(false); setConfirmDelete(false); }, []);

  useEffect(() => {
    if (!menu) return;
    const close = () => closeMenu();
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [menu, closeMenu]);

  const borderColor = STATUS_COLORS[job.status] || 'var(--border-secondary)';

  const DdBtn = ({ onClick, color, children, hoverBg }) => (
    <button
      style={{ ...S.ddItem, color: color || 'var(--text-secondary)' }}
      onMouseEnter={e => e.currentTarget.style.background = hoverBg || 'var(--bg-hover)'}
      onMouseLeave={e => e.currentTarget.style.background = 'none'}
      onClick={onClick}
    >{children}</button>
  );

  const dropdownPortal = menu ? ReactDOM.createPortal(
    <>
      <div style={S.menuBg} onClick={closeMenu} />
      <div style={{ ...S.dropdown, top: menuPos.top, left: menuPos.left }}>
        {/* Quick actions */}
        <DdBtn onClick={() => { if (onEdit) onEdit(); closeMenu(); }}>Edit Details</DdBtn>
        <DdBtn onClick={() => { if (onDuplicate) onDuplicate(); closeMenu(); }}>Duplicate</DdBtn>
        <div style={S.ddDiv} />
        <div style={S.ddLabel}>Move to</div>
        {Object.entries(STATUS_COLORS).map(([s, c]) => (
          <DdBtn key={s} onClick={() => { onMove(s); closeMenu(); }} color={c}>{STATUS_LABELS[s]}</DdBtn>
        ))}
        <div style={S.ddDiv} />
        {confirmDelete ? (
          <div style={{ padding: '8px 10px' }}>
            <div style={{ fontSize: 12, color: 'var(--error)', marginBottom: 8, fontWeight: 500 }}>Delete this job?</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                style={{ flex: 1, padding: '5px 0', background: 'var(--error)', border: 'none', borderRadius: 6, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                onClick={() => { onDelete(); closeMenu(); setConfirmDelete(false); }}
              >Yes</button>
              <button
                style={{ flex: 1, padding: '5px 0', background: 'var(--border-secondary)', border: 'none', borderRadius: 6, color: 'var(--text-muted)', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
                onClick={() => setConfirmDelete(false)}
              >No</button>
            </div>
          </div>
        ) : (
          <DdBtn onClick={() => setConfirmDelete(true)} color="var(--error)" hoverBg="var(--error-muted)">Delete</DdBtn>
        )}
      </div>
    </>,
    document.body
  ) : null;

  return (
    <div
      className="job-card"
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      tabIndex={0}
      role="listitem"
      aria-label={`${job.title} at ${job.company}`}
      style={{
        ...S.jobCard,
        opacity: isDragging ? 0.4 : 1,
        borderLeft: `3px solid ${borderColor}`,
        animationDelay: `${index * 0.04}s`,
      }}
    >
      <div style={S.cardTop}>
        <div style={S.compLogo}>{job.company?.[0]?.toUpperCase() || '?'}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.company}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{fmtDate(job.created_at)}</div>
        </div>
        <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
          <button className="ai-btn" style={S.aiBtn} onClick={onAnalyze} title="AI Analysis" aria-label="AI Analysis">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </button>
          <button className="cover-btn" style={S.coverBtn} onClick={onCoverLetter} title="Cover Letter" aria-label="Generate Cover Letter">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </button>
          <button ref={menuBtnRef} style={S.menuBtn} onClick={() => menu ? closeMenu() : openMenu()} aria-label="More options">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
          </button>
        </div>
      </div>
      {/* Clickable title for edit */}
      <h3
        style={{ ...S.jobTitle, cursor: 'pointer' }}
        onClick={() => onEdit && onEdit()}
        title="Click to edit"
      >{job.title}</h3>
      {job.location && <p style={S.jobLoc}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4, verticalAlign: 'middle' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        {job.location}
      </p>}
      {job.salary && <p style={{ fontSize: 12, color: 'var(--success)', marginBottom: 10, fontWeight: 500 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4, verticalAlign: 'middle' }}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
        {job.salary}
      </p>}
      {job.follow_up_date && (() => {
        const isOverdue = new Date(job.follow_up_date) < new Date(new Date().toDateString());
        const isToday = new Date(job.follow_up_date).toDateString() === new Date().toDateString();
        const color = isOverdue ? 'var(--error)' : isToday ? 'var(--warning)' : 'var(--text-muted)';
        const label = isOverdue ? 'Overdue' : isToday ? 'Today' : new Date(job.follow_up_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color, fontWeight: 600, marginBottom: 8 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Follow up: {label}
          </div>
        );
      })()}
      {job.notes?.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-dim)', marginBottom: 8 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          {job.notes.length} note{job.notes.length > 1 ? 's' : ''}
        </div>
      )}
      <div style={S.cardFoot}>
        <div style={{ ...S.dot, background: STATUS_COLORS[job.status], boxShadow: `0 0 8px ${STATUS_COLORS[job.status]}60` }} />
        {job.url ? <a href={job.url} target="_blank" rel="noreferrer" style={S.link} onClick={e => e.stopPropagation()}>View Details</a> : <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>No link</span>}
      </div>
      {dropdownPortal}
    </div>
  );
}
