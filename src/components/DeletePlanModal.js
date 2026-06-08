import React from 'react';
import './DeletePlanModal.css';

const DeletePlanModal = ({ plan, isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  // Format price
  const formatPrice = (price) => {
    if (price === 0) return 'Free';
    return `$${parseFloat(price).toFixed(2)}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="delete-plan-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="delete-plan-modal-header">
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
          <h2>Delete Plan</h2>
        </div>

        <div className="delete-plan-modal-body">
          <p>
            Are you sure you want to delete the{' '}
            <strong>{plan?.name || 'this plan'}</strong>? 
            {plan?.users?.length > 0 && (
              <span className="warning-text">
                {' '}This plan has {plan.users.length} active user(s).
              </span>
            )}
          </p>
          {plan && (
            <div className="plan-preview">
              <div className="preview-item">
                <span className="preview-label">Price:</span>
                <span className="preview-value">{formatPrice(plan.price)}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Businesses:</span>
                <span className="preview-value">{plan.allowedBusinesses}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Products:</span>
                <span className="preview-value">{plan.allowedProducts}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Users:</span>
                <span className="preview-value">{plan.users?.length || 0}</span>
              </div>
            </div>
          )}
        </div>

        <div className="delete-plan-modal-footer">
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
              'Delete Plan'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePlanModal;
