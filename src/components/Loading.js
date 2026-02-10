import React from 'react';
import { S } from '../styles/styles';

export function Loading() {
  return (
    <div style={S.center}>
      <div style={S.loadBox}>
        <div style={S.logo}>JF</div>
        <div style={S.spinner} />
        <p style={{ color: 'var(--text-muted)', marginTop: 24, fontSize: 14, letterSpacing: '0.02em' }}>INITIALIZING...</p>
      </div>
    </div>
  );
}
