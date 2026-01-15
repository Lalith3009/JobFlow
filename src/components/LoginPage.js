import React, { useState } from 'react';
import { signInWithGoogle } from '../lib/supabase';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.bgGradient1}></div>
      <div style={styles.bgGradient2}></div>
      
      <div style={styles.card}>
        <div style={styles.logoWrapper}>
          <div style={styles.logo}>JF</div>
        </div>
        
        {/* Title */}
        <h1 style={styles.title}>JobFlow</h1>
        <p style={styles.subtitle}>AI-Powered Job Application Tracker</p>

        {/* Features */}
        <div style={styles.features}>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>📋</span>
            <div>
              <strong>Kanban Board</strong>
              <p>Organize applications with drag & drop</p>
            </div>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>🤖</span>
            <div>
              <strong>Claude AI Analysis</strong>
              <p>Get personalized match insights</p>
            </div>
          </div>
          <div style={styles.feature}>
            <span style={styles.featureIcon}>📄</span>
            <div>
              <strong>Resume Matching</strong>
              <p>Upload your resume for better analysis</p>
            </div>
          </div>
        </div>

        <button 
          style={styles.googleBtn}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <span style={styles.btnLoading}>Connecting...</span>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 18 18" style={styles.googleIcon}>
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18Z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17Z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07Z"/>
                <path fill="#EA4335" d="M8.98 3.58c1.16 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.9Z"/>
              </svg>
              Continue with Google
            </>
          )}
        </button>

        <p style={styles.terms}>
          By signing in, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#09090b',
    padding: 20,
    position: 'relative',
    overflow: 'hidden'
  },
  bgGradient1: {
    position: 'absolute',
    top: '-50%',
    left: '-20%',
    width: '60%',
    height: '100%',
    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 60%)',
    pointerEvents: 'none'
  },
  bgGradient2: {
    position: 'absolute',
    bottom: '-30%',
    right: '-10%',
    width: '50%',
    height: '80%',
    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 60%)',
    pointerEvents: 'none'
  },
  card: {
    background: 'linear-gradient(135deg, #111114 0%, #0f0f12 100%)',
    borderRadius: 28,
    padding: '48px 44px',
    textAlign: 'center',
    border: '1px solid #1f1f23',
    maxWidth: 420,
    width: '100%',
    position: 'relative',
    boxShadow: '0 25px 100px rgba(0, 0, 0, 0.4)'
  },
  logoWrapper: {
    marginBottom: 24
  },
  logo: {
    width: 80,
    height: 80,
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    borderRadius: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    fontSize: 32,
    fontWeight: 800,
    color: 'white',
    boxShadow: '0 10px 40px rgba(99, 102, 241, 0.35)'
  },
  title: {
    fontSize: 36,
    fontWeight: 800,
    color: '#fafafa',
    margin: '0 0 8px',
    letterSpacing: '-1px'
  },
  subtitle: {
    fontSize: 16,
    color: '#71717a',
    margin: '0 0 36px'
  },
  features: {
    textAlign: 'left',
    marginBottom: 36
  },
  feature: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    padding: '14px 18px',
    background: '#18181b',
    borderRadius: 14,
    marginBottom: 10,
    border: '1px solid #27272a'
  },
  featureIcon: {
    fontSize: 24,
    lineHeight: 1
  },
  googleBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    width: '100%',
    padding: '18px 24px',
    background: '#fafafa',
    border: 'none',
    borderRadius: 16,
    fontSize: 16,
    fontWeight: 600,
    color: '#18181b',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  googleIcon: {
    flexShrink: 0
  },
  btnLoading: {
    color: '#71717a'
  },
  terms: {
    marginTop: 20,
    fontSize: 12,
    color: '#52525b'
  }
};

export default LoginPage;
