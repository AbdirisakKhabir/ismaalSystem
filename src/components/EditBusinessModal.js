import React, { useState, useEffect } from 'react';
import { systemApi } from '../services/systemApi';
import './EditBusinessModal.css';

const STATUS_OPTIONS = ['PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'INACTIVE'];

const EditBusinessModal = ({ business, isOpen, onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    phone: '',
    email: '',
    location: '',
    businessType: '',
    status: 'PENDING',
    image: '',
  });

  const [errors, setErrors] = useState({});
  const [cityNames, setCityNames] = useState([]);
  const [categoryNames, setCategoryNames] = useState([]);
  const [lookupsLoading, setLookupsLoading] = useState(false);

  useEffect(() => {
    if (business) {
      setFormData({
        name: business.name || '',
        description: business.description || '',
        category: business.category || '',
        phone: business.phone || '',
        email: business.email || '',
        location: business.location || '',
        businessType: business.businessType ?? '',
        status: business.status || 'PENDING',
        image: business.image || '',
      });
      setErrors({});
    }
  }, [business]);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    (async () => {
      try {
        setLookupsLoading(true);
        const [cities, cats] = await Promise.all([
          systemApi.getCities(false),
          systemApi.getCategories('business', false),
        ]);
        if (cancelled) return;
        const cNames = (Array.isArray(cities) ? cities : [])
          .filter((r) => r.active !== false)
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || String(a.name).localeCompare(String(b.name)))
          .map((r) => r.name);
        const catNames = (Array.isArray(cats) ? cats : [])
          .filter((r) => r.active !== false)
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || String(a.name).localeCompare(String(b.name)))
          .map((r) => r.name);
        setCityNames(cNames);
        setCategoryNames(catNames);
      } catch {
        if (!cancelled) {
          setCityNames([]);
          setCategoryNames([]);
        }
      } finally {
        if (!cancelled) setLookupsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Business</h2>
          <button className="modal-close" onClick={onClose}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-business-form">
          <div className="form-group">
            <label htmlFor="name">
              Business Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'input-error' : ''}
              placeholder="Enter business name"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? 'input-error' : ''}
              placeholder="Enter business description"
              rows="4"
            />
            {errors.description && (
              <span className="error-message">{errors.description}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">
                Category <span className="required">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? 'input-error' : ''}
                disabled={lookupsLoading}
              >
                <option value="">{lookupsLoading ? 'Loading categories…' : 'Select category'}</option>
                {formData.category && !categoryNames.includes(formData.category) && (
                  <option value={formData.category}>{formData.category} (current)</option>
                )}
                {categoryNames.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              {!lookupsLoading && formData.category && !categoryNames.includes(formData.category) && (
                <p style={{ marginTop: 4, fontSize: 12, color: '#6b7280' }}>
                  This category is not in System → Business categories. Choose a listed value or add it in System.
                </p>
              )}
              {errors.category && (
                <span className="error-message">{errors.category}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="phone">
                Phone <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? 'input-error' : ''}
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <span className="error-message">{errors.phone}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email <span className="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
              placeholder="Enter email address"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="location">
              City / location <span className="required">*</span>
            </label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={errors.location ? 'input-error' : ''}
              disabled={lookupsLoading}
            >
              <option value="">{lookupsLoading ? 'Loading cities…' : 'Select city'}</option>
              {formData.location && !cityNames.includes(formData.location) && (
                <option value={formData.location}>{formData.location} (current)</option>
              )}
              {cityNames.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            {!lookupsLoading && formData.location && !cityNames.includes(formData.location) && (
              <p style={{ marginTop: 4, fontSize: 12, color: '#6b7280' }}>
                This city is not in System → Cities. Choose a listed value or add it in System.
              </p>
            )}
            {errors.location && (
              <span className="error-message">{errors.location}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="businessType">Business type</label>
              <input
                type="text"
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                placeholder="Optional"
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URLs</label>
            <textarea
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Comma-separated image URLs"
              rows={3}
            />
          </div>

          <div className="modal-footer">
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
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBusinessModal;
