import React from 'react';
import './DeleteProfessionalModal.css';

const DeleteProfessionalModal = ({ professional, isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  // Format profession array
  const formatProfession = (profession) => {
    if (Array.isArray(profession)) {
      return profession.join(', ');
    }
    return profession || 'N/A';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="delete-professional-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="delete-professional-modal-header">
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
          <h2>Delete Professional</h2>
        </div>

        <div className="delete-professional-modal-body">
          <p>
            Are you sure you want to delete this professional profile for{' '}
            <strong>{professional?.specialty || 'this professional'}</strong>? This action
            cannot be undone.
          </p>
          {professional && (
            <div className="professional-preview">
              <div className="preview-item">
                <span className="preview-label">Profession:</span>
                <span className="preview-value">{formatProfession(professional.profession)}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Experience:</span>
                <span className="preview-value">{professional.experience || 'N/A'}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Location:</span>
                <span className="preview-value">{professional.location || 'N/A'}</span>
              </div>
            </div>
          )}
        </div>

        <div className="delete-professional-modal-footer">
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
              'Delete Professional'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProfessionalModal;
