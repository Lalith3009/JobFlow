import React from 'react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ user, onShowResume, hasResume }) => {
  const { signOut } = useAuth();

  return (
    <aside style={styles.sidebar}>
      {/* Logo */}
      <div style={styles.logoSection}>
        <div style={styles.logo}>JF</div>
        <div style={styles.logoText}>
          <h1 style={styles.logoTitle}>JobFlow</h1>
          <span style={styles.logoSubtitle}>AI-Powered</span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navSection}>
          <span style={styles.navLabel}>WORKSPACE</span>
          <button style={{...styles.navItem, ...styles.navItemActive}}>
            <span style={styles.navIcon}>📋</span>
            Job Board
          </button>
        </div>

        <div style={styles.navSection}>
          <span style={styles.navLabel}>TOOLS</span>
          <button 
            style={styles.navItem}
            onClick={onShowResume}
          >
            <span style={styles.navIcon}>📄</span>
            My Resume
            {hasResume && <span style={styles.badge}>✓</span>}
          </button>
        </div>
      </nav>

      {/* User Section */}
      <div style={styles.userSection}>
        <div style={styles.userCard}>
          {user?.user_metadata?.avatar_url ? (
            <img 
              src={user.user_metadata.avatar_url} 
              alt=""
              style={styles.avatar}
            />
          ) : (
            <div style={styles.avatarPlaceholder}>
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          )}
          <div style={styles.userInfo}>
            <span style={styles.userName}>
              {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}
            </span>
            <span style={styles.userEmail}>
              {user?.email?.substring(0, 22)}
            </span>
          </div>
        </div>
        <button 
          style={styles.signOutBtn}
          onClick={signOut}
          title="Sign Out"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: 280,
    minWidth: 280,
    background: 'linear-gradient(180deg, #0c0c0f 0%, #09090b 100%)',
    borderRight: '1px solid #1f1f23',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px'
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '0 12px 28px',
    borderBottom: '1px solid #1f1f23',
    marginBottom: 24
  },
  logo: {
    width: 52,
    height: 52,
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    fontWeight: 800,
    color: 'white',
    boxShadow: '0 8px 30px rgba(99, 102, 241, 0.3)'
  },
  logoText: {},
  logoTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: '#fafafa',
    margin: 0,
    letterSpacing: '-0.5px'
  },
  logoSubtitle: {
    fontSize: 11,
    color: '#6366f1',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontWeight: 600
  },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 24
  },
  navSection: {},
  navLabel: {
    display: 'block',
    padding: '0 16px 10px',
    fontSize: 11,
    fontWeight: 600,
    color: '#52525b',
    letterSpacing: 1
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    padding: '14px 16px',
    background: 'transparent',
    border: 'none',
    borderRadius: 12,
    color: '#71717a',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.15s'
  },
  navItemActive: {
    background: 'rgba(99, 102, 241, 0.1)',
    color: '#a78bfa'
  },
  navIcon: {
    fontSize: 20
  },
  badge: {
    marginLeft: 'auto',
    background: '#10b981',
    color: 'white',
    fontSize: 10,
    padding: '2px 6px',
    borderRadius: 4,
    fontWeight: 600
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '20px 0 0',
    borderTop: '1px solid #1f1f23'
  },
  userCard: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    background: '#111114',
    borderRadius: 14,
    border: '1px solid #1f1f23'
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    objectFit: 'cover'
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontWeight: 600,
    color: 'white'
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column'
  },
  userName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#e4e4e7'
  },
  userEmail: {
    fontSize: 11,
    color: '#52525b',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  signOutBtn: {
    width: 44,
    height: 44,
    background: '#111114',
    border: '1px solid #1f1f23',
    borderRadius: 12,
    color: '#71717a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.15s'
  }
};

export default Sidebar;
