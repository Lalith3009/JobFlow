import React, { useRef, useState, useEffect } from 'react';
import { useResume } from '../context/ResumeContext';

const ResumeModal = ({ onClose }) => {
  const { resumeText, resumeFileName, processFile, saveResume, clearResume, isProcessing, error } = useResume();
  const [textInput, setTextInput] = useState('');
  const [localError, setLocalError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (resumeText) {
      setTextInput(resumeText);
    }
  }, [resumeText]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalError(null);
    
    try {
      const text = await processFile(file);
      setTextInput(text);
    } catch (err) {
      setLocalError(err.message);
    }
  };

  const handleSave = () => {
    saveResume(textInput, resumeFileName || 'Manual entry');
    onClose();
  };

  const handleClear = () => {
    clearResume();
    setTextInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>📄 My Resume</h2>
            <p style={styles.subtitle}>Upload your resume for personalized AI analysis</p>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={styles.content}>
          <div style={styles.uploadSection}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt"
              style={{ display: 'none' }}
              id="resume-upload"
            />
            
            <label htmlFor="resume-upload" style={styles.uploadBox}>
              {isProcessing ? (
                <div style={styles.processingState}>
                  <div style={styles.spinner}></div>
                  <p>Processing file...</p>
                </div>
              ) : (
                <>
                  <div style={styles.uploadIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                  </div>
                  <p style={styles.uploadText}>
                    <strong>Click to upload</strong> or drag and drop
                  </p>
                  <p style={styles.uploadHint}>PDF, DOCX, or TXT (max 5MB)</p>
                </>
              )}
            </label>

            {resumeFileName && (
              <div style={styles.fileInfo}>
                <span style={styles.fileIcon}>📄</span>
                <span style={styles.fileName}>{resumeFileName}</span>
                <button style={styles.clearBtn} onClick={handleClear}>✕</button>
              </div>
            )}
          </div>

          {(localError || error) && (
            <div style={styles.error}>
              {localError || error}
            </div>
          )}

          <div style={styles.divider}>
            <span>or paste your resume text</span>
          </div>

          <div style={styles.textSection}>
            <textarea
              style={styles.textarea}
              placeholder="Paste your resume text here..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              rows={10}
            />
            <div style={styles.charCount}>
              {textInput.length.toLocaleString()} characters
            </div>
          </div>

          <div style={styles.tips}>
            <h4 style={styles.tipsTitle}>💡 Tips for better analysis</h4>
            <ul style={styles.tipsList}>
              <li>Include your skills, technologies, and tools</li>
              <li>List your work experience with accomplishments</li>
              <li>Add education and certifications</li>
              <li>More detail = better AI insights</li>
            </ul>
          </div>
        </div>

        <div style={styles.footer}>
          <button style={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button 
            style={styles.saveBtn} 
            onClick={handleSave}
            disabled={!textInput.trim()}
          >
            Save Resume
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  modal: {
    width: '100%',
    maxWidth: 640
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '24px 28px',
    borderBottom: '1px solid #1f1f23',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)'
  },
  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: '#fafafa'
  },
  subtitle: {
    margin: '6px 0 0',
    fontSize: 14,
    color: '#71717a'
  },
  closeBtn: {
    width: 40,
    height: 40,
    background: 'rgba(255, 255, 255, 0.05)',
    border: 'none',
    borderRadius: 10,
    color: '#71717a',
    fontSize: 18,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    padding: 28
  },
  uploadSection: {
    marginBottom: 20
  },
  uploadBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    background: '#16161a',
    border: '2px dashed #27272a',
    borderRadius: 16,
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  uploadIcon: {
    width: 64,
    height: 64,
    background: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6366f1',
    marginBottom: 16
  },
  uploadText: {
    margin: 0,
    fontSize: 15,
    color: '#a1a1aa'
  },
  uploadHint: {
    margin: '8px 0 0',
    fontSize: 13,
    color: '#52525b'
  },
  processingState: {
    textAlign: 'center',
    color: '#71717a'
  },
  spinner: {
    width: 32,
    height: 32,
    margin: '0 auto 12px',
    border: '3px solid #1f1f23',
    borderTopColor: '#6366f1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  fileInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    padding: '12px 16px',
    background: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    border: '1px solid rgba(16, 185, 129, 0.2)'
  },
  fileIcon: {
    fontSize: 18
  },
  fileName: {
    flex: 1,
    fontSize: 14,
    color: '#34d399',
    fontWeight: 500
  },
  clearBtn: {
    width: 28,
    height: 28,
    background: 'rgba(239, 68, 68, 0.1)',
    border: 'none',
    borderRadius: 6,
    color: '#f87171',
    fontSize: 14,
    cursor: 'pointer'
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
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    margin: '20px 0',
    color: '#52525b',
    fontSize: 13
  },
  textSection: {
    marginBottom: 20
  },
  textarea: {
    width: '100%',
    padding: 18,
    background: '#16161a',
    border: '1px solid #27272a',
    borderRadius: 14,
    color: '#e4e4e7',
    fontSize: 14,
    fontFamily: 'inherit',
    lineHeight: 1.6,
    resize: 'vertical',
    minHeight: 200
  },
  charCount: {
    marginTop: 8,
    fontSize: 12,
    color: '#52525b',
    textAlign: 'right'
  },
  tips: {
    padding: 18,
    background: 'rgba(245, 158, 11, 0.08)',
    borderRadius: 14,
    border: '1px solid rgba(245, 158, 11, 0.15)'
  },
  tipsTitle: {
    margin: '0 0 12px',
    fontSize: 14,
    fontWeight: 600,
    color: '#fbbf24'
  },
  tipsList: {
    margin: 0,
    paddingLeft: 20,
    fontSize: 13,
    color: '#a1a1aa',
    lineHeight: 1.8
  },
  footer: {
    display: 'flex',
    gap: 12,
    padding: '20px 28px',
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
  saveBtn: {
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

export default ResumeModal;