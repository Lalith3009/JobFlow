import React, { useState, useEffect, useCallback } from 'react';
import { S } from '../styles/styles';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobsContext';
import { useResume } from '../context/ResumeContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from './ToastContainer';
import { AddJobModal } from './AddJobModal';
import { AIAnalysisModal } from './AIAnalysisModal';
import { CoverLetterModal } from './CoverLetterModal';
import { JobDetailModal } from './JobDetailModal';
import { BoardPage } from '../pages/Board/BoardPage';
import { ResumePage } from '../pages/Resume/ResumePage';
import { AnalyticsPage } from '../pages/Analytics/AnalyticsPage';
import { SettingsPage } from '../pages/Settings/SettingsPage';

const Icon = {
  board: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="18" rx="2"/><rect x="14" y="3" width="7" height="12" rx="2"/></svg>,
  resume: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  analytics: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  sun: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  moon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
  chevronLeft: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  chevronRight: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  logout: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

const NAV_ITEMS = [
  { id: 'board', icon: Icon.board, label: 'Job Board' },
  { id: 'resume', icon: Icon.resume, label: 'My Resume' },
  { id: 'analytics', icon: Icon.analytics, label: 'Analytics' },
  { id: 'settings', icon: Icon.settings, label: 'Settings' },
];

const SHORTCUTS = [
  ['N', 'Add new job'],
  ['?', 'Show keyboard shortcuts'],
  ['1-4', 'Switch page'],
  ['Esc', 'Close modal / dialog'],
];

export function Dashboard({ page, setPage }) {
  const { user, signOut } = useAuth();
  const { stats, addJob } = useJobs();
  const { resumeText } = useResume();
  const { isDark, toggleTheme } = useTheme();
  const toast = useToast();
  const [showAdd, setShowAdd] = useState(false);
  const [showAI, setShowAI] = useState(null);
  const [showCoverLetter, setShowCoverLetter] = useState(null);
  const [showDetail, setShowDetail] = useState(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('jf_sidebar_collapsed') === 'true';
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const anyModalOpen = showAdd || showAI || showCoverLetter || showDetail || showShortcuts;

  const handleKeyDown = useCallback((e) => {
    const tag = document.activeElement?.tagName?.toLowerCase();
    const inInput = tag === 'input' || tag === 'textarea' || tag === 'select';

    if (e.key === 'Escape') {
      if (showShortcuts) { setShowShortcuts(false); return; }
      if (showDetail) { setShowDetail(null); return; }
      if (showAI) { setShowAI(null); return; }
      if (showCoverLetter) { setShowCoverLetter(null); return; }
      if (showAdd) { setShowAdd(false); return; }
      return;
    }

    if (inInput || anyModalOpen) return;

    if (e.key === 'n' && page === 'board') {
      e.preventDefault();
      setShowAdd(true);
      return;
    }
    if (e.key === '?') {
      e.preventDefault();
      setShowShortcuts(true);
      return;
    }
    const pages = ['board', 'resume', 'analytics', 'settings'];
    const num = parseInt(e.key);
    if (num >= 1 && num <= 4) {
      e.preventDefault();
      setPage(pages[num - 1]);
    }
  }, [page, showAdd, showAI, showCoverLetter, showDetail, showShortcuts, anyModalOpen, setPage]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const toggleCollapse = () => {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    localStorage.setItem('jf_sidebar_collapsed', String(next));
  };

  const handleDuplicate = async (job) => {
    try {
      await addJob({
        title: job.title,
        company: job.company,
        location: job.location || '',
        url: job.url || '',
        description: job.description || '',
        salary: job.salary || '',
        status: job.status,
      });
      toast.success('Job duplicated');
    } catch {
      toast.error('Failed to duplicate');
    }
  };

  const defaultStatus = localStorage.getItem('jf_default_status') || 'wishlist';
  const sidebarWidth = isMobile ? 260 : (sidebarCollapsed ? 68 : 260);
  const collapsed = sidebarCollapsed && !isMobile;

  const sidebarStyle = {
    ...S.sidebar,
    width: sidebarWidth,
    padding: collapsed ? '24px 10px' : '24px 16px',
    overflow: 'hidden',
  };

  return (
    <div style={S.dashboard}>
      {isMobile && (
        <button
          className="hamburger-show"
          style={{ ...S.hamburger, display: 'flex' }}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? '\u2715' : '\u2630'}
        </button>
      )}

      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={isMobile ? `sidebar-mobile ${sidebarOpen ? 'open' : ''}` : ''}
        style={sidebarStyle}
      >
        <div style={{ ...S.sidebarTop, justifyContent: collapsed ? 'center' : 'flex-start', marginBottom: collapsed ? 24 : 40, padding: collapsed ? 0 : '0 8px' }}>
          <div style={S.logoSm}>JF</div>
          {!collapsed && (
            <div><div style={S.brand}>JobFlow</div><div style={S.badge}>PRO</div></div>
          )}
        </div>
        <nav style={S.nav}>
          {!collapsed && <div style={S.navLabel}>WORKSPACE</div>}
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className="nav-item"
              style={{
                ...S.navItem,
                ...(page === item.id ? S.navActive : {}),
                justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? '10px 0' : '10px 14px',
                gap: collapsed ? 0 : 14,
              }}
              onClick={() => { setPage(item.id); if (isMobile) setSidebarOpen(false); }}
              title={collapsed ? item.label : undefined}
              aria-label={item.label}
              aria-current={page === item.id ? 'page' : undefined}
            >
              <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
              {!collapsed && item.id === 'resume' && resumeText && (
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success)', flexShrink: 0 }} />
              )}
            </button>
          ))}
        </nav>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: collapsed ? 0 : 10,
            width: '100%',
            padding: collapsed ? '10px 0' : '10px 14px',
            marginBottom: 8,
            background: 'transparent',
            border: 'none',
            borderRadius: 8,
            color: 'var(--text-muted)',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          aria-label="Toggle theme"
        >
          <span style={{ display: 'flex', alignItems: 'center' }}>{isDark ? Icon.sun : Icon.moon}</span>
          {!collapsed && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {/* Collapse toggle (desktop only) */}
        {!isMobile && (
          <button
            onClick={toggleCollapse}
            className="collapse-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: collapsed ? 36 : '100%',
              height: 36,
              margin: collapsed ? '0 auto 12px' : '0 0 12px',
              background: 'var(--bg-hover)',
              border: '1px solid var(--border-primary)',
              borderRadius: 8,
              color: 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? Icon.chevronRight : Icon.chevronLeft}
          </button>
        )}

        {collapsed ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 'auto' }}>
            <img src={user?.user_metadata?.avatar_url || ''} alt="" style={{ ...S.avatar, width: 32, height: 32 }} />
            <button onClick={signOut} style={{ ...S.logoutBtn, width: 32, height: 32 }} title="Sign Out" aria-label="Sign Out">{Icon.logout}</button>
          </div>
        ) : (
          <div style={S.userBox}>
            <img src={user?.user_metadata?.avatar_url || ''} alt="" style={S.avatar} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email?.split('@')[0]}
              </div>
            </div>
            <button onClick={signOut} style={S.logoutBtn} title="Sign Out" aria-label="Sign Out">{Icon.logout}</button>
          </div>
        )}
      </aside>

      <main style={S.main} key={page}>
        {page === 'board' && (
          <BoardPage
            onAdd={() => setShowAdd(true)}
            onAnalyze={setShowAI}
            onCoverLetter={setShowCoverLetter}
            onEdit={setShowDetail}
            onDuplicate={handleDuplicate}
            onToast={(msg, action) => toast.info(msg, action)}
            stats={stats}
          />
        )}
        {page === 'resume' && <ResumePage onToast={toast.success} />}
        {page === 'analytics' && <AnalyticsPage stats={stats} />}
        {page === 'settings' && <SettingsPage user={user} onToast={toast.success} />}
      </main>

      {showAdd && (
        <AddJobModal
          onClose={() => setShowAdd(false)}
          onSuccess={toast.success}
          defaultStatus={defaultStatus}
        />
      )}
      {showAI && (
        <AIAnalysisModal
          job={showAI}
          onClose={() => setShowAI(null)}
          onToast={toast.success}
        />
      )}
      {showCoverLetter && (
        <CoverLetterModal
          job={showCoverLetter}
          onClose={() => setShowCoverLetter(null)}
          onToast={toast.success}
        />
      )}
      {showDetail && (
        <JobDetailModal
          job={showDetail}
          onClose={() => setShowDetail(null)}
          onToast={toast.success}
        />
      )}

      {showShortcuts && (
        <div style={S.overlay} onClick={() => setShowShortcuts(false)}>
          <div style={{ ...S.modal, maxWidth: 400, padding: 0 }} onClick={e => e.stopPropagation()}>
            <div style={S.modalHead}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>Keyboard Shortcuts</h2>
              <button style={S.modalX} onClick={() => setShowShortcuts(false)} aria-label="Close">&times;</button>
            </div>
            <div style={{ padding: '16px 32px 32px' }}>
              {SHORTCUTS.map(([key, desc], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < SHORTCUTS.length - 1 ? '1px solid var(--border-primary)' : 'none' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{desc}</span>
                  <span className="kbd">{key}</span>
                </div>
              ))}
              <p style={{ color: 'var(--text-dim)', fontSize: 12, marginTop: 16, textAlign: 'center' }}>Press <span className="kbd">Esc</span> to close any modal</p>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toast.toasts} />
    </div>
  );
}
