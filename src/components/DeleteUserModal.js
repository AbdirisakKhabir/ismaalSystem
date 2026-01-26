import React from 'react';
import './DeleteUserModal.css';

const DeleteUserModal = ({ user, isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const businessCount = user?.businesses?.length || user?._count?.businesses || 0;
  const productCount = user?.products?.length || user?._count?.products || 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="delete-user-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="delete-user-modal-header">
          <div className="delete-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="24" cy="24" r="24" fill="#fee2e2" />
              <path
                d="M24 18V24M24 30H24.01M34 24C34 29.5228 29.5228 34 24 34C18.4772 34 14 29.5228 14 24C14 18.4772 18.4772 14 24 14C29.5228 14 34 18.4772 34 24Z"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2>Delete User</h2>
        </div>

        <div className="delete-user-modal-body">
          <p className="warning-text">
            Are you sure you want to delete this user? This action cannot be undone.
          </p>
          
          {user && (
            <div className="user-preview">
              <div className="user-preview-avatar">
                {getInitials(user.name)}
              </div>
              <div className="user-preview-info">
                <span className="user-preview-name">{user.name || 'Unknown'}</span>
                <span className="user-preview-email">{user.email || 'No email'}</span>
              </div>
            </div>
          )}

          {(businessCount > 0 || productCount > 0) && (
            <div className="user-data-warning">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 6.66667V10M10 13.3333H10.0083" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="warning-content">
                <strong>Warning:</strong> This user has associated data:
                <ul>
                  {businessCount > 0 && <li>{businessCount} business(es)</li>}
                  {productCount > 0 && <li>{productCount} product(s)</li>}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="delete-user-modal-footer">
          <button
            className="btn-cancel-delete"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="btn-confirm-delete"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-small"></span>
                Deleting...
              </>
            ) : (
              'Delete User'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
