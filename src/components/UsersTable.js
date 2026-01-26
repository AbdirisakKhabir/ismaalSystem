import React from 'react';
import './UsersTable.css';

const UsersTable = ({ users, onView, onDelete, isLoading }) => {
  if (isLoading) return <div className="users-table-loading"><div className="loading-spinner"></div><p>Loading users...</p></div>;
  if (!users || users.length === 0) return <div className="users-table-empty"><p>No users found</p></div>;

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
  const getInitials = (name) => { if (!name) return 'U'; const parts = name.split(' '); return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase(); };

  return (
    <div className="users-table-container">
      <table className="users-table">
        <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Plan</th><th>Businesses</th><th>Products</th><th>Joined</th><th>Actions</th></tr></thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="user-cell">
                <div className="user-info">
                  <div className="user-avatar">{getInitials(user.name)}</div>
                  <div className="user-details"><span className="user-name">{user.name || 'Unknown'}</span><span className="user-id">ID: #{user.id}</span></div>
                </div>
              </td>
              <td><a href={`mailto:${user.email}`} className="email-link">{user.email || 'No email'}</a></td>
              <td><span className={`role-badge ${user.role?.toLowerCase() || 'user'}`}>{user.role || 'USER'}</span></td>
              <td><span className="plan-badge">{user.plan?.name || 'Free'}</span></td>
              <td>{user.businesses?.length || user._count?.businesses || 0}</td>
              <td>{user.products?.length || user._count?.products || 0}</td>
              <td>{formatDate(user.createdAt)}</td>
              <td className="actions-cell">
                <div className="action-buttons">
                  <button className="btn-view" onClick={() => onView(user)} title="View">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.33334 8C1.33334 8 3.33334 3.33334 8 3.33334C12.6667 3.33334 14.6667 8 14.6667 8C14.6667 8 12.6667 12.6667 8 12.6667C3.33334 12.6667 1.33334 8 1.33334 8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button className="btn-delete" onClick={() => onDelete(user)} title="Delete">
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

export default UsersTable;
