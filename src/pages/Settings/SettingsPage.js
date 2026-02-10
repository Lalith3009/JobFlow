import React, { useState, useEffect } from 'react';
import { S } from '../../styles/styles';
import { useJobs } from '../../context/JobsContext';

export function SettingsPage({ user, onToast }) {
  const { jobs } = useJobs();
  const [defaultStatus, setDefaultStatus] = useState(() => {
    return localStorage.getItem('jf_default_status') || 'wishlist';
  });

  useEffect(() => {
    localStorage.setItem('jf_default_status', defaultStatus);
  }, [defaultStatus]);

  const handleExportJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      totalJobs: jobs.length,
      jobs: jobs.map(j => ({
        title: j.title,
        company: j.company,
        location: j.location,
        status: j.status,
        url: j.url,
        salary: j.salary,
        created_at: j.created_at,
      })),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jobflow-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    if (onToast) onToast('JSON exported successfully');
  };

  const handleExportCSV = () => {
    const headers = ['Title', 'Company', 'Location', 'Status', 'URL', 'Salary', 'Date Added'];
    const rows = jobs.map(j => [
      j.title || '', j.company || '', j.location || '', j.status || '',
      j.url || '', j.salary || '', j.created_at ? new Date(j.created_at).toLocaleDateString() : '',
    ]);
    const csvContent = [headers, ...rows].map(r => r.map(c => `"${(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jobflow-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    if (onToast) onToast('CSV exported successfully');
  };

  return (
    <div style={S.page} className="page-transition">
      <header style={S.header}>
        <div>
          <h1 style={S.title}>Settings</h1>
          <p style={S.subtitle}>Manage preferences and integrations</p>
        </div>
      </header>
      <div style={S.settingsContent}>
        <div style={{ maxWidth: 700, margin: '0 auto', width: '100%' }}>
          <div style={S.settingsCard}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, color: 'var(--text-primary)' }}>Account Information</h3>
            {[['Email', user?.email], ['Name', user?.user_metadata?.full_name || 'Not set']].map(([label, value], i) => (
              <div key={i} style={S.settingsRow}>
                <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={S.settingsCard}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, color: 'var(--text-primary)' }}>Preferences</h3>
            <div style={S.settingsRow}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Default Status for New Jobs</span>
                <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>New jobs will be added to this column</div>
              </div>
              <div style={{ position: 'relative' }}>
                <select
                  style={{
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    width: 170,
                    padding: '10px 36px 10px 14px',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-secondary)',
                    borderRadius: 10,
                    color: 'var(--text-primary)',
                    fontSize: 14,
                    fontWeight: 500,
                    fontFamily: 'inherit',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                  }}
                  value={defaultStatus}
                  onChange={(e) => setDefaultStatus(e.target.value)}
                >
                  <option value="wishlist">Wishlist</option>
                  <option value="applied">Applied</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                </select>
                <span style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: 'var(--text-muted)',
                  fontSize: 12,
                }}>▼</span>
              </div>
            </div>
          </div>

          <div style={S.settingsCard}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, color: 'var(--text-primary)' }}>Data</h3>
            <div style={S.settingsRow}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Export as JSON</span>
                <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>Full data with all fields, machine-readable</div>
              </div>
              <button style={S.secBtn} onClick={handleExportJSON} aria-label="Export data as JSON">
                Export JSON
              </button>
            </div>
            <div style={{ ...S.settingsRow, borderBottom: 'none' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Export as CSV</span>
                <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>Spreadsheet-friendly, opens in Excel/Sheets</div>
              </div>
              <button style={S.secBtn} onClick={handleExportCSV} aria-label="Export data as CSV">
                Export CSV
              </button>
            </div>
          </div>

          <div style={S.settingsCard}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, color: 'var(--text-primary)' }}>About</h3>
            <div style={{ ...S.settingsRow, borderBottom: 'none' }}>
              <span style={{ color: 'var(--text-muted)' }}>JobFlow</span>
              <span style={{ color: 'var(--text-dim)', fontSize: 13 }}>v2.0 PRO</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
