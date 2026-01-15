import React, { useState } from 'react';
import { useJobs } from '../context/JobsContext';

const AddJobModal = ({ onClose }) => {
  const { addJob } = useJobs();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    title: '',
    company: '',
    location: '',
    url: '',
    description: '',
    salary: '',
    status: 'wishlist',
    source: 'Manual'
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title.trim() || !form.company.trim()) {
      setError('Title and Company are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await addJob(form);
      onClose();
    } catch (err) {
      console.error('Add job error:', err);
      setError(err.message || 'Failed to add job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Add New Job</h2>
          <button style={styles.closeBtn} onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {error && (
            <div style={styles.error}>{error}</div>
          )}

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Job Title *</label>
              <input
                type="text"
                placeholder="e.g. Software Engineer"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Company *</label>
              <input
                type="text"
                placeholder="e.g. Google"
                value={form.company}
                onChange={(e) => handleChange('company', e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Location</label>
              <input
                type="text"
                placeholder="e.g. San Francisco, CA"
                value={form.location}
                onChange={(e) => handleChange('location', e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Status</label>
              <select
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value)}
                style={styles.select}
              >
                <option value="wishlist">💜 Wishlist</option>
                <option value="applied">💙 Applied</option>
                <option value="interview">💛 Interview</option>
                <option value="offer">💚 Offer</option>
                <option value="rejected">💔 Rejected</option>
              </select>
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.field}>
              <label style={styles.label}>Job URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={form.url}
                onChange={(e) => handleChange('url', e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Salary</label>
              <input
                type="text"
                placeholder="e.g. $120k - $150k"
                value={form.salary}
                onChange={(e) => handleChange('salary', e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              Job Description
              <span style={styles.labelHint}>(for AI analysis)</span>
            </label>
            <textarea
              placeholder="Paste the job description here for better AI analysis..."
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              style={styles.textarea}
              rows={5}
            />
          </div>

          <div style={styles.actions}>
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  modal: {
    width: '100%',
    maxWidth: 600
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 28px',
    borderBottom: '1px solid #1f1f23'
  },
  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: '#fafafa'
  },
  closeBtn: {
    width: 40,
    height: 40,
    background: 'rgba(255, 255, 255, 0.05)',
    border: 'none',
    borderRadius: 10,
    color: '#71717a',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  form: {
    padding: 28
  },
  error: {
    padding: '14px 18px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: 12,
    color: '#f87171',
    fontSize: 14,
    marginBottom: 20
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    marginBottom: 20
  },
  field: {
    marginBottom: 0
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 500,
    color: '#a1a1aa',
    marginBottom: 8
  },
  labelHint: {
    color: '#52525b',
    fontWeight: 400,
    marginLeft: 8
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    background: '#18181b',
    border: '1px solid #27272a',
    borderRadius: 12,
    color: '#fafafa',
    fontSize: 14
  },
  select: {
    width: '100%',
    padding: '14px 16px',
    background: '#18181b',
    border: '1px solid #27272a',
    borderRadius: 12,
    color: '#fafafa',
    fontSize: 14,
    cursor: 'pointer'
  },
  textarea: {
    width: '100%',
    padding: '14px 16px',
    background: '#18181b',
    border: '1px solid #27272a',
    borderRadius: 12,
    color: '#fafafa',
    fontSize: 14,
    fontFamily: 'inherit',
    resize: 'vertical',
    minHeight: 120
  },
  actions: {
    display: 'flex',
    gap: 12,
    marginTop: 28,
    paddingTop: 20,
    borderTop: '1px solid #1f1f23'
  },
  cancelBtn: {
    flex: 1,
    padding: '16px',
    background: '#27272a',
    border: 'none',
    borderRadius: 12,
    color: '#a1a1aa',
    fontSize: 15,
    fontWeight: 500,
    cursor: 'pointer'
  },
  submitBtn: {
    flex: 1,
    padding: '16px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    border: 'none',
    borderRadius: 12,
    color: 'white',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer'
  }
};

export default AddJobModal;
