import React, { useState, useEffect } from 'react';
import './EditPlanModal.css';

const EditPlanModal = ({ plan, isOpen, onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    allowedBusinesses: '',
    allowedProducts: '',
    profile_status: '',
  });
  const [errors, setErrors] = useState({});

  // Populate form when plan changes
  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name || '',
        description: plan.description || '',
        price: plan.price?.toString() || '0',
        allowedBusinesses: plan.allowedBusinesses?.toString() || '0',
        allowedProducts: plan.allowedProducts?.toString() || '0',
        profile_status: plan.profile_status || 'Active',
      });
      setErrors({});
    }
  }, [plan]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Plan name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.price === '' || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      newErrors.price = 'Price must be a valid number (0 or greater)';
    }

    if (formData.allowedBusinesses === '' || isNaN(parseInt(formData.allowedBusinesses)) || parseInt(formData.allowedBusinesses) < 0) {
      newErrors.allowedBusinesses = 'Must be a valid number (0 or greater)';
    }

    if (formData.allowedProducts === '' || isNaN(parseInt(formData.allowedProducts)) || parseInt(formData.allowedProducts) < 0) {
      newErrors.allowedProducts = 'Must be a valid number (0 or greater)';
    }

    if (!formData.profile_status.trim()) {
      newErrors.profile_status = 'Profile status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const updatedData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        allowedBusinesses: parseInt(formData.allowedBusinesses),
        allowedProducts: parseInt(formData.allowedProducts),
        profile_status: formData.profile_status.trim(),
      };
      onSave(updatedData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="edit-plan-modal" onClick={(e) => e.stopPropagation()}>
        <div className="edit-plan-header">
          <h2>Edit Plan</h2>
          <button className="modal-close-btn" onClick={onClose} disabled={isLoading}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-plan-form">
          <div className="form-body">
            {/* Plan Name */}
            <div className="form-group">
              <label htmlFor="name">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 1.33334L10.06 5.50668L14.6667 6.18001L11.3333 9.42668L12.12 14.0133L8 11.8467L3.88 14.0133L4.66667 9.42668L1.33334 6.18001L5.94 5.50668L8 1.33334Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Plan Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter plan name"
                className={errors.name ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="description">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H2V14H14V2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.33334 5.33334H10.6667M5.33334 8.00001H10.6667M5.33334 10.6667H8.00001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter plan description"
                rows="3"
                className={errors.description ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            {/* Price */}
            <div className="form-group">
              <label htmlFor="price">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 0.666672V15.3333M11.3333 3.33334H6.33333C5.71449 3.33334 5.121 3.57918 4.68342 4.01676C4.24583 4.45435 4 5.04784 4 5.66668C4 6.28551 4.24583 6.87901 4.68342 7.31659C5.121 7.75418 5.71449 8.00001 6.33333 8.00001H9.66667C10.2855 8.00001 10.879 8.24584 11.3166 8.68343C11.7542 9.12101 12 9.71451 12 10.3333C12 10.9522 11.7542 11.5457 11.3166 11.9833C10.879 12.4208 10.2855 12.6667 9.66667 12.6667H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Price ($)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className={errors.price ? 'error' : ''}
                disabled={isLoading}
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>

            {/* Limits Row */}
            <div className="form-row">
              {/* Allowed Businesses */}
              <div className="form-group">
                <label htmlFor="allowedBusinesses">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.66666 14V6L8 2L13.3333 6V14H9.33332V9.33333H6.66666V14H2.66666Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Businesses Allowed
                </label>
                <input
                  type="number"
                  id="allowedBusinesses"
                  name="allowedBusinesses"
                  value={formData.allowedBusinesses}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className={errors.allowedBusinesses ? 'error' : ''}
                  disabled={isLoading}
                />
                {errors.allowedBusinesses && <span className="error-message">{errors.allowedBusinesses}</span>}
              </div>

              {/* Allowed Products */}
              <div className="form-group">
                <label htmlFor="allowedProducts">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.3333 4.66667L8 1.33334L2.66666 4.66667M13.3333 4.66667L8 8.00001M13.3333 4.66667V11.3333L8 14.6667M8 8.00001L2.66666 4.66667M8 8.00001V14.6667M2.66666 4.66667V11.3333L8 14.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Products Allowed
                </label>
                <input
                  type="number"
                  id="allowedProducts"
                  name="allowedProducts"
                  value={formData.allowedProducts}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  className={errors.allowedProducts ? 'error' : ''}
                  disabled={isLoading}
                />
                {errors.allowedProducts && <span className="error-message">{errors.allowedProducts}</span>}
              </div>
            </div>

            {/* Profile Status */}
            <div className="form-group">
              <label htmlFor="profile_status">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8.00001C14.6667 4.31811 11.6819 1.33334 8 1.33334C4.3181 1.33334 1.33334 4.31811 1.33334 8.00001C1.33334 11.6819 4.3181 14.6667 8 14.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.33334 8.00001L7.33334 10L10.6667 6.00001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Profile Status
              </label>
              <select
                id="profile_status"
                name="profile_status"
                value={formData.profile_status}
                onChange={handleChange}
                className={errors.profile_status ? 'error' : ''}
                disabled={isLoading}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Enabled">Enabled</option>
                <option value="Disabled">Disabled</option>
              </select>
              {errors.profile_status && <span className="error-message">{errors.profile_status}</span>}
            </div>
          </div>

          <div className="edit-plan-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-small"></span>
                  Saving...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.3333 14H2.66667C2.31305 14 1.97391 13.8595 1.72386 13.6095C1.47381 13.3594 1.33334 13.0203 1.33334 12.6667V3.33333C1.33334 2.97971 1.47381 2.64057 1.72386 2.39052C1.97391 2.14048 2.31305 2 2.66667 2H10.6667L14.6667 6V12.6667C14.6667 13.0203 14.5262 13.3594 14.2761 13.6095C14.0261 13.8595 13.687 14 13.3333 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11.3333 14V8.66667H4.66667V14M4.66667 2V6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPlanModal;
