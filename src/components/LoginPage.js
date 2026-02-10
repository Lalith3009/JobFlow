import React from 'react';
import { S } from '../styles/styles';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { signIn } = useAuth();
  return (
    <div style={S.center}>
      <div style={S.glow} />
      <div style={S.loginCard}>
        <div style={S.logo}>JF</div>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>JobFlow</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 8, marginBottom: 40, fontSize: 16 }}>The intelligent workspace for your job search.</p>
        <button style={S.googleBtn} onClick={signIn} aria-label="Sign in with Google">
          <svg width="20" height="20" viewBox="0 0 18 18"><path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/><path fill="#EA4335" d="M8.98 3.58c1.16 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.9z"/></svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
