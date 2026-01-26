import React from 'react';
import './BusinessTable.css';

const BusinessTable = ({ businesses, onEdit, onDelete, isLoading }) => {
  if (isLoading) return <div className="business-table-loading"><div className="loading-spinner"></div><p>Loading...</p></div>;
  if (!businesses || businesses.length === 0) return <div className="business-table-empty"><p>No businesses found</p></div>;

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A';
  const getStatusClass = (status) => { const s = status?.toUpperCase(); if (s === 'APPROVED' || s === 'ACTIVE') return 'status-approved'; if (s === 'REJECTED') return 'status-rejected'; return 'status-pending'; };
  const getImageUrl = (image) => { if (!image) return null; if (typeof image === 'string' && image.includes(',')) return image.split(',')[0].trim(); return image; };

  return (
    <div className="business-table-container">
      <table className="business-table">
        <thead><tr><th>Image</th><th>Name</th><th>Category</th><th>Email</th><th>Phone</th><th>Location</th><th>Status</th><th>Created</th><th>Actions</th></tr></thead>
        <tbody>
          {businesses.map((business) => (
            <tr key={business.id}>
              <td>{getImageUrl(business.image) ? <img src={getImageUrl(business.image)} alt={business.name} className="business-image" onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }} /> : <div className="business-image-placeholder">No Image</div>}</td>
              <td><div className="business-name">{business.name}</div><div className="business-id">ID: #{business.id}</div></td>
              <td><span className="category-badge">{business.category || 'N/A'}</span></td>
              <td>{business.email || 'N/A'}</td>
              <td>{business.phone || 'N/A'}</td>
              <td>{business.location || 'N/A'}</td>
              <td><span className={`status-badge ${getStatusClass(business.status)}`}>{business.status || 'PENDING'}</span></td>
              <td>{formatDate(business.createdAt || business.submittedDate)}</td>
              <td className="actions-cell">
                <div className="action-buttons">
                  <button className="btn-edit" onClick={() => onEdit(business)} title="Edit">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M11.3333 2.00001C11.5084 1.82491 11.7163 1.68602 11.9441 1.59231C12.1719 1.4986 12.4151 1.45178 12.6667 1.45178C12.9182 1.45178 13.1614 1.4986 13.3892 1.59231C13.617 1.68602 13.8249 1.82491 14 2.00001C14.1751 2.1751 14.314 2.383 14.4077 2.61081C14.5014 2.83862 14.5482 3.08183 14.5482 3.33334C14.5482 3.58485 14.5014 3.82807 14.4077 4.05588C14.314 4.28369 14.1751 4.49159 14 4.66668L5.00001 13.6667L1.33334 14.6667L2.33334 11L11.3333 2.00001Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button className="btn-delete" onClick={() => onDelete(business)} title="Delete">
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

export default BusinessTable;
