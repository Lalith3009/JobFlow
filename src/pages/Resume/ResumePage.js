import React, { useState, useEffect, useRef } from 'react';
import { S } from '../../styles/styles';
import { useResume } from '../../context/ResumeContext';

export function ResumePage({ onToast }) {
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
      if (onToast) onToast('Resume saved successfully');
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
      if (onToast) onToast('File processed successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={S.page} className="page-transition">
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
              ...(saved ? { background: 'var(--success)', boxShadow: 'none' } : {}),
              ...((!displayText || displayText.trim().length < 50) ? { opacity: 0.5, cursor: 'not-allowed' } : {})
            }}
            onClick={handleSave}
            disabled={!displayText || displayText.trim().length < 50}
          >
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </header>

      <div style={S.resumeContent}>
        <div style={{ maxWidth: 800, margin: '0 auto', width: '100%' }}>
          <div
            style={{
              ...S.uploadZone,
              borderColor: dragging ? 'var(--accent)' : 'var(--border-secondary)',
              background: dragging ? 'var(--accent-muted)' : 'var(--bg-card)'
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
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-muted)' }}>
                <div style={S.spinnerSm} />
                Processing file...
              </div>
            ) : (
              <>
                <div style={S.uploadIcon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </div>
                <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  {displayFileName || 'Upload your resume'}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>
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
          <div style={{ textAlign: 'right', fontSize: 12, color: 'var(--text-dim)', marginTop: 8 }}>
            {displayText.length.toLocaleString()} characters
            {displayText.length < 50 && displayText.length > 0 && (
              <span style={{ color: 'var(--warning)', marginLeft: 8 }}>
                (minimum 50 characters required)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
