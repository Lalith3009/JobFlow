import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobsContext';
import { useResume } from '../context/ResumeContext';
import Sidebar from './Sidebar';
import Header from './Header';
import StatsBar from './StatsBar';
import KanbanBoard from './KanbanBoard';
import AddJobModal from './AddJobModal';
import AIAnalysisModal from './AIAnalysisModal';
import ResumeModal from './ResumeModal';

const Dashboard = () => {
  const { user } = useAuth();
  const { jobs, loading } = useJobs();
  const { resumeText, hasResume } = useResume();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [analysisJob, setAnalysisJob] = useState(null);

  const handleAnalyze = (job) => {
    setAnalysisJob(job);
  };

  return (
    <div style={styles.container}>
      <Sidebar 
        user={user}
        onShowResume={() => setShowResumeModal(true)}
        hasResume={hasResume}
      />

      <main style={styles.main}>
        <Header onAddJob={() => setShowAddModal(true)} />

        <StatsBar />
        {!hasResume && (
          <div style={styles.resumeBanner}>
            <span style={styles.resumeBannerIcon}>📄</span>
            <div style={styles.resumeBannerText}>
              <strong>Upload your resume for better AI analysis</strong>
              <p>Get personalized match scores and recommendations</p>
            </div>
            <button 
              style={styles.resumeBannerBtn}
              onClick={() => setShowResumeModal(true)}
            >
              Upload Resume
            </button>
          </div>
        )}

        {/* Kanban Board */}
        <div style={styles.boardContainer}>
          {loading ? (
            <div style={styles.loading}>
              <div className="spinner"></div>
              <p>Loading your jobs...</p>
            </div>
          ) : (
            <KanbanBoard 
              jobs={jobs}
              onAnalyze={handleAnalyze}
            />
          )}
        </div>
      </main>

      {showAddModal && (
        <AddJobModal onClose={() => setShowAddModal(false)} />
      )}

      {showResumeModal && (
        <ResumeModal onClose={() => setShowResumeModal(false)} />
      )}

      {analysisJob && (
        <AIAnalysisModal
          job={analysisJob}
          resumeText={resumeText}
          onClose={() => setAnalysisJob(null)}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: '#09090b'
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    minWidth: 0
  },
  boardContainer: {
    flex: 1,
    padding: '20px 28px',
    overflowX: 'auto',
    overflowY: 'auto'
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 100,
    color: '#71717a'
  },
  resumeBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    margin: '0 28px',
    padding: '16px 20px',
    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
    borderRadius: 14,
    border: '1px solid rgba(99, 102, 241, 0.2)'
  },
  resumeBannerIcon: {
    fontSize: 28
  },
  resumeBannerText: {
    flex: 1
  },
  resumeBannerBtn: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    border: 'none',
    borderRadius: 10,
    color: 'white',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer'
  }
};

export default Dashboard;
