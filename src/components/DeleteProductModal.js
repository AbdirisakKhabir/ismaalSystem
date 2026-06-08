import React from 'react';
import './DeleteProductModal.css';

const DeleteProductModal = ({ product, isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  // Helper to format price
  const formatPrice = (price) => {
    return price ? `$${price}` : 'N/A';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="delete-product-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="delete-product-modal-header">
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
          <h2>Delete Product</h2>
        </div>

        <div className="delete-product-modal-body">
          <p>
            Are you sure you want to delete{' '}
            <strong>{product?.name || 'this product'}</strong>? This action
            cannot be undone.
          </p>
          {product && (
            <div className="product-preview">
              <div className="preview-item">
                <span className="preview-label">Price:</span>
                <span className="preview-value">{formatPrice(product.price)}</span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Category:</span>
                <span className="preview-value">
                  {Array.isArray(product.category) 
                    ? product.category.join(', ') 
                    : product.category || 'N/A'}
                </span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Location:</span>
                <span className="preview-value">{product.location || 'N/A'}</span>
              </div>
            </div>
          )}
        </div>

        <div className="delete-product-modal-footer">
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
              'Delete Product'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductModal;
