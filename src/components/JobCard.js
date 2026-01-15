import React, { useState } from 'react';
import { useJobs } from '../context/JobsContext';

const JobCard = ({ job, onAnalyze }) => {
  const { updateJob, deleteJob } = useJobs();
  const [showMenu, setShowMenu] = useState(false);

  const statusColors = {
    wishlist: '#8b5cf6',
    applied: '#3b82f6',
    interview: '#f59e0b',
    offer: '#10b981',
    rejected: '#ef4444'
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleStatusChange = async (status) => {
    try {
      await updateJob(job.id, { status });
    } catch (err) {
      console.error('Failed to update:', err);
    }
    setShowMenu(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this job?')) {
      try {
        await deleteJob(job.id);
      } catch (err) {
        console.error('Failed to delete:', err);
      }
    }
    setShowMenu(false);
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.companyBadge}>
          {job.company?.charAt(0)?.toUpperCase() || '?'}
        </div>
        <div style={styles.headerInfo}>
          <span style={styles.company}>{job.company || 'Unknown Company'}</span>
          <span style={styles.date}>{formatDate(job.created_at)}</span>
        </div>
        <div style={styles.actions}>
          <button
            style={styles.analyzeBtn}
            onClick={(e) => {
              e.stopPropagation();
              onAnalyze();
            }}
            title="AI Analysis"
          >
            ✨
          </button>
          <button
            style={styles.menuBtn}
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="6" r="2"/>
              <circle cx="12" cy="12" r="2"/>
              <circle cx="12" cy="18" r="2"/>
            </svg>
          </button>
        </div>
      </div>

      <h3 style={styles.title}>{job.title || 'Untitled Position'}</h3>

      {/* Location */}
      {job.location && (
        <p style={styles.location}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {job.location}
        </p>
      )}

      <div style={styles.tags}>
        {job.source && (
          <span style={styles.sourceTag}>{job.source}</span>
        )}
        {job.salary && (
          <span style={styles.salaryTag}>{job.salary}</span>
        )}
      </div>

      <div style={styles.footer}>
        <div style={{
          ...styles.statusIndicator,
          background: statusColors[job.status] || '#71717a'
        }} />
        {job.url ? (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.viewLink}
            onClick={(e) => e.stopPropagation()}
          >
            View Job →
          </a>
        ) : (
          <span style={styles.noLink}>No link</span>
        )}
      </div>
      
      {showMenu && (
        <>
          <div style={styles.menuOverlay} onClick={() => setShowMenu(false)} />
          <div style={styles.menu}>
            <div style={styles.menuLabel}>Move to</div>
            {Object.entries(statusColors).map(([status, color]) => (
              <button
                key={status}
                style={{...styles.menuItem, color}}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(status);
                }}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
            <div style={styles.menuDivider} />
            <button
              style={styles.menuItemDanger}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  card: {
    background: 'linear-gradient(135deg, #16161a 0%, #1a1a1f 100%)',
    borderRadius: 16,
    padding: 18,
    border: '1px solid #27272a',
    position: 'relative',
    transition: 'all 0.15s ease'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14
  },
  companyBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 700,
    color: 'white',
    flexShrink: 0
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column'
  },
  company: {
    fontSize: 14,
    fontWeight: 600,
    color: '#e4e4e7',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  date: {
    fontSize: 12,
    color: '#52525b',
    marginTop: 2
  },
  actions: {
    display: 'flex',
    gap: 8
  },
  analyzeBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    border: 'none',
    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
    fontSize: 18,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s'
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    border: 'none',
    background: '#27272a',
    color: '#71717a',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    margin: '0 0 10px',
    fontSize: 17,
    fontWeight: 600,
    color: '#fafafa',
    lineHeight: 1.4
  },
  location: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    margin: '0 0 14px',
    fontSize: 13,
    color: '#71717a'
  },
  tags: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 14
  },
  sourceTag: {
    padding: '6px 12px',
    background: 'rgba(99, 102, 241, 0.15)',
    color: '#818cf8',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 500
  },
  salaryTag: {
    padding: '6px 12px',
    background: 'rgba(16, 185, 129, 0.15)',
    color: '#34d399',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 500
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: '50%'
  },
  viewLink: {
    fontSize: 13,
    color: '#6366f1',
    textDecoration: 'none',
    fontWeight: 500
  },
  noLink: {
    fontSize: 12,
    color: '#52525b'
  },
  menuOverlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 100
  },
  menu: {
    position: 'absolute',
    top: 70,
    right: 18,
    background: '#1c1c21',
    borderRadius: 14,
    padding: 10,
    minWidth: 160,
    boxShadow: '0 10px 50px rgba(0, 0, 0, 0.5)',
    border: '1px solid #27272a',
    zIndex: 101
  },
  menuLabel: {
    padding: '8px 14px 6px',
    fontSize: 11,
    color: '#52525b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: 600
  },
  menuItem: {
    display: 'block',
    width: '100%',
    padding: '12px 14px',
    border: 'none',
    background: 'none',
    textAlign: 'left',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    borderRadius: 8
  },
  menuDivider: {
    height: 1,
    background: '#27272a',
    margin: '8px 0'
  },
  menuItemDanger: {
    display: 'block',
    width: '100%',
    padding: '12px 14px',
    border: 'none',
    background: 'none',
    textAlign: 'left',
    fontSize: 14,
    color: '#ef4444',
    cursor: 'pointer',
    borderRadius: 8
  }
};

export default JobCard;
