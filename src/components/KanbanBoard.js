import React, { useState } from 'react';
import { useJobs } from '../context/JobsContext';
import JobCard from './JobCard';

const COLUMNS = [
  { id: 'wishlist', title: 'Wishlist', emoji: '💜', color: '#8b5cf6' },
  { id: 'applied', title: 'Applied', emoji: '💙', color: '#3b82f6' },
  { id: 'interview', title: 'Interview', emoji: '💛', color: '#f59e0b' },
  { id: 'offer', title: 'Offers', emoji: '💚', color: '#10b981' },
  { id: 'rejected', title: 'Rejected', emoji: '💔', color: '#ef4444' }
];

const KanbanBoard = ({ jobs, onAnalyze }) => {
  const { updateJob } = useJobs();
  const [draggedJob, setDraggedJob] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);

  const getColumnJobs = (columnId) => {
    return jobs.filter(job => job.status === columnId);
  };

  const handleDragStart = (e, job) => {
    setDraggedJob(job);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', job.id);
    
    // Visual feedback
    requestAnimationFrame(() => {
      e.target.style.opacity = '0.4';
    });
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedJob(null);
    setDropTarget(null);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (dropTarget !== columnId) {
      setDropTarget(columnId);
    }
  };

  const handleDragLeave = (e, columnId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      if (dropTarget === columnId) {
        setDropTarget(null);
      }
    }
  };

  const handleDrop = async (e, columnId) => {
    e.preventDefault();
    setDropTarget(null);
    
    if (draggedJob && draggedJob.status !== columnId) {
      try {
        await updateJob(draggedJob.id, { status: columnId });
      } catch (err) {
        console.error('Failed to update job:', err);
      }
    }
    
    setDraggedJob(null);
  };

  return (
    <div style={styles.board}>
      {COLUMNS.map(column => {
        const columnJobs = getColumnJobs(column.id);
        const isDropTarget = dropTarget === column.id;
        
        return (
          <div
            key={column.id}
            style={{
              ...styles.column,
              borderColor: isDropTarget ? column.color : '#1f1f23',
              background: isDropTarget 
                ? `linear-gradient(180deg, ${column.color}08 0%, transparent 100%)`
                : '#0f0f12'
            }}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={(e) => handleDragLeave(e, column.id)}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div style={styles.columnHeader}>
              <div style={styles.columnTitle}>
                <span style={styles.emoji}>{column.emoji}</span>
                <h3 style={styles.columnName}>{column.title}</h3>
              </div>
              <span style={{
                ...styles.count,
                background: `${column.color}20`,
                color: column.color
              }}>
                {columnJobs.length}
              </span>
            </div>

            <div style={styles.columnBody}>
              {columnJobs.length === 0 ? (
                <div style={styles.empty}>
                  <span style={styles.emptyEmoji}>{column.emoji}</span>
                  <p style={styles.emptyText}>
                    {isDropTarget ? 'Drop here!' : 'No jobs yet'}
                  </p>
                  <p style={styles.emptyHint}>Drag jobs here to organize</p>
                </div>
              ) : (
                columnJobs.map(job => (
                  <div
                    key={job.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, job)}
                    onDragEnd={handleDragEnd}
                    style={styles.cardWrapper}
                  >
                    <JobCard
                      job={job}
                      onAnalyze={() => onAnalyze(job)}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  board: {
    display: 'flex',
    gap: 20,
    minHeight: 'calc(100vh - 260px)',
    paddingBottom: 20
  },
  column: {
    flex: '0 0 340px',
    width: 340,
    borderRadius: 20,
    border: '2px solid #1f1f23',
    display: 'flex',
    flexDirection: 'column',
    transition: 'all 0.2s ease',
    overflow: 'hidden'
  },
  columnHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 20px',
    background: '#0a0a0d',
    borderBottom: '1px solid #1f1f23'
  },
  columnTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 12
  },
  emoji: {
    fontSize: 24
  },
  columnName: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
    color: '#e4e4e7'
  },
  count: {
    padding: '6px 14px',
    borderRadius: 20,
    fontSize: 14,
    fontWeight: 600
  },
  columnBody: {
    flex: 1,
    padding: 14,
    overflowY: 'auto',
    minHeight: 300
  },
  cardWrapper: {
    marginBottom: 14,
    cursor: 'grab'
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    textAlign: 'center'
  },
  emptyEmoji: {
    fontSize: 48,
    opacity: 0.15,
    marginBottom: 16
  },
  emptyText: {
    margin: 0,
    fontSize: 15,
    fontWeight: 500,
    color: '#52525b'
  },
  emptyHint: {
    margin: '6px 0 0',
    fontSize: 13,
    color: '#3f3f46'
  }
};

export default KanbanBoard;
