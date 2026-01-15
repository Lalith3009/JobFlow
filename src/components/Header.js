import React from 'react';

const Header = ({ onAddJob }) => {
  return (
    <header style={styles.header}>
      <div style={styles.headerLeft}>
        <h1 style={styles.title}>📋 Job Board</h1>
        <p style={styles.subtitle}>
          Drag jobs to organize • Click <span style={styles.aiHighlight}>✨ Analyze</span> for AI insights
        </p>
      </div>

      <button style={styles.addBtn} onClick={onAddJob}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add Job
      </button>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 28px',
    borderBottom: '1px solid #1f1f23',
    background: 'linear-gradient(135deg, #0c0c0f 0%, #0f0f12 100%)'
  },
  headerLeft: {},
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#fafafa',
    margin: 0,
    letterSpacing: '-0.5px'
  },
  subtitle: {
    fontSize: 14,
    color: '#71717a',
    margin: '6px 0 0'
  },
  aiHighlight: {
    color: '#a78bfa',
    fontWeight: 500
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '14px 28px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    border: 'none',
    borderRadius: 14,
    color: 'white',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.35)',
    transition: 'all 0.2s'
  }
};

export default Header;
