import React, { useState, useEffect } from 'react';
import { systemApi } from '../services/systemApi';
import './EditBusinessModal.css';

const parseCategories = (cat) => {
  if (cat == null || cat === '') return [];
  if (Array.isArray(cat)) return cat.map(String).map((s) => s.trim()).filter(Boolean);
  return String(cat)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
};

const EditProductModal = ({ product, isOpen, onClose, onSave, isLoading }) => {
  const [location, setLocation] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [cityNames, setCityNames] = useState([]);
  const [categoryNames, setCategoryNames] = useState([]);
  const [lookupsLoading, setLookupsLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setLocation(product.location || '');
      setSelectedCategories(parseCategories(product.category));
    }
  }, [product]);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    (async () => {
      try {
        setLookupsLoading(true);
        const [cities, cats] = await Promise.all([
          systemApi.getCities(false),
          systemApi.getCategories('product', false),
        ]);
        if (cancelled) return;
        const cNames = (Array.isArray(cities) ? cities : [])
          .filter((r) => r.active !== false)
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || String(a.name).localeCompare(String(b.name)))
          .map((r) => r.name);
        const pNames = (Array.isArray(cats) ? cats : [])
          .filter((r) => r.active !== false)
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || String(a.name).localeCompare(String(b.name)))
          .map((r) => r.name);
        setCityNames(cNames);
        setCategoryNames(pNames);
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

  const toggleCategory = (name) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location.trim()) {
      alert('Please select a city.');
      return;
    }
    if (selectedCategories.length === 0) {
      alert('Select at least one product category.');
      return;
    }
    onSave({
      location: location.trim(),
      category: selectedCategories.join(', '),
    });
  };

  if (!isOpen || !product) return null;

  const orphanCats = selectedCategories.filter((c) => !categoryNames.includes(c));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit product location &amp; categories</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-business-form">
          <p style={{ margin: '0 0 16px', color: '#6b7280', fontSize: 14 }}>
            {product.name}
          </p>

          <div className="form-group">
            <label htmlFor="productCity">
              City / location <span className="required">*</span>
            </label>
            <select
              id="productCity"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={!location.trim() ? 'input-error' : ''}
              disabled={lookupsLoading}
            >
              <option value="">{lookupsLoading ? 'Loading cities…' : 'Select city'}</option>
              {location && !cityNames.includes(location) && (
                <option value={location}>{location} (current)</option>
              )}
              {cityNames.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            {location && !cityNames.includes(location) && (
              <p style={{ marginTop: 4, fontSize: 12, color: '#6b7280' }}>
                Add this city under System → Cities if it should appear in the app lists.
              </p>
            )}
          </div>

          <div className="form-group">
            <label>
              Categories <span className="required">*</span>
            </label>
            {orphanCats.length > 0 && (
              <p style={{ marginBottom: 8, fontSize: 12, color: '#6b7280' }}>
                Some current values are not in System → Product categories. They stay selected until you remove them.
              </p>
            )}
            <div
              style={{
                maxHeight: 220,
                overflowY: 'auto',
                border: '2px solid #e5e7eb',
                borderRadius: 8,
                padding: 12,
                background: '#fafafa',
              }}
            >
              {lookupsLoading ? (
                <span style={{ color: '#6b7280' }}>Loading categories…</span>
              ) : (
                <>
                  {orphanCats.map((n) => (
                    <label
                      key={`orphan-${n}`}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(n)}
                        onChange={() => toggleCategory(n)}
                      />
                      <span>
                        {n} <em style={{ color: '#9ca3af' }}>(current)</em>
                      </span>
                    </label>
                  ))}
                  {categoryNames.map((n) => (
                    <label
                      key={n}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(n)}
                        onChange={() => toggleCategory(n)}
                      />
                      <span>{n}</span>
                    </label>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={isLoading || lookupsLoading}>
              {isLoading ? (
                <>
                  <span className="spinner-small" />
                  Saving…
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
