import React, { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ResumeProvider, useResume } from './context/ResumeContext';


const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;
const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

const AuthContext = createContext();
const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      if (data.session) {
        localStorage.setItem('jobflow_ext', JSON.stringify({
          url: SUPABASE_URL, key: SUPABASE_KEY,
          token: data.session.access_token, user: data.session.user
        }));
      }
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => {
      setUser(s?.user || null);
      if (s) localStorage.setItem('jobflow_ext', JSON.stringify({
        url: SUPABASE_URL, key: SUPABASE_KEY, token: s.access_token, user: s.user
      }));
    });
    return () => subscription.unsubscribe();
  }, []);

  const signIn = () => supabase?.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin }});
  const signOut = async () => { localStorage.clear(); await supabase?.auth.signOut(); setUser(null); };

  return <AuthContext.Provider value={{ user, loading, signIn, signOut }}>{children}</AuthContext.Provider>;
}

const JobsContext = createContext();
const useJobs = () => useContext(JobsContext);

function JobsProvider({ children }) {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    if (!user || !supabase) { setJobs([]); setLoading(false); return; }
    const { data } = await supabase.from('jobs').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setJobs(data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  useEffect(() => {
    if (!user || !supabase) return;
    const channel = supabase.channel('jobs').on('postgres_changes', 
      { event: '*', schema: 'public', table: 'jobs', filter: `user_id=eq.${user.id}` }, () => fetchJobs()
    ).subscribe();
    return () => channel.unsubscribe();
  }, [user, fetchJobs]);

  const addJob = async (job) => {
    const { data, error } = await supabase.from('jobs').insert([{ ...job, user_id: user.id }]).select().single();
    if (error) throw error;
    setJobs(prev => [data, ...prev]);
    return data;
  };

  const updateJob = async (id, updates) => {
    await supabase.from('jobs').update(updates).eq('id', id);
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...updates } : j));
  };

  const deleteJob = async (id) => {
    await supabase.from('jobs').delete().eq('id', id);
    setJobs(prev => prev.filter(j => j.id !== id));
  };

  const stats = {
    total: jobs.length,
    wishlist: jobs.filter(j => j.status === 'wishlist').length,
    applied: jobs.filter(j => j.status === 'applied').length,
    interview: jobs.filter(j => j.status === 'interview').length,
    offer: jobs.filter(j => j.status === 'offer').length,
    rejected: jobs.filter(j => j.status === 'rejected').length,
  };

  return <JobsContext.Provider value={{ jobs, loading, addJob, updateJob, deleteJob, stats }}>{children}</JobsContext.Provider>;
}

export default function App() {
  return (
    <AuthProvider>
      <ResumeProvider>
        <JobsProvider>
          <Router />
        </JobsProvider>
      </ResumeProvider>
    </AuthProvider>
  );
}

function Router() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState('board');
  if (!supabase) return <ConfigError />;
  if (loading) return <Loading />;
  if (!user) return <LoginPage />;
  return <Dashboard page={page} setPage={setPage} />;
}

function Loading() {
  return (
    <div style={S.center}>
      <div style={S.loadBox}>
        <div style={S.logo}>JF</div>
        <div style={S.spinner} />
        <p style={{ color: '#71717a', marginTop: 24, fontSize: 14, letterSpacing: '0.02em' }}>INITIALIZING...</p>
      </div>
    </div>
  );
}

function ConfigError() {
  return (
    <div style={S.center}>
      <div style={S.card}>
        <div style={{ fontSize: 48, marginBottom: 24, filter: 'drop-shadow(0 0 20px rgba(99,102,241,0.3))' }}>⚙️</div>
        <h2 style={{ color: '#fafafa', marginBottom: 12 }}>Setup Required</h2>
        <p style={{ color: '#a1a1aa', marginBottom: 28, lineHeight: 1.6 }}>Please connect your Supabase database by adding these environment variables.</p>
        <code style={S.code}>REACT_APP_SUPABASE_URL</code>
        <code style={S.code}>REACT_APP_SUPABASE_ANON_KEY</code>
      </div>
    </div>
  );
}

