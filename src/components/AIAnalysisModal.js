import React, { useEffect, useState } from 'react';
import { analyzeJobWithClaude, localAnalysis } from '../lib/claude';
import { useResume } from '../context/ResumeContext';

const AIAnalysisModal = ({ job, onClose }) => {
  const { resumeText, resumeFileName } = useResume();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!resumeText) {
      setLoading(false);
      return;
    }

    const run = async () => {
      try {
        const result = await analyzeJobWithClaude(job, resumeText);
        setAnalysis(result);
      } catch {
        setAnalysis(localAnalysis(job.description, resumeText));
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [job, resumeText]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>✨ AI Job Analysis</h2>
        <p>{job.title} at {job.company}</p>

        {resumeFileName && (
          <p style={{ fontSize: 13, color: '#10b981' }}>
            Using resume: {resumeFileName}
          </p>
        )}

        {!resumeText ? (
          <div style={{ color: '#fbbf24' }}>
            Upload your resume for personalized analysis.
          </div>
        ) : loading ? (
          <p>Analyzing…</p>
        ) : (
          <pre>{JSON.stringify(analysis, null, 2)}</pre>
        )}

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const styles = {
  modal: {
    width: '100%',
    maxWidth: 680,
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '24px 28px',
    borderBottom: '1px solid #1f1f23',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
    flexShrink: 0
  },
  title: {
    margin: 0,
    fontSize: 24,
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
    cursor: 'pointer'
  },
  content: {
    padding: 28,
    overflowY: 'auto',
    flex: 1
  },
  loading: {
    padding: '60px 20px',
    textAlign: 'center'
  },
  loadingAnimation: {
    display: 'flex',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24
  },
  loadingDot: {
    width: 12,
    height: 12,
    background: '#6366f1',
    borderRadius: '50%',
    animation: 'pulse 1s ease-in-out infinite'
  },
  loadingTitle: {
    margin: '0 0 8px',
    fontSize: 18,
    fontWeight: 600,
    color: '#fafafa'
  },
  loadingText: {
    margin: 0,
    fontSize: 14,
    color: '#71717a'
  },
  error: {
    padding: 40,
    textAlign: 'center',
    color: '#f87171'
  },
  retryBtn: {
    marginTop: 16,
    padding: '12px 24px',
    background: '#6366f1',
    border: 'none',
    borderRadius: 10,
    color: 'white',
    cursor: 'pointer'
  },
  scoreSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 28,
    padding: 28,
    background: '#16161a',
    borderRadius: 20,
    marginBottom: 24
  },
  scoreRing: {
    flexShrink: 0
  },
  scoreRingInner: {
    width: 140,
    height: 140,
    borderRadius: '50%',
    padding: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  scoreCenter: {
    width: '100%',
    height: '100%',
    background: '#16161a',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 700
  },
  scoreLabel: {
    fontSize: 12,
    color: '#71717a',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  scoreInfo: {
    flex: 1
  },
  badges: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 12
  },
  levelBadge: {
    padding: '8px 16px',
    background: 'rgba(139, 92, 246, 0.15)',
    color: '#a78bfa',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600
  },
  expBadge: {
    padding: '8px 16px',
    background: 'rgba(59, 130, 246, 0.15)',
    color: '#60a5fa',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600
  },
  salary: {
    margin: 0,
    fontSize: 15,
    color: '#a1a1aa'
  },
  summaryBox: {
    padding: 20,
    background: '#16161a',
    borderRadius: 16,
    borderLeft: '4px solid #6366f1',
    marginBottom: 24
  },
  summaryText: {
    margin: 0,
    fontSize: 15,
    color: '#d4d4d8',
    lineHeight: 1.6
  },
  skillsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    marginBottom: 24
  },
  skillsCard: {
    padding: 18,
    background: '#16161a',
    borderRadius: 16
  },
  skillsTitle: {
    margin: '0 0 14px',
    fontSize: 14,
    fontWeight: 600,
    color: '#d4d4d8',
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  checkIcon: {
    color: '#10b981'
  },
  xIcon: {
    color: '#ef4444'
  },
  skillsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8
  },
  matchedSkill: {
    padding: '6px 12px',
    background: 'rgba(16, 185, 129, 0.15)',
    color: '#34d399',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 500
  },
  missingSkill: {
    padding: '6px 12px',
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#f87171',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 500
  },
  noSkills: {
    fontSize: 13,
    color: '#52525b',
    fontStyle: 'italic'
  },
  insightsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    marginBottom: 24
  },
  insightCard: {
    padding: 18,
    background: '#16161a',
    borderRadius: 16
  },
  insightTitle: {
    margin: '0 0 12px',
    fontSize: 14,
    fontWeight: 600,
    color: '#fafafa'
  },
  insightList: {
    margin: 0,
    paddingLeft: 18,
    fontSize: 13,
    color: '#a1a1aa',
    lineHeight: 1.8
  },
  section: {
    marginBottom: 24
  },
  sectionTitle: {
    margin: '0 0 14px',
    fontSize: 15,
    fontWeight: 600,
    color: '#fafafa'
  },
  recommendationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  },
  recommendationItem: {
    display: 'flex',
    gap: 14,
    padding: '14px 18px',
    background: '#16161a',
    borderRadius: 12
  },
  recNumber: {
    width: 26,
    height: 26,
    background: 'rgba(99, 102, 241, 0.2)',
    color: '#818cf8',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 600,
    flexShrink: 0
  },
  tipsList: {
    margin: 0,
    padding: '16px 18px 16px 36px',
    background: '#16161a',
    borderRadius: 14,
    fontSize: 14,
    color: '#a1a1aa',
    lineHeight: 1.8
  },
  keywordsSection: {
    padding: 18,
    background: 'rgba(99, 102, 241, 0.08)',
    borderRadius: 16,
    border: '1px solid rgba(99, 102, 241, 0.15)',
    marginBottom: 20
  },
  keywordsTitle: {
    margin: '0 0 12px',
    fontSize: 14,
    fontWeight: 600,
    color: '#818cf8'
  },
  keywordsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8
  },
  keyword: {
    padding: '6px 12px',
    background: 'rgba(99, 102, 241, 0.15)',
    color: '#a5b4fc',
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 500
  },
  warning: {
    padding: 16,
    background: 'rgba(245, 158, 11, 0.1)',
    border: '1px solid rgba(245, 158, 11, 0.2)',
    borderRadius: 12,
    fontSize: 14,
    color: '#fbbf24',
    marginBottom: 16
  },
  localNotice: {
    padding: 14,
    background: 'rgba(99, 102, 241, 0.08)',
    borderRadius: 10,
    fontSize: 13,
    color: '#818cf8',
    textAlign: 'center'
  }
};

export default AIAnalysisModal;
