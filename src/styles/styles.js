export const S = {
  // Layouts
  center: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', padding: 24, fontFamily: 'Inter, sans-serif', transition: 'background 0.3s' },
  dashboard: { display: 'flex', height: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', overflow: 'hidden', transition: 'background 0.3s' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' },
  page: { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' },

  // Sidebar
  sidebar: { width: 260, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column', padding: '24px 16px', zIndex: 20, transition: 'width 0.25s ease, padding 0.25s ease, transform 0.3s ease, background 0.3s', flexShrink: 0 },
  sidebarTop: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 40, padding: '0 8px' },
  logoSm: { width: 40, height: 40, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#fff', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' },
  brand: { fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' },
  badge: { fontSize: 9, fontWeight: 700, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', padding: '2px 8px', borderRadius: 6, color: '#fff', width: 'fit-content', marginTop: 2, letterSpacing: 0.5 },
  nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: 4 },
  navLabel: { fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', letterSpacing: 1.2, padding: '0 12px', marginBottom: 12 },
  navItem: { display: 'flex', alignItems: 'center', gap: 14, width: '100%', padding: '10px 14px', background: 'transparent', border: 'none', borderRadius: 8, color: 'var(--text-muted)', fontSize: 14, fontWeight: 500, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', outline: 'none' },
  navActive: { background: 'var(--accent-muted)', color: 'var(--text-primary)', fontWeight: 600 },
  userBox: { display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'var(--bg-card)', borderRadius: 12, border: '1px solid var(--border-primary)', marginTop: 'auto' },
  avatar: { width: 36, height: 36, borderRadius: '50%', background: 'var(--border-secondary)', objectFit: 'cover' },
  logoutBtn: { width: 32, height: 32, background: 'transparent', border: 'none', borderRadius: 8, color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' },
  hamburger: { display: 'none', position: 'fixed', top: 16, left: 16, zIndex: 30, width: 40, height: 40, background: 'var(--bg-elevated)', border: '1px solid var(--border-secondary)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 20, cursor: 'pointer', alignItems: 'center', justifyContent: 'center' },

  // Header & Common
  header: { flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 28px', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-primary)', backdropFilter: 'blur(12px)', zIndex: 10, transition: 'background 0.3s' },
  title: { fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.03em' },
  subtitle: { fontSize: 13, color: 'var(--text-muted)', marginTop: 2 },
  addBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.25)', transition: 'transform 0.2s' },
  secBtn: { padding: '10px 20px', background: 'var(--bg-elevated)', border: '1px solid var(--border-secondary)', borderRadius: 10, color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' },

  // Board / Kanban
  statsInline: { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  statPill: { display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'var(--bg-hover)', borderRadius: 20, border: '1px solid var(--border-primary)' },
  statNumSm: { fontSize: 14, fontWeight: 700 },
  statLblSm: { fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 },
  statDivSm: { width: 1, height: 16, background: 'var(--border-secondary)', margin: '0 2px' },
  kanbanContainer: { flex: 1, overflowX: 'auto', overflowY: 'hidden', padding: '0 24px 24px' },
  kanban: { display: 'flex', gap: 12, padding: '20px 8px', height: '100%', minWidth: 'fit-content' },
  column: { flex: '1 0 240px', maxWidth: 360, background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column', transition: 'border-color 0.2s, background 0.3s', height: '100%' },
  colHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderBottom: '1px solid var(--border-primary)' },
  count: { padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700 },
  colBody: { flex: 1, padding: 10, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 12px', color: 'var(--text-dim)', fontSize: 13, gap: 6, border: '1px dashed var(--border-secondary)', borderRadius: 12, margin: 4, textAlign: 'center' },

  // Job Cards
  jobCard: { background: 'var(--bg-elevated)', borderRadius: 12, padding: 14, border: '1px solid var(--border-secondary)', cursor: 'grab', transition: 'box-shadow 0.2s, border-color 0.2s, opacity 0.2s, background 0.3s', position: 'relative', boxShadow: 'var(--shadow-sm)' },
  cardTop: { display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  compLogo: { width: 36, height: 36, background: 'var(--bg-hover)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', border: '1px solid var(--border-tertiary)', flexShrink: 0 },
  aiBtn: { width: 26, height: 26, background: 'var(--accent-muted)', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer', color: '#a78bfa', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' },
  coverBtn: { width: 26, height: 26, background: 'var(--success-muted)', border: 'none', borderRadius: 6, fontSize: 13, cursor: 'pointer', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' },
  menuBtn: { width: 26, height: 26, background: 'transparent', border: 'none', borderRadius: 6, color: 'var(--text-muted)', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  menuBg: { position: 'fixed', inset: 0, zIndex: 9998 },
  dropdown: { position: 'fixed', background: 'var(--bg-elevated)', borderRadius: 12, padding: 6, minWidth: 160, boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-secondary)', zIndex: 9999 },
  ddLabel: { padding: '6px 10px', fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5 },
  ddItem: { display: 'block', width: '100%', padding: '7px 10px', background: 'none', border: 'none', textAlign: 'left', fontSize: 13, cursor: 'pointer', borderRadius: 6, transition: 'background 0.1s', fontWeight: 500, color: 'var(--text-secondary)' },
  ddDiv: { height: 1, background: 'var(--border-secondary)', margin: '4px 0' },
  jobTitle: { fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px', lineHeight: 1.35, wordBreak: 'break-word' },
  jobLoc: { fontSize: 11, color: 'var(--text-muted)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 4 },
  cardFoot: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border-primary)' },
  dot: { width: 8, height: 8, borderRadius: '50%' },
  link: { fontSize: 12, color: 'var(--accent)', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' },

  // Resume Page
  resumeContent: { padding: '32px 40px', flex: 1, overflowY: 'auto' },
  uploadZone: { padding: '48px 32px', border: '2px dashed var(--border-secondary)', borderRadius: 16, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', marginBottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)' },
  uploadIcon: { fontSize: 40, marginBottom: 16, background: 'var(--bg-elevated)', width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-secondary)' },
  fileTag: { display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 16px', background: 'var(--accent-muted)', borderRadius: 20, marginTop: 16, color: '#a78bfa', fontSize: 14, border: '1px solid rgba(99,102,241,0.2)' },
  fileX: { width: 20, height: 20, background: 'rgba(0,0,0,0.2)', border: 'none', borderRadius: '50%', color: '#fff', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  error: { padding: 16, background: 'var(--error-muted)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, color: 'var(--error)', fontSize: 14, marginBottom: 24, textAlign: 'center' },
  divider: { display: 'flex', alignItems: 'center', margin: '32px 0', width: '100%' },
  divText: { padding: '0 20px', color: 'var(--text-dim)', fontSize: 12, background: 'var(--bg-primary)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 },
  textarea: { width: '100%', minHeight: 200, padding: 24, background: 'var(--bg-card)', border: '1px solid var(--border-secondary)', borderRadius: 16, color: 'var(--text-secondary)', fontSize: 14, fontFamily: 'monospace', lineHeight: 1.7, resize: 'vertical', outline: 'none', transition: 'border 0.2s, background 0.3s' },

  // Analytics
  analyticsContent: { padding: '32px 40px', flex: 1, overflowY: 'auto' },
  analyticsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 32 },
  aCard: { background: 'var(--bg-card)', padding: 24, borderRadius: 16, border: '1px solid var(--border-primary)', display: 'flex', flexDirection: 'column', gap: 8, transition: 'transform 0.2s, box-shadow 0.2s, background 0.3s' },
  recentCard: { background: 'var(--bg-card)', borderRadius: 16, padding: 32, border: '1px solid var(--border-primary)', maxWidth: 800, transition: 'background 0.3s' },
  recentItem: { display: 'flex', alignItems: 'center', gap: 16, padding: '16px', background: 'var(--bg-elevated)', borderRadius: 12, marginBottom: 12, border: '1px solid var(--border-secondary)', transition: 'transform 0.1s, background 0.3s' },
  compLogoSm: { width: 36, height: 36, background: 'var(--border-secondary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' },

  // Settings
  settingsContent: { padding: '32px 40px', flex: 1, overflowY: 'auto' },
  settingsCard: { background: 'var(--bg-card)', borderRadius: 16, padding: 32, marginBottom: 24, border: '1px solid var(--border-primary)', transition: 'background 0.3s' },
  settingsRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid var(--border-primary)', fontSize: 14, gap: 16 },

  // Login & Loading
  loadBox: { textAlign: 'center', animation: 'fadeIn 0.5s' },
  logo: { width: 64, height: 64, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#fff', margin: '0 auto 32px', boxShadow: '0 8px 32px rgba(99,102,241,0.4)' },
  spinner: { width: 32, height: 32, border: '3px solid var(--border-primary)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' },
  spinnerSm: { width: 16, height: 16, border: '2px solid var(--border-tertiary)', borderTopColor: 'var(--text-muted)', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  glow: { position: 'absolute', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 60%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 0 },
  loginCard: { background: 'var(--bg-card)', backdropFilter: 'blur(20px)', padding: '60px 48px', borderRadius: 32, textAlign: 'center', border: '1px solid var(--border-secondary)', position: 'relative', zIndex: 1, width: '100%', maxWidth: 440, boxShadow: 'var(--shadow-lg)', transition: 'background 0.3s' },
  googleBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, width: '100%', padding: '16px', background: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, color: '#09090b', cursor: 'pointer', transition: 'transform 0.1s' },
  code: { display: 'block', background: 'var(--bg-primary)', padding: '16px', borderRadius: 8, fontSize: 13, fontFamily: 'monospace', color: '#a78bfa', marginBottom: 12, border: '1px solid var(--border-secondary)' },
  card: { background: 'var(--bg-card)', padding: 48, borderRadius: 24, textAlign: 'center', border: '1px solid var(--border-primary)', maxWidth: 480, transition: 'background 0.3s' },

  // Modals
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 },
  modal: { background: 'var(--bg-card)', borderRadius: 20, width: '100%', maxWidth: 500, border: '1px solid var(--border-secondary)', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-lg)', transition: 'background 0.3s' },
  modalHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '24px 32px', borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-card)', transition: 'background 0.3s' },
  modalX: { width: 32, height: 32, background: 'var(--bg-hover)', border: 'none', borderRadius: 8, color: 'var(--text-muted)', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' },
  modalErr: { margin: '20px 32px 0', padding: 12, background: 'var(--error-muted)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: 'var(--error)', fontSize: 13 },
  form: { padding: '32px', overflowY: 'auto' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  formGroup: { marginBottom: 20 },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { width: '100%', padding: '12px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border-secondary)', borderRadius: 10, color: 'var(--text-primary)', fontSize: 14, fontFamily: 'inherit', outline: 'none', transition: 'border 0.2s, background 0.3s' },
  modalFoot: { display: 'flex', gap: 12, marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--border-primary)' },

  // AI Modal Specifics
  aiBody: { padding: '32px', overflowY: 'auto' },
  scoreBox: { display: 'flex', alignItems: 'center', gap: 28, padding: 24, background: 'var(--bg-elevated)', borderRadius: 16, marginBottom: 24, border: '1px solid var(--border-secondary)', transition: 'background 0.3s' },
  lvlBadge: { display: 'inline-block', padding: '4px 12px', background: 'var(--border-secondary)', color: 'var(--text-secondary)', borderRadius: 20, fontSize: 12, fontWeight: 600, border: '1px solid var(--border-tertiary)' },
  cachedBadge: { display: 'inline-block', padding: '4px 10px', background: 'var(--success-muted)', color: 'var(--success)', borderRadius: 20, fontSize: 11, fontWeight: 600, border: '1px solid rgba(16,185,129,0.2)' },
  skillsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 },
  skillsBox: { padding: 20, background: 'var(--bg-elevated)', borderRadius: 14, border: '1px solid var(--border-secondary)', overflow: 'hidden', transition: 'background 0.3s' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  tagG: { display: 'inline-block', padding: '5px 12px', background: 'var(--success-muted)', color: 'var(--success)', borderRadius: 8, fontSize: 12, fontWeight: 500, border: '1px solid rgba(16,185,129,0.2)', lineHeight: 1.4, whiteSpace: 'nowrap' },
  tagR: { display: 'inline-block', padding: '5px 12px', background: 'var(--error-muted)', color: 'var(--error)', borderRadius: 8, fontSize: 12, fontWeight: 500, border: '1px solid rgba(239,68,68,0.2)', lineHeight: 1.4, whiteSpace: 'nowrap' },
  recsBox: { padding: 24, background: 'var(--bg-elevated)', borderRadius: 14, marginBottom: 20, border: '1px solid var(--border-secondary)', transition: 'background 0.3s' },
  warning: { padding: 16, background: 'var(--warning-muted)', borderRadius: 10, fontSize: 13, color: 'var(--warning)', border: '1px solid rgba(234,179,8,0.2)', lineHeight: 1.5, display: 'flex', alignItems: 'center', gap: 10 },

  // Cover Letter Modal
  coverBody: { padding: '32px', overflowY: 'auto' },
  coverText: { whiteSpace: 'pre-wrap', fontSize: 14, lineHeight: 1.8, color: 'var(--text-secondary)', padding: 24, background: 'var(--bg-elevated)', borderRadius: 14, border: '1px solid var(--border-secondary)', maxHeight: 400, overflowY: 'auto', transition: 'background 0.3s' },
  copyBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'var(--accent-muted)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, color: '#a78bfa', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' },

  // Pipeline / Progress bars
  pipelineBox: { background: 'var(--bg-card)', borderRadius: 16, padding: 32, border: '1px solid var(--border-primary)', marginBottom: 32, transition: 'background 0.3s' },
  pipelineRow: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 },
  pipelineLabel: { width: 100, fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', textAlign: 'right' },
  pipelineTrack: { flex: 1, height: 28, background: 'var(--bg-elevated)', borderRadius: 8, overflow: 'hidden', position: 'relative' },
  pipelineBar: { height: '100%', borderRadius: 8, transition: 'width 0.8s ease', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 10, fontSize: 12, fontWeight: 600, color: '#fff', minWidth: 'fit-content' },
  pipelineCount: { width: 36, fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', textAlign: 'center' },

  // Loading
  loading: { display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 },
};

// Global CSS injection
const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; }
  body { margin: 0; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes barGrow { from { width: 0; } }

  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--scrollbar-thumb); border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--scrollbar-hover); }

  input:focus, select:focus, textarea:focus { border-color: var(--accent) !important; box-shadow: 0 0 0 2px var(--accent-muted); }
  select option { background: var(--bg-card); color: var(--text-primary); padding: 8px; }
  button:active { transform: scale(0.98); }

  .job-card:hover { box-shadow: var(--shadow-md); border-color: var(--border-tertiary); }
  .nav-item:hover { background: var(--bg-hover); color: var(--text-secondary); }
  .btn-hover:hover { filter: brightness(1.1); }
  .card-hover:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }

  .page-transition { animation: fadeIn 0.3s ease; }

  .toast-enter { animation: slideInRight 0.3s ease; }
  .toast-exit { animation: fadeOut 0.3s ease forwards; }
  @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; transform: translateY(-10px); } }

  button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  [tabindex="0"]:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

  @media (max-width: 768px) {
    .sidebar-mobile { transform: translateX(-100%); position: fixed !important; height: 100vh; z-index: 25; }
    .sidebar-mobile.open { transform: translateX(0); }
    .hamburger-show { display: flex !important; }
    .main-mobile { margin-left: 0 !important; }
    .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 24; }
  }
`;
document.head.appendChild(style);
