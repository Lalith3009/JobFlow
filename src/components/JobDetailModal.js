import React, { useState } from 'react';
import { S } from '../styles/styles';
import { useJobs } from '../context/JobsContext';

export function JobDetailModal({ job, onClose, onToast }) {
  const { updateJob } = useJobs();
  const [form, setForm] = useState({
    title: job.title || '',
    company: job.company || '',
    location: job.location || '',
    url: job.url || '',
    salary: job.salary || '',
    description: job.description || '',
    status: job.status || 'wishlist',
    follow_up_date: job.follow_up_date || '',
  });
  const [notes, setNotes] = useState(job.notes || []);
  const [newNote, setNewNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [edited, setEdited] = useState(false);

  const update = (key, val) => {
    setForm(prev => ({ ...prev, [key]: val }));
    setEdited(true);
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    const entry = { text: newNote.trim(), created_at: new Date().toISOString() };
    setNotes(prev => [entry, ...prev]);
    setNewNote('');
    setEdited(true);
  };

  const removeNote = (idx) => {
    setNotes(prev => prev.filter((_, i) => i !== idx));
    setEdited(true);
  };

  const save = async () => {
    if (!form.title.trim() || !form.company.trim()) return;
    setSaving(true);
    try {
      await updateJob(job.id, { ...form, notes });
      if (onToast) onToast('Job updated successfully');
      onClose();
    } catch {
      setSaving(false);
    }
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : '';
  const fmtNoteDate = (d) => {
    const date = new Date(d);
    const now = new Date();
    const diff = Math.floor((now - date) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = form.follow_up_date && new Date(form.follow_up_date) < new Date(new Date().toDateString());

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={{ ...S.modal, maxWidth: 600 }} onClick={e => e.stopPropagation()}>
        <div style={S.modalHead}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>Job Details</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: 4, fontSize: 12 }}>Added {fmtDate(job.created_at)}</p>
          </div>
          <button style={S.modalX} onClick={onClose} aria-label="Close modal">×</button>
        </div>
        <div style={{ padding: 32, overflowY: 'auto', maxHeight: 'calc(90vh - 120px)' }}>
          <div style={S.formRow}>
            <div style={S.formGroup}>
              <label style={S.label}>Job Title</label>
              <input style={S.input} value={form.title} onChange={e => update('title', e.target.value)} />
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>Company</label>
              <input style={S.input} value={form.company} onChange={e => update('company', e.target.value)} />
            </div>
          </div>
          <div style={S.formRow}>
            <div style={S.formGroup}>
              <label style={S.label}>Location</label>
              <input style={S.input} placeholder="e.g. Remote" value={form.location} onChange={e => update('location', e.target.value)} />
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>Status</label>
              <select style={S.input} value={form.status} onChange={e => update('status', e.target.value)}>
                <option value="wishlist">Wishlist</option>
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div style={S.formRow}>
            <div style={S.formGroup}>
              <label style={S.label}>Job URL</label>
              <input style={S.input} placeholder="https://..." value={form.url} onChange={e => update('url', e.target.value)} />
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>Salary</label>
              <input style={S.input} placeholder="e.g. $120k - $150k" value={form.salary} onChange={e => update('salary', e.target.value)} />
            </div>
          </div>
          <div style={S.formGroup}>
            <label style={S.label}>
              Follow-up Date
              {isOverdue && (
                <span style={{ marginLeft: 8, color: 'var(--error)', fontSize: 11, fontWeight: 600 }}>OVERDUE</span>
              )}
            </label>
            <input
              type="date"
              style={{
                ...S.input,
                ...(isOverdue ? { borderColor: 'var(--error)', boxShadow: '0 0 0 3px var(--error-muted)' } : {}),
              }}
              value={form.follow_up_date}
              onChange={e => update('follow_up_date', e.target.value)}
            />
          </div>
          <div style={S.formGroup}>
            <label style={S.label}>Description</label>
            <textarea
              style={{ ...S.input, minHeight: 100, resize: 'vertical' }}
              placeholder="Job description..."
              value={form.description}
              onChange={e => update('description', e.target.value)}
            />
          </div>

          {/* Notes Timeline */}
          <div style={{ marginTop: 24, borderTop: '1px solid var(--border-primary)', paddingTop: 24 }}>
            <label style={{ ...S.label, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              Notes
              {notes.length > 0 && <span style={{ color: 'var(--text-dim)', fontWeight: 400, fontSize: 12 }}>({notes.length})</span>}
            </label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input
                style={{ ...S.input, flex: 1 }}
                placeholder="Add a note... (e.g. 'Phone screen with recruiter')"
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addNote(); } }}
              />
              <button
                style={{
                  ...S.addBtn,
                  padding: '10px 16px',
                  whiteSpace: 'nowrap',
                  opacity: newNote.trim() ? 1 : 0.5,
                }}
                onClick={addNote}
                disabled={!newNote.trim()}
                type="button"
              >
                Add
              </button>
            </div>
            {notes.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {notes.map((note, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    gap: 12,
                    padding: '12px 0',
                    borderBottom: i < notes.length - 1 ? '1px solid var(--border-primary)' : 'none',
                    alignItems: 'flex-start',
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: 'var(--accent)', flexShrink: 0, marginTop: 6,
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5, wordBreak: 'break-word' }}>{note.text}</p>
                      <span style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 4, display: 'block' }}>{fmtNoteDate(note.created_at)}</span>
                    </div>
                    <button
                      onClick={() => removeNote(i)}
                      style={{
                        background: 'none', border: 'none', color: 'var(--text-dim)',
                        cursor: 'pointer', padding: 4, flexShrink: 0, fontSize: 14,
                        borderRadius: 4, transition: 'color 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--error)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
                      title="Remove note"
                    >×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={S.modalFoot}>
            <button type="button" style={S.secBtn} onClick={onClose}>Cancel</button>
            <button
              style={{ ...S.addBtn, opacity: edited ? 1 : 0.5 }}
              onClick={save}
              disabled={saving || !edited}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
