import React from 'react';
import { useJobs } from '../context/JobsContext';

const StatsBar = () => {
  const { getStats } = useJobs();
  const stats = getStats();

  const items = [
    { label: 'Total', value: stats.total, color: '#fafafa' },
    { label: 'Wishlist', value: stats.wishlist, color: '#a78bfa' },
    { label: 'Applied', value: stats.applied, color: '#60a5fa' },
    { label: 'Interview', value: stats.interview, color: '#fbbf24' },
    { label: 'Offers', value: stats.offer, color: '#34d399' },
  ];

  return (
    <div style={styles.container}>
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          {index === 1 && <div style={styles.divider} />}
          <div style={styles.stat}>
            <span style={{...styles.value, color: item.color}}>
              {item.value}
            </span>
            <span style={styles.label}>{item.label}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '16px 28px',
    borderBottom: '1px solid #1f1f23',
    background: '#0c0c0f',
    overflowX: 'auto'
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 18px',
    background: '#111114',
    borderRadius: 12,
    border: '1px solid #1f1f23'
  },
  value: {
    fontSize: 24,
    fontWeight: 700
  },
  label: {
    fontSize: 12,
    color: '#71717a',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: 500
  },
  divider: {
    width: 1,
    height: 40,
    background: '#27272a'
  }
};

export default StatsBar;