function LoginPage() {
  const { signIn } = useAuth();
  return (
    <div style={S.center}>
      <div style={S.glow} />
      <div style={S.loginCard}>
        <div style={S.logo}>JF</div>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#fafafa', letterSpacing: '-0.02em' }}>JobFlow</h1>
        <p style={{ color: '#a1a1aa', marginTop: 8, marginBottom: 40, fontSize: 16 }}>The intelligent workspace for your job search.</p>
        <div style={S.features}>
          {[['📋', 'Kanban Board'], ['🤖', 'AI Analysis'], ['📄', 'Resume Match'], ['🔗', 'Extension']].map(([icon, text], i) => (
            <div key={i} style={S.feat}><span>{icon}</span><span style={{ fontWeight: 500 }}>{text}</span></div>
          ))}
        </div>
        <button style={S.googleBtn} onClick={signIn}>
          <svg width="20" height="20" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/><path fill="#EA4335" d="M8.98 3.58c1.16 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.9z"/></svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}

function Dashboard({ page, setPage }) {
  const { user, signOut } = useAuth();
  const { stats } = useJobs();
  const { resumeText } = useResume(); // Now properly wrapped
  const [showAdd, setShowAdd] = useState(false);
  const [showAI, setShowAI] = useState(null);

  return (
    <div style={S.dashboard}>
      <aside style={S.sidebar}>
        <div style={S.sidebarTop}>
          <div style={S.logoSm}>JF</div>
          <div><div style={S.brand}>JobFlow</div><div style={S.badge}>PRO</div></div>
        </div>
        <nav style={S.nav}>
          <div style={S.navLabel}>WORKSPACE</div>
          {[['board', '📋', 'Job Board'], ['resume', '📄', 'My Resume'], ['analytics', '📊', 'Analytics'], ['settings', '⚙️', 'Settings']].map(([id, icon, label]) => (
            <button key={id} style={{ ...S.navItem, ...(page === id ? S.navActive : {}) }} onClick={() => setPage(id)}>
              <span style={{ fontSize: 18 }}>{icon}</span><span style={{ flex: 1 }}>{label}</span>
              {id === 'resume' && resumeText && <span style={{ color: '#10b981', fontSize: 12 }}>✓</span>}
            </button>
          ))}
        </nav>
        <div style={S.userBox}>
          <img src={user?.user_metadata?.avatar_url || ''} alt="" style={S.avatar} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#e4e4e7', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.user_metadata?.full_name?.split(' ')[0] || 'User'}</div>
            <div style={{ fontSize: 12, color: '#71717a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email?.split('@')[0]}</div>
          </div>
          <button onClick={signOut} style={S.logoutBtn} title="Sign Out">↪</button>
        </div>
      </aside>

      <main style={S.main}>
        {page === 'board' && <BoardPage onAdd={() => setShowAdd(true)} onAnalyze={setShowAI} stats={stats} />}
        {page === 'resume' && <ResumePage />}
        {page === 'analytics' && <AnalyticsPage stats={stats} />}
        {page === 'settings' && <SettingsPage user={user} />}
      </main>

      {showAdd && <AddJobModal onClose={() => setShowAdd(false)} />}
      {showAI && <AIModal job={showAI} onClose={() => setShowAI(null)} />}
    </div>
  );
}

function BoardPage({ onAdd, onAnalyze, stats }) {
  const { jobs, updateJob, deleteJob, loading } = useJobs();
  const [dragId, setDragId] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const cols = [
    { id: 'wishlist', label: 'Wishlist', icon: '💜', color: '#8b5cf6' },
    { id: 'applied', label: 'Applied', icon: '💙', color: '#3b82f6' },
    { id: 'interview', label: 'Interview', icon: '💛', color: '#f59e0b' },
    { id: 'offer', label: 'Offer', icon: '💚', color: '#10b981' },
    { id: 'rejected', label: 'Rejected', icon: '💔', color: '#ef4444' },
  ];

  const handleDrop = async (status) => {
    if (dragId) {
      const job = jobs.find(j => j.id === dragId);
      if (job && job.status !== status) await updateJob(dragId, { status });
    }
    setDragId(null); setDragOver(null);
  };

  return (
    <div style={S.page}>
      <header style={S.header}>
        <div>
          <h1 style={S.title}>Job Board</h1>
          <p style={S.subtitle}>Manage your applications & track progress</p>
        </div>
        <button style={S.addBtn} onClick={onAdd}>
          <span>+</span> Add Job
        </button>
      </header>

      <div style={S.statsBar}>
        <div style={S.stat}><span style={S.statNum}>{stats.total}</span><span style={S.statLbl}>Total Jobs</span></div>
        <div style={S.statDiv} />
        {cols.slice(0, 4).map(c => (
          <div key={c.id} style={S.stat}>
            <span style={{ ...S.statNum, color: c.color }}>{stats[c.id]}</span>
            <span style={S.statLbl}>{c.label}</span>
          </div>
        ))}
      </div>

      {loading ? <div style={S.loading}><div style={S.spinner} /></div> : (
        <div style={S.kanbanContainer}>
          <div style={S.kanban}>
            {cols.map(col => (
              <div key={col.id} style={{ ...S.column, borderColor: dragOver === col.id ? col.color : 'transparent', background: dragOver === col.id ? `${col.color}08` : '#121215' }}
                onDragOver={e => { e.preventDefault(); setDragOver(col.id); }} onDragLeave={() => setDragOver(null)} onDrop={() => handleDrop(col.id)}>
                <div style={S.colHead}>
                  <div style={{display:'flex', alignItems:'center', gap:8}}>
                     <span>{col.icon}</span>
                     <span style={{ fontWeight: 600, fontSize: 14 }}>{col.label}</span>
                  </div>
                  <span style={{ ...S.count, background: `${col.color}15`, color: col.color }}>{jobs.filter(j => j.status === col.id).length}</span>
                </div>
                <div style={S.colBody}>
                  {jobs.filter(j => j.status === col.id).map(job => (
                    <JobCard key={job.id} job={job} isDragging={dragId === job.id}
                      onDragStart={() => setDragId(job.id)} onDragEnd={() => setDragId(null)}
                      onAnalyze={() => onAnalyze(job)} onDelete={() => deleteJob(job.id)}
                      onMove={(s) => updateJob(job.id, { status: s })} />
                  ))}
                  {jobs.filter(j => j.status === col.id).length === 0 && (
                    <div style={S.empty}><span>{col.icon}</span><span>No jobs yet</span></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function JobCard({ job, isDragging, onDragStart, onDragEnd, onAnalyze, onDelete, onMove }) {
  const [menu, setMenu] = useState(false);
  const colors = { wishlist: '#8b5cf6', applied: '#3b82f6', interview: '#f59e0b', offer: '#10b981', rejected: '#ef4444' };
  const fmtDate = (d) => { if (!d) return ''; const diff = Math.floor((Date.now() - new Date(d)) / 86400000); return diff === 0 ? 'Today' : diff === 1 ? 'Yesterday' : diff < 7 ? `${diff}d ago` : new Date(d).toLocaleDateString(); };

  return (
    <div draggable onDragStart={onDragStart} onDragEnd={onDragEnd} style={{ ...S.jobCard, opacity: isDragging ? 0.4 : 1, transform: isDragging ? 'scale(0.95)' : 'scale(1)' }}>
      <div style={S.cardTop}>
        <div style={S.compLogo}>{job.company?.[0]?.toUpperCase() || '?'}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#f4f4f5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.company}</div>
          <div style={{ fontSize: 11, color: '#71717a' }}>{fmtDate(job.created_at)}</div>
        </div>
        <div style={{display:'flex', gap: 4}}>
            <button style={S.aiBtn} onClick={onAnalyze} title="AI Analysis">✨</button>
            <div style={{ position: 'relative' }}>
            <button style={S.menuBtn} onClick={() => setMenu(!menu)}>⋮</button>
            {menu && <>
                <div style={S.menuBg} onClick={() => setMenu(false)} />
                <div style={S.dropdown}>
                <div style={S.ddLabel}>Move to</div>
                {Object.entries(colors).map(([s, c]) => (
                    <button key={s} style={{ ...S.ddItem, color: c }} onClick={() => { onMove(s); setMenu(false); }}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
                ))}
                <div style={S.ddDiv} />
                <button style={{ ...S.ddItem, color: '#ef4444' }} onClick={() => { onDelete(); setMenu(false); }}>Delete</button>
                </div>
            </>}
            </div>
        </div>
      </div>
      <h3 style={S.jobTitle}>{job.title}</h3>
      {job.location && <p style={S.jobLoc}>📍 {job.location}</p>}
      <div style={S.cardFoot}>
        <div style={{ ...S.dot, background: colors[job.status], boxShadow: `0 0 8px ${colors[job.status]}60` }} />
        {job.url ? <a href={job.url} target="_blank" rel="noreferrer" style={S.link}>View Details</a> : <span style={{ color: '#52525b', fontSize: 12 }}>No link</span>}
      </div>
    </div>
  );
}

function ResumePage() {
  const {
    resumeText,
    resumeFileName,
    isProcessing,
    error: contextError,
    processFile,
    saveResume,
    clearResume
  } = useResume();

  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  // Sync local state with context
  useEffect(() => {
    if (resumeText && !text) {
      setText(resumeText);
    }
  }, [resumeText]);

  const displayText = text || resumeText;
  const displayFileName = resumeFileName;

  const handleSave = async () => {
    const textToSave = text || resumeText;
    if (!textToSave || textToSave.trim().length < 50) {
      setError('Resume text is too short (minimum 50 characters)');
      return;
    }
    
    const fileName = displayFileName || 'resume.txt';
    const success = await saveResume(textToSave, fileName);
    
    if (success) {
      setSaved(true);
      setError('');
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleClear = async () => {
    setText('');
    setError('');
    await clearResume();
  };

  const handleFileProcess = async (file) => {
    if (!file) return;
    setError('');
    try {
      await processFile(file);
      setText('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={S.page}>
      <header style={S.header}>
        <div>
          <h1 style={S.title}>My Resume</h1>
          <p style={S.subtitle}>Upload your resume to enable AI matching</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {displayText && <button style={S.secBtn} onClick={handleClear}>Clear</button>}
          <button 
            style={{ 
              ...S.addBtn, 
              ...(saved ? { background: '#10b981', boxShadow: 'none' } : {}),
              ...((!displayText || displayText.trim().length < 50) ? { opacity: 0.5, cursor: 'not-allowed' } : {})
            }} 
            onClick={handleSave} 
            disabled={!displayText || displayText.trim().length < 50}
          >
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </header>

      <div style={S.resumeContent}>
        <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
          <div 
            style={{ 
              ...S.uploadZone, 
              borderColor: dragging ? '#6366f1' : '#27272a', 
              background: dragging ? 'rgba(99,102,241,0.05)' : '#121215' 
            }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }} 
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); handleFileProcess(e.dataTransfer.files[0]); }}
            onClick={() => fileRef.current?.click()}
          >
            <input 
              ref={fileRef} 
              type="file" 
              accept=".pdf,.docx,.txt" 
              onChange={(e) => handleFileProcess(e.target.files[0])} 
              style={{ display: 'none' }} 
            />
            {isProcessing ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#a1a1aa' }}>
                <div style={S.spinnerSm} />
                Processing file...
              </div>
            ) : (
              <>
                <div style={S.uploadIcon}>📄</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#e4e4e7', marginBottom: 6 }}>
                  {displayFileName || 'Upload your resume'}
                </div>
                <div style={{ color: '#71717a', fontSize: 14 }}>
                  Drag & drop or click to browse (PDF, DOCX, TXT)
                </div>
                {displayFileName && (
                  <div style={S.fileTag}>
                    <span>{displayFileName}</span>
                    <button 
                      style={S.fileX} 
                      onClick={(e) => { e.stopPropagation(); handleClear(); }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {(error || contextError) && <div style={S.error}>{error || contextError}</div>}

          <div style={S.divider}>
            <span style={S.divText}>or paste text manually</span>
          </div>

          <textarea 
            style={S.textarea} 
            placeholder="Paste your resume text here..." 
            value={displayText} 
            onChange={(e) => setText(e.target.value)} 
          />
          <div style={{ textAlign: 'right', fontSize: 12, color: '#52525b', marginTop: 8 }}>
            {displayText.length.toLocaleString()} characters
            {displayText.length < 50 && displayText.length > 0 && (
              <span style={{ color: '#f59e0b', marginLeft: 8 }}>
                (minimum 50 characters required)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsPage({ stats }) {
  const { jobs } = useJobs();
  const rate = stats.applied > 0 ? Math.round(((stats.interview + stats.offer) / stats.applied) * 100) : 0;
  const success = stats.applied > 0 ? Math.round((stats.offer / stats.applied) * 100) : 0;

  return (
    <div style={S.page}>
      <header style={S.header}><div><h1 style={S.title}>Analytics</h1><p style={S.subtitle}>Insights into your job search performance</p></div></header>
      <div style={S.analyticsContent}>
        <div style={S.analyticsGrid}>
          {[['📝', stats.total, 'Total Jobs', '#fafafa'], ['📤', stats.applied, 'Applications', '#3b82f6'], ['💬', stats.interview, 'Interviews', '#f59e0b'],
            ['🎉', stats.offer, 'Offers', '#10b981'], ['📈', `${rate}%`, 'Response Rate', '#8b5cf6'], ['🏆', `${success}%`, 'Success Rate', '#ec4899']].map(([icon, val, label, color], i) => (
            <div key={i} style={S.aCard}>
                <div style={S.aIcon}>{icon}</div>
                <span style={{ fontSize: 32, fontWeight: 700, color, letterSpacing: '-0.03em' }}>{val}</span>
                <span style={{ color: '#71717a', fontSize: 13, fontWeight: 500 }}>{label}</span>
            </div>
          ))}
        </div>
        <div style={S.recentCard}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, color: '#fafafa' }}>Recent Activity</h3>
          {jobs.length > 0 ? jobs.slice(0, 5).map(job => (
            <div key={job.id} style={S.recentItem}>
              <div style={S.compLogoSm}>{job.company?.[0]?.toUpperCase()}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: '#e4e4e7', fontSize: 15 }}>{job.title}</div>
                <div style={{ fontSize: 13, color: '#71717a' }}>{job.company}</div>
              </div>
              <div style={{ padding: '4px 10px', background: '#27272a', borderRadius: 6, fontSize: 12, color: '#a1a1aa', textTransform: 'capitalize', fontWeight: 500 }}>{job.status}</div>
            </div>
          )) : <div style={{ textAlign: 'center', color: '#52525b', padding: 40 }}>No activity recorded yet.</div>}
        </div>
      </div>
    </div>
  );
}


function SettingsPage({ user }) {
  return (
    <div style={S.page}>
      <header style={S.header}><div><h1 style={S.title}>Settings</h1><p style={S.subtitle}>Manage preferences and integrations</p></div></header>
      <div style={S.settingsContent}>
        <div style={{ maxWidth: 700, margin: '0 auto', width: '100%' }}>
          <div style={S.settingsCard}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, color: '#fafafa' }}>Account Information</h3>
            {[['Email', user?.email], ['Name', user?.user_metadata?.full_name || 'Not set']].map(([label, value], i) => (
              <div key={i} style={S.settingsRow}><span style={{ color: '#a1a1aa' }}>{label}</span><span style={{ color: '#f4f4f5', fontWeight: 500 }}>{value}</span></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AddJobModal({ onClose }) {
  const { addJob } = useJobs();
  const [form, setForm] = useState({ title: '', company: '', location: '', url: '', description: '', status: 'wishlist' });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.company.trim()) { setErr('Title and Company required'); return; }
    setSaving(true);
    try { await addJob(form); onClose(); } catch (e) { setErr(e.message); setSaving(false); }
  };

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <div style={S.modalHead}><h2 style={{ fontSize: 20, fontWeight: 700, color: '#fafafa' }}>New Application</h2><button style={S.modalX} onClick={onClose}>×</button></div>
        {err && <div style={S.modalErr}>{err}</div>}
        <form onSubmit={submit} style={S.form}>
          <div style={S.formRow}>
            <div style={S.formGroup}><label style={S.label}>Job Title *</label><input style={S.input} placeholder="e.g. Senior Frontend Engineer" autoFocus value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div style={S.formGroup}><label style={S.label}>Company *</label><input style={S.input} placeholder="e.g. Vercel" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></div>
          </div>
          <div style={S.formRow}>
            <div style={S.formGroup}><label style={S.label}>Location</label><input style={S.input} placeholder="e.g. Remote" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
            <div style={S.formGroup}><label style={S.label}>Status</label>
              <select style={S.input} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="wishlist">💜 Wishlist</option><option value="applied">💙 Applied</option><option value="interview">💛 Interview</option><option value="offer">💚 Offer</option>
              </select>
            </div>
          </div>
          <div style={S.formGroup}><label style={S.label}>Job URL</label><input style={S.input} placeholder="https://..." value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} /></div>
          <div style={S.formGroup}><label style={S.label}>Description <span style={{ color: '#71717a', fontWeight: 400 }}>(Optional, for AI)</span></label><textarea style={{ ...S.input, minHeight: 120, resize:'vertical' }} placeholder="Paste the job description here..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          <div style={S.modalFoot}><button type="button" style={S.secBtn} onClick={onClose}>Cancel</button><button type="submit" style={S.addBtn} disabled={saving}>{saving ? 'Adding...' : 'Add Job'}</button></div>
        </form>
      </div>
    </div>
  );
}

function AIModal({ job, onClose }) {
  const { resumeText } = useResume(); 
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AIModal - Resume detected:', !!resumeText, 'Length:', resumeText?.length || 0);
    
    (async () => {
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
        setResult(data.analysis || localAnalyze(job.description, resumeText));
      } catch (err) { 
        console.error('API Error:', err);
        setResult(localAnalyze(job.description, resumeText)); 
      }
      setLoading(false);
    })();
  }, [job, resumeText]);

  const getColor = (s) => s >= 70 ? '#10b981' : s >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={{ ...S.modal, maxWidth: 600 }} onClick={e => e.stopPropagation()}>
        <div style={S.modalHead}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fafafa' }}>AI Analysis</h2>
            <p style={{ color: '#a1a1aa', marginTop: 4, fontSize: 13 }}>{job.title} @ {job.company}</p>
          </div>
          <button style={S.modalX} onClick={onClose}>×</button>
        </div>
        <div style={S.aiBody}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={S.spinner} />
              <p style={{ color: '#71717a', marginTop: 24, fontSize: 14 }}>Analyzing job compatibility...</p>
            </div>
          ) : result ? (
            <>
              <div style={S.scoreBox}>
                <div style={{ ...S.scoreCircle, borderColor: getColor(result.matchScore), color: getColor(result.matchScore) }}>
                  <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em' }}>{result.matchScore}%</span>
                  <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.8, textTransform: 'uppercase', letterSpacing: 1 }}>Match</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{display:'flex', alignItems:'center', gap: 10, marginBottom: 8}}>
                    <span style={{ fontSize: 20, fontWeight: 700, color: '#fafafa' }}>{result.matchLevel}</span>
                    {result.experienceLevel && <span style={S.lvlBadge}>{result.experienceLevel}</span>}
                  </div>
                  {result.summary && <p style={{ fontSize: 14, color: '#d4d4d8', lineHeight: 1.6 }}>{result.summary}</p>}
                </div>
              </div>
              <div style={S.skillsGrid}>
                <div style={S.skillsBox}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: '#10b981', marginBottom: 12, letterSpacing: 0.5, textTransform:'uppercase' }}>Match</h4>
                  <div style={S.tags}>
                    {(result.skills?.matched || []).map((s, i) => <span key={i} style={S.tagG}>{s}</span>)}
                    {!result.skills?.matched?.length && <span style={{ color: '#52525b', fontSize: 13 }}>No direct skill matches</span>}
                  </div>
                </div>
                <div style={S.skillsBox}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: '#ef4444', marginBottom: 12, letterSpacing: 0.5, textTransform:'uppercase' }}>Missing</h4>
                  <div style={S.tags}>
                    {(result.skills?.missing || []).slice(0, 8).map((s, i) => <span key={i} style={S.tagR}>{s}</span>)}
                    {!result.skills?.missing?.length && <span style={{ color: '#52525b', fontSize: 13 }}>No missing skills detected</span>}
                  </div>
                </div>
              </div>
              {result.recommendations?.length > 0 && (
                <div style={S.recsBox}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#fafafa' }}>💡 Improvements</h4>
                  {result.recommendations.slice(0, 3).map((t, i) => (
                    <div key={i} style={{marginBottom: 10, fontSize: 14, color: '#a1a1aa', display:'flex', gap:10}}>
                      <span style={{color:'#6366f1'}}>→</span><span>{t}</span>
                    </div>
                  ))}
                </div>
              )}
              {!resumeText && (
                <div style={S.warning}>
                  📄 <b>Missing Resume:</b> Upload your resume in the Resume tab to get a personalized analysis.
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#71717a' }}>
              No analysis available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function localAnalyze(desc, resume) {
  const d = (desc || '').toLowerCase(), r = (resume || '').toLowerCase();
  const skills = ['javascript', 'typescript', 'python', 'java', 'react', 'node', 'aws', 'docker', 'sql', 'postgres', 'git', 'agile', 'css', 'html', 'api', 'rest', 'graphql'];
  const jSkills = skills.filter(s => d.includes(s)), mSkills = skills.filter(s => r.includes(s));
  const matched = jSkills.filter(s => mSkills.includes(s)), missing = jSkills.filter(s => !mSkills.includes(s));
  const score = jSkills.length ? Math.round((matched.length / jSkills.length) * 100) : 50;
  return { matchScore: score, matchLevel: score >= 70 ? 'Strong Match' : score >= 50 ? 'Good Match' : 'Fair Match',
    summary: resume ? `Based on keywords, you match ${matched.length} of ${jSkills.length} identified skills in this description.` : 'Please upload a resume for a personalized score.',
    experienceLevel: d.includes('senior') ? 'Senior' : d.includes('junior') ? 'Entry' : 'Mid-Level',
    skills: { matched, missing }, recommendations: ['Tailor your resume keywords', 'Highlight relevant projects', 'Research the company values'] };
}

// --- STYLES ---
const S = {
  // Layouts
  center: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090b', padding: 24, fontFamily: 'Inter, sans-serif' },
  dashboard: { display: 'flex', height: '100vh', background: '#09090b', color: '#fafafa', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', overflow: 'hidden' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' },
  page: { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' },
  
  // Sidebar
  sidebar: { width: 260, background: '#0a0a0c', borderRight: '1px solid #1f1f23', display: 'flex', flexDirection: 'column', padding: '24px 16px', zIndex: 20 },
  sidebarTop: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 40, padding: '0 8px' },
  logoSm: { width: 40, height: 40, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#fff', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' },
  brand: { fontSize: 18, fontWeight: 700, color: '#fafafa', letterSpacing: '-0.02em' },
  badge: { fontSize: 9, fontWeight: 700, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', padding: '2px 8px', borderRadius: 6, color: '#fff', width: 'fit-content', marginTop: 2, letterSpacing: 0.5 },
  nav: { flex: 1, display: 'flex', flexDirection: 'column', gap: 4 },
  navLabel: { fontSize: 11, fontWeight: 700, color: '#52525b', letterSpacing: 1.2, padding: '0 12px', marginBottom: 12 },
  navItem: { display: 'flex', alignItems: 'center', gap: 14, width: '100%', padding: '10px 14px', background: 'transparent', border: 'none', borderRadius: 8, color: '#a1a1aa', fontSize: 14, fontWeight: 500, cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', outline: 'none' },
  navActive: { background: 'rgba(99,102,241,0.08)', color: '#fff', fontWeight: 600 },
  userBox: { display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#121215', borderRadius: 12, border: '1px solid #1f1f23', marginTop: 'auto' },
  avatar: { width: 36, height: 36, borderRadius: '50%', background: '#27272a', objectFit: 'cover' },
  logoutBtn: { width: 32, height: 32, background: 'transparent', border: 'none', borderRadius: 8, color: '#71717a', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' },

  // Header & Common
  header: { flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 40px', borderBottom: '1px solid #1f1f23', background: 'rgba(9,9,11,0.7)', backdropFilter: 'blur(12px)', zIndex: 10 },
  title: { fontSize: 24, fontWeight: 700, color: '#fafafa', margin: 0, letterSpacing: '-0.02em' },
  subtitle: { fontSize: 14, color: '#a1a1aa', marginTop: 4 },
  addBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.25)', transition: 'transform 0.2s' },
  secBtn: { padding: '10px 20px', background: '#1f1f23', border: '1px solid #27272a', borderRadius: 10, color: '#d4d4d8', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' },
  
  // Board / Kanban
  statsBar: { flexShrink: 0, display: 'flex', alignItems: 'center', gap: 32, padding: '20px 40px', borderBottom: '1px solid #1f1f23', background: '#09090b' },
  stat: { display: 'flex', alignItems: 'center', gap: 12 },
  statNum: { fontSize: 20, fontWeight: 700, color: '#fafafa' },
  statLbl: { fontSize: 13, color: '#71717a', fontWeight: 500 },
  statDiv: { width: 1, height: 24, background: '#27272a' },
  kanbanContainer: { flex: 1, overflowX: 'auto', overflowY: 'hidden', padding: '0 24px 24px' },
  kanban: { display: 'flex', gap: 16, padding: '24px 16px', height: '100%', minWidth: 'fit-content' },
  column: { width: 300, background: '#121215', borderRadius: 16, border: '1px solid #1f1f23', display: 'flex', flexDirection: 'column', transition: 'all 0.2s', height: '100%' },
  colHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #1f1f23' },
  count: { padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700 },
  colBody: { flex: 1, padding: 12, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', color: '#3f3f46', fontSize: 14, gap: 12, fontStyle: 'italic' },

  // Job Cards
  jobCard: { background: '#18181b', borderRadius: 12, padding: 16, border: '1px solid #27272a', cursor: 'grab', transition: 'all 0.2s', position: 'relative', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' },
  cardTop: { display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  compLogo: { width: 40, height: 40, background: 'linear-gradient(135deg, #27272a, #1f1f23)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#a1a1aa', border: '1px solid #27272a' },
  aiBtn: { width: 28, height: 28, background: 'rgba(99,102,241,0.1)', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer', color: '#a78bfa', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' },
  menuBtn: { width: 28, height: 28, background: 'transparent', border: 'none', borderRadius: 8, color: '#71717a', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 2 },
  menuBg: { position: 'fixed', inset: 0, zIndex: 99 },
  dropdown: { position: 'absolute', top: 32, right: 0, background: '#18181b', borderRadius: 12, padding: 6, minWidth: 140, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.8)', border: '1px solid #27272a', zIndex: 100 },
  ddLabel: { padding: '8px 10px', fontSize: 10, color: '#52525b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5 },
  ddItem: { display: 'block', width: '100%', padding: '8px 10px', background: 'none', border: 'none', textAlign: 'left', fontSize: 13, cursor: 'pointer', borderRadius: 6, transition: 'background 0.1s', fontWeight: 500 },
  ddDiv: { height: 1, background: '#27272a', margin: '4px 0' },
  jobTitle: { fontSize: 15, fontWeight: 600, color: '#fafafa', margin: '0 0 6px', lineHeight: 1.4 },
  jobLoc: { fontSize: 12, color: '#71717a', marginBottom: 14, display:'flex', alignItems:'center', gap:4 },
  cardFoot: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #27272a' },
  dot: { width: 8, height: 8, borderRadius: '50%' },
  link: { fontSize: 12, color: '#6366f1', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' },

  // Resume Page
  // Changed: Removed max-width/margin so scrollbar stays at the window edge.
  resumeContent: { padding: '32px 40px', flex: 1, overflowY: 'auto' },
  uploadZone: { padding: '48px 32px', border: '2px dashed #27272a', borderRadius: 16, textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', marginBottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  uploadIcon: { fontSize: 40, marginBottom: 16, background: '#18181b', width: 80, height: 80, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #27272a' },
  fileTag: { display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 16px', background: 'rgba(99,102,241,0.1)', borderRadius: 20, marginTop: 16, color: '#a78bfa', fontSize: 14, border: '1px solid rgba(99,102,241,0.2)' },
  fileX: { width: 20, height: 20, background: 'rgba(0,0,0,0.2)', border: 'none', borderRadius: '50%', color: '#fff', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  error: { padding: 16, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, color: '#f87171', fontSize: 14, marginBottom: 24, textAlign: 'center' },
  divider: { display: 'flex', alignItems: 'center', margin: '32px 0', width: '100%' },
  divText: { padding: '0 20px', color: '#52525b', fontSize: 12, background: '#09090b', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 },
  textarea: { width: '100%', minHeight: 200, padding: 24, background: '#121215', border: '1px solid #27272a', borderRadius: 16, color: '#e4e4e7', fontSize: 14, fontFamily: 'monospace', lineHeight: 1.7, resize: 'vertical', outline: 'none', transition: 'border 0.2s' },
  tips: { padding: 24, background: '#121215', borderRadius: 16, border: '1px solid #1f1f23', marginTop: 32 },
  tipsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 },
  tipItem: { display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: '#a1a1aa', background: '#18181b', padding: 12, borderRadius: 10 },

  // Analytics
  analyticsContent: { padding: '32px 40px', flex: 1, overflowY: 'auto' },
  analyticsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 32 },
  aCard: { background: '#121215', padding: 24, borderRadius: 16, border: '1px solid #1f1f23', display: 'flex', flexDirection: 'column', gap: 8, transition: 'transform 0.2s, box-shadow 0.2s' },
  aIcon: { fontSize: 24, marginBottom: 8 },
  recentCard: { background: '#121215', borderRadius: 16, padding: 32, border: '1px solid #1f1f23', maxWidth: 800 },
  recentItem: { display: 'flex', alignItems: 'center', gap: 16, padding: '16px', background: '#18181b', borderRadius: 12, marginBottom: 12, border: '1px solid #27272a', transition: 'transform 0.1s' },
  compLogoSm: { width: 36, height: 36, background: '#27272a', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff' },

  // Settings
  // Changed: Removed max-width so scrollbar stays at edge
  settingsContent: { padding: '32px 40px', flex: 1, overflowY: 'auto' },
  settingsCard: { background: '#121215', borderRadius: 16, padding: 32, marginBottom: 24, border: '1px solid #1f1f23' },
  settingsRow: { display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderBottom: '1px solid #1f1f23', fontSize: 14 },
  step: { display: 'flex', alignItems: 'center', gap: 16, padding: '16px', background: '#18181b', borderRadius: 12, border: '1px solid #27272a' },
  stepNum: { width: 28, height: 28, background: '#6366f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700, flexShrink: 0 },

  // Login & Loading
  loadBox: { textAlign: 'center', animation: 'fadeIn 0.5s' },
  logo: { width: 64, height: 64, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, color: '#fff', margin: '0 auto 32px', boxShadow: '0 8px 32px rgba(99,102,241,0.4)' },
  spinner: { width: 32, height: 32, border: '3px solid #1f1f23', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' },
  spinnerSm: { width: 16, height: 16, border: '2px solid #3f3f46', borderTopColor: '#a1a1aa', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  glow: { position: 'absolute', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 60%)', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none', zIndex: 0 },
  loginCard: { background: 'rgba(18,18,21,0.8)', backdropFilter: 'blur(20px)', padding: '60px 48px', borderRadius: 32, textAlign: 'center', border: '1px solid #27272a', position: 'relative', zIndex: 1, width: '100%', maxWidth: 440, boxShadow: '0 24px 60px -12px rgba(0,0,0,0.5)' },
  features: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 40, textAlign: 'left' },
  feat: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: '#18181b', borderRadius: 10, border: '1px solid #27272a', fontSize: 13, color: '#d4d4d8' },
  googleBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, width: '100%', padding: '16px', background: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, color: '#09090b', cursor: 'pointer', transition: 'transform 0.1s' },
  code: { display: 'block', background: '#000', padding: '16px', borderRadius: 8, fontSize: 13, fontFamily: 'monospace', color: '#a78bfa', marginBottom: 12, border: '1px solid #27272a' },
  card: { background: '#121215', padding: 48, borderRadius: 24, textAlign: 'center', border: '1px solid #1f1f23', maxWidth: 480 },

  // Modals
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 },
  modal: { background: '#121215', borderRadius: 20, width: '100%', maxWidth: 500, border: '1px solid #27272a', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' },
  modalHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '24px 32px', borderBottom: '1px solid #1f1f23', background: '#121215' },
  modalX: { width: 32, height: 32, background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, color: '#71717a', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' },
  modalErr: { margin: '20px 32px 0', padding: 12, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#f87171', fontSize: 13 },
  form: { padding: '32px', overflowY: 'auto' },
  formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  formGroup: { marginBottom: 20 },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#a1a1aa', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { width: '100%', padding: '12px 16px', background: '#09090b', border: '1px solid #27272a', borderRadius: 10, color: '#fafafa', fontSize: 14, fontFamily: 'inherit', outline: 'none', transition: 'border 0.2s', ':focus': { borderColor: '#6366f1' } },
  modalFoot: { display: 'flex', gap: 12, marginTop: 32, paddingTop: 20, borderTop: '1px solid #1f1f23' },

  // AI Modal Specifics
  aiBody: { padding: '32px', overflowY: 'auto' },
  scoreBox: { display: 'flex', alignItems: 'center', gap: 28, padding: 24, background: '#18181b', borderRadius: 16, marginBottom: 24, border: '1px solid #27272a' },
  scoreCircle: { width: 90, height: 90, borderRadius: '50%', border: '6px solid', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  lvlBadge: { display: 'inline-block', padding: '4px 12px', background: '#27272a', color: '#e4e4e7', borderRadius: 20, fontSize: 12, fontWeight: 600, border: '1px solid #3f3f46' },
  skillsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 },
  skillsBox: { padding: 20, background: '#18181b', borderRadius: 14, border: '1px solid #27272a' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  tagG: { padding: '4px 10px', background: 'rgba(16,185,129,0.1)', color: '#34d399', borderRadius: 6, fontSize: 12, fontWeight: 500, border: '1px solid rgba(16,185,129,0.2)' },
  tagR: { padding: '4px 10px', background: 'rgba(239,68,68,0.1)', color: '#f87171', borderRadius: 6, fontSize: 12, fontWeight: 500, border: '1px solid rgba(239,68,68,0.2)' },
  recsBox: { padding: 24, background: '#18181b', borderRadius: 14, marginBottom: 20, border: '1px solid #27272a' },
  warning: { padding: 16, background: 'rgba(234,179,8,0.1)', borderRadius: 10, fontSize: 13, color: '#fbbf24', border: '1px solid rgba(234,179,8,0.2)', lineHeight: 1.5 },
};

// Global CSS for scrollbars and focus states
const style = document.createElement('style');
style.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; }
  body { margin: 0; background: #09090b; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  
  ::-webkit-scrollbar { width: 8px; height: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #27272a; borderRadius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
  
  input:focus, select:focus, textarea:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 2px rgba(99,102,241,0.2); }
  button:active { transform: scale(0.98); }
`;
document.head.appendChild(style);