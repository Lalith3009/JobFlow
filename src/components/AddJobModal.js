import React, { useState, useRef } from 'react';
import { S } from '../styles/styles';
import { useJobs } from '../context/JobsContext';

const EMPTY = { title: '', company: '', location: '', url: '', description: '', salary: '', status: 'wishlist', follow_up_date: '' };

export function AddJobModal({ onClose, onSuccess, defaultStatus }) {
  const { addJob } = useJobs();
  const [form, setForm] = useState({ ...EMPTY, status: defaultStatus || 'wishlist' });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [added, setAdded] = useState(0);
  const titleRef = useRef(null);

  const submit = async (e, addAnother = false) => {
    e.preventDefault();
    if (!form.title.trim() || !form.company.trim()) { setErr('Title and Company required'); return; }
    setSaving(true);
    try {
      await addJob(form);
      setAdded(prev => prev + 1);
      if (addAnother) {
        setForm({ ...EMPTY, status: form.status });
        setErr('');
        setSaving(false);
        if (onSuccess) onSuccess('Job added! Add another one');
        setTimeout(() => titleRef.current?.focus(), 50);
      } else {
        if (onSuccess) onSuccess('Job added successfully');
        onClose();
      }
    } catch (e) { setErr(e.message); setSaving(false); }
  };

  return (
    <div style={S.overlay} onClick={onClose}>
      <div style={S.modal} onClick={e => e.stopPropagation()}>
        <div style={S.modalHead}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>New Application</h2>
            {added > 0 && (
              <p style={{ color: 'var(--success)', marginTop: 4, fontSize: 12, fontWeight: 500 }}>
                {added} job{added > 1 ? 's' : ''} added this session
              </p>
            )}
          </div>
          <button style={S.modalX} onClick={onClose} aria-label="Close modal">×</button>
        </div>
        {err && <div style={S.modalErr}>{err}</div>}
        <form onSubmit={e => submit(e, false)} style={S.form}>
          <div style={S.formRow}>
            <div style={S.formGroup}>
              <label style={S.label}>Job Title *</label>
              <input ref={titleRef} style={S.input} placeholder="e.g. Senior Frontend Engineer" autoFocus value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>Company *</label>
              <input style={S.input} placeholder="e.g. Vercel" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
            </div>
          </div>
          <div style={S.formRow}>
            <div style={S.formGroup}>
              <label style={S.label}>Location</label>
              <input style={S.input} placeholder="e.g. Remote" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>Status</label>
              <select style={S.input} value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="wishlist">Wishlist</option>
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
              </select>
            </div>
          </div>
          <div style={S.formRow}>
            <div style={S.formGroup}>
              <label style={S.label}>Job URL</label>
              <input style={S.input} placeholder="https://..." value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} />
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>Salary</label>
              <input style={S.input} placeholder="e.g. $120k - $150k" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} />
            </div>
          </div>
          <div style={S.formGroup}>
            <label style={S.label}>Follow-up Date <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional)</span></label>
            <input type="date" style={S.input} value={form.follow_up_date} onChange={e => setForm({ ...form, follow_up_date: e.target.value })} />
          </div>
          <div style={S.formGroup}>
            <label style={S.label}>Description <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional, for AI)</span></label>
            <textarea style={{ ...S.input, minHeight: 120, resize: 'vertical' }} placeholder="Paste the job description here..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div style={S.modalFoot}>
            <button type="button" style={S.secBtn} onClick={onClose}>Cancel</button>
            <button
              type="button"
              style={{ ...S.secBtn, color: 'var(--accent-light)', borderColor: 'rgba(99,102,241,0.3)' }}
              onClick={e => submit(e, true)}
              disabled={saving}
            >
              Save & Add Another
            </button>
            <button type="submit" style={S.addBtn} disabled={saving}>{saving ? 'Adding...' : 'Add Job'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
