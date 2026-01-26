import React from 'react';
import './SubmissionsTable.css';

const SubmissionsTable = ({ submissions, onView, onApprove, onReject, isLoading, approvingId, rejectingId }) => {
  if (isLoading) return <div className="submissions-cards-loading"><div className="loading-spinner"></div><p>Loading...</p></div>;
  if (!submissions || submissions.length === 0) return <div className="submissions-cards-empty"><p>No pending submissions</p></div>;

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A';
  const getStatusClass = (status) => { const s = status?.toLowerCase(); if (s === 'approved' || s === 'active') return 'status-approved'; if (s === 'rejected') return 'status-rejected'; return 'status-pending'; };
  const getPreviewImage = (s) => { if (s.image) return s.image.split(',')[0].trim(); if (s.logo) return s.logo; return null; };

  return (
    <div className="submissions-cards-container">
      {submissions.map((s) => (
        <div key={`${s.submissionType}-${s.id}`} className="submission-card">
          <div className="submission-card-image-wrapper">
            {getPreviewImage(s) ? (
              <img src={getPreviewImage(s)} alt={s.name} className="submission-card-image" onError={(e) => { e.target.src = 'https://via.placeholder.com/400x200'; }} />
            ) : (
              <div className="submission-card-image-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
            )}
            <div className="submission-card-badges">
              <span className={`type-badge type-${s.type?.toLowerCase() || 'default'}`}>{s.type || 'Unknown'}</span>
              <span className={`status-badge ${getStatusClass(s.status)}`}>{s.status || 'PENDING'}</span>
            </div>
          </div>

          <div className="submission-card-content">
            <div className="submission-card-header">
              <h3 className="submission-card-name">{s.name}</h3>
              <span className="submission-card-id">ID: #{s.id}</span>
            </div>

            <p className="submission-card-description">
              {s.description ? (s.description.length > 120 ? `${s.description.substring(0, 120)}...` : s.description) : 'No description available'}
            </p>

            <div className="submission-card-info">
              <div className="info-row">
                <span className="info-icon">👤</span>
                <div className="info-content">
                  <span className="info-label">Submitted By</span>
                  <span className="info-value">{s.user?.name || 'Unknown'}</span>
                </div>
              </div>
              <div className="info-row">
                <span className="info-icon">📧</span>
                <div className="info-content">
                  <span className="info-label">Email</span>
                  <span className="info-value">{s.user?.email || 'N/A'}</span>
                </div>
              </div>
              <div className="info-row">
                <span className="info-icon">📅</span>
                <div className="info-content">
                  <span className="info-label">Submitted</span>
                  <span className="info-value">{formatDate(s.submittedDate || s.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="submission-card-actions">
            <button className="btn-view" onClick={() => onView(s)} title="View">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M1.33334 8C1.33334 8 3.33334 3.33334 8 3.33334C12.6667 3.33334 14.6667 8 14.6667 8C14.6667 8 12.6667 12.6667 8 12.6667C3.33334 12.6667 1.33334 8 1.33334 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span>View</span>
            </button>
            <button className="btn-approve" onClick={() => onApprove(s)} disabled={approvingId === s.id || s.status === 'APPROVED'} title="Approve">
              {approvingId === s.id ? (
                <div className="btn-spinner"></div>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M13.3333 4L6 11.3333L2.66667 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span>Approve</span>
                </>
              )}
            </button>
            <button className="btn-reject" onClick={() => onReject(s)} disabled={rejectingId === s.id || s.status === 'REJECTED'} title="Reject">
              {rejectingId === s.id ? (
                <div className="btn-spinner"></div>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <span>Reject</span>
                </>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubmissionsTable;
