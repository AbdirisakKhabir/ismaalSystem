import React from 'react';
import './DeleteConfirmModal.css';

const DeleteConfirmModal = ({ business, isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="delete-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-header">
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
                d="M16 16L32 32M32 16L16 32"
                stroke="#ef4444"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2>Delete Business</h2>
        </div>

        <div className="delete-modal-body">
          <p>
            Are you sure you want to delete{' '}
            <strong>{business?.name || 'this business'}</strong>? This action
            cannot be undone.
          </p>
          {business && (
            <div className="business-preview">
              <div className="preview-item">
                <span className="preview-label">Category:</span>
                <span className="preview-value">{business.category}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Location:</span>
                <span className="preview-value">{business.location}</span>
              </div>
            </div>
          )}
        </div>

        <div className="delete-modal-footer">
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
              'Delete Business'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
