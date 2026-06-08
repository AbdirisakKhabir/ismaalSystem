import React from 'react';
import './ProfessionalsTable.css';

const ProfessionalsTable = ({ professionals, onView, onDelete, isLoading }) => {
  if (isLoading) return <div className="professionals-table-loading"><div className="loading-spinner"></div><p>Loading...</p></div>;
  if (!professionals || professionals.length === 0) return <div className="professionals-table-empty"><p>No professionals found</p></div>;

  const getStatusClass = (status) => {
    switch (status) { case 'APPROVED': return 'status-approved'; case 'PENDING': return 'status-pending'; case 'REJECTED': return 'status-rejected'; default: return 'status-default'; }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
  const getImageUrl = (image) => { if (!image) return null; return typeof image === 'string' && image.includes(',') ? image.split(',')[0].trim() : image; };

  return (
    <div className="professionals-table-container">
      <table className="professionals-table">
        <thead><tr><th>Image</th><th>Profession</th><th>Specialty</th><th>Experience</th><th>Email</th><th>Phone</th><th>Location</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
        <tbody>
          {professionals.map((p) => (
            <tr key={p.id}>
              <td>{getImageUrl(p.image) ? <img src={getImageUrl(p.image)} alt="" className="professional-image" /> : <div className="professional-image-placeholder">N/A</div>}</td>
              <td>{Array.isArray(p.profession) ? p.profession.slice(0, 2).join(', ') : p.profession || 'N/A'}</td>
              <td>{p.specialty || 'N/A'}</td>
              <td>{p.experience || 'N/A'}</td>
              <td>{p.email || 'N/A'}</td>
              <td>{p.phone || 'N/A'}</td>
              <td>{p.location || 'N/A'}</td>
              <td><span className={`status-badge ${getStatusClass(p.status)}`}>{p.status || 'N/A'}</span></td>
              <td>{formatDate(p.createdAt)}</td>
              <td className="actions-cell">
                <div className="action-buttons">
                  <button className="btn-view" onClick={() => onView(p)} title="View">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.33334 8C1.33334 8 3.33334 3.33334 8 3.33334C12.6667 3.33334 14.6667 8 14.6667 8C14.6667 8 12.6667 12.6667 8 12.6667C3.33334 12.6667 1.33334 8 1.33334 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button className="btn-delete" onClick={() => onDelete(p)} title="Delete">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4H14M12.6667 4V13.3333C12.6667 13.687 12.5262 14.0261 12.2761 14.2761C12.0261 14.5262 11.687 14.6667 11.3333 14.6667H4.66667C4.31305 14.6667 3.97391 14.5262 3.72386 14.2761C3.47381 14.0261 3.33333 13.687 3.33333 13.3333V4M5.33333 4V2.66667C5.33333 2.31305 5.47381 1.97391 5.72386 1.72386C5.97391 1.47381 6.31305 1.33333 6.66667 1.33333H9.33333C9.68696 1.33333 10.0261 1.47381 10.2761 1.72386C10.5262 1.97391 10.6667 2.31305 10.6667 2.66667V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfessionalsTable;
