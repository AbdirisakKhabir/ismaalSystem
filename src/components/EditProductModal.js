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

const PRICE_OPTIONS = ['Fixed', 'Range', 'Negotiable', 'Crossed'];
const STATUS_OPTIONS = ['PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'INACTIVE'];
const CONDITION = ['New', 'Used', 'Refurbished'];

const EditProductModal = ({ product, isOpen, onClose, onSave, isLoading }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    price_to: '',
    price_option: 'Fixed',
    crossed_price: '',
    categorySelections: [],
    type: 'New',
    posted_from: 'Personal',
    location: '',
    image: '',
    status: 'PENDING',
  });

  const [cityNames, setCityNames] = useState([]);
  const [categoryNames, setCategoryNames] = useState([]);
  const [lookupsLoading, setLookupsLoading] = useState(false);

  useEffect(() => {
    if (!product) return;
    const p = product.price != null ? String(product.price) : '';
    const pt = product.price_to != null ? String(product.price_to) : '';
    const cx = product.crossed_price != null ? String(product.crossed_price) : '';
    setForm({
      name: product.name || '',
      description: product.description || '',
      price: p,
      price_to: pt,
      price_option: product.price_option || 'Fixed',
      crossed_price: cx,
      categorySelections: parseCategories(product.category),
      type: product.type || 'New',
      posted_from: product.posted_from || 'Personal',
      location: product.location || '',
      image: product.image || '',
      status: product.status || 'PENDING',
    });
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

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const toggleCategory = (name) => {
    setForm((prev) => {
      const sel = prev.categorySelections;
      const next = sel.includes(name) ? sel.filter((x) => x !== name) : [...sel, name];
      return { ...prev, categorySelections: next };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Name is required.');
      return;
    }
    if (!form.location.trim()) {
      alert('Select a city / location.');
      return;
    }
    if (form.categorySelections.length === 0) {
      alert('Select at least one category.');
      return;
    }
    const payload = {
      name: form.name.trim(),
      description: form.description,
      price: form.price === '' ? undefined : parseFloat(form.price),
      price_to: form.price_to === '' ? undefined : parseFloat(form.price_to),
      price_option: form.price_option,
      crossed_price: form.crossed_price === '' ? undefined : parseFloat(form.crossed_price),
      category: form.categorySelections.join(', '),
      type: form.type,
      posted_from: form.posted_from.trim(),
      location: form.location.trim(),
      image: form.image,
      status: form.status,
    };
    onSave(payload);
  };

  if (!isOpen || !product) return null;

  const orphanCats = form.categorySelections.filter((c) => !categoryNames.includes(c));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
        <div className="modal-header">
          <h2>Edit product</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-business-form">
          <div className="form-group">
            <label htmlFor="pname">Name <span className="required">*</span></label>
            <input
              id="pname"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="pdesc">Description</label>
            <textarea
              id="pdesc"
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pprice">Price</label>
              <input
                id="pprice"
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setField('price', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="ppriceopt">Price option</label>
              <select
                id="ppriceopt"
                value={form.price_option}
                onChange={(e) => setField('price_option', e.target.value)}
              >
                {PRICE_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          {form.price_option === 'Range' && (
            <div className="form-group">
              <label htmlFor="ppriceto">Price to</label>
              <input
                id="ppriceto"
                type="number"
                step="0.01"
                value={form.price_to}
                onChange={(e) => setField('price_to', e.target.value)}
              />
            </div>
          )}
          {form.price_option === 'Crossed' && (
            <div className="form-group">
              <label htmlFor="pcrossed">Original (crossed) price</label>
              <input
                id="pcrossed"
                type="number"
                step="0.01"
                value={form.crossed_price}
                onChange={(e) => setField('crossed_price', e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label>Categories <span className="required">*</span></label>
            <div
              style={{
                maxHeight: 200,
                overflowY: 'auto',
                border: '2px solid #e5e7eb',
                borderRadius: 8,
                padding: 12,
                background: '#fafafa',
              }}
            >
              {lookupsLoading ? (
                <span style={{ color: '#6b7280' }}>Loading…</span>
              ) : (
                <>
                  {orphanCats.map((n) => (
                    <label key={`o-${n}`} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
                      <input type="checkbox" checked={form.categorySelections.includes(n)} onChange={() => toggleCategory(n)} />
                      <span>{n} <em style={{ color: '#9ca3af' }}>(current)</em></span>
                    </label>
                  ))}
                  {categoryNames.map((n) => (
                    <label key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
                      <input type="checkbox" checked={form.categorySelections.includes(n)} onChange={() => toggleCategory(n)} />
                      <span>{n}</span>
                    </label>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ptype">Condition</label>
              <select id="ptype" value={form.type} onChange={(e) => setField('type', e.target.value)}>
                {CONDITION.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="pposted">Posted from</label>
              <input
                id="pposted"
                value={form.posted_from}
                onChange={(e) => setField('posted_from', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="pcity">City / location <span className="required">*</span></label>
            <select
              id="pcity"
              value={form.location}
              onChange={(e) => setField('location', e.target.value)}
              disabled={lookupsLoading}
            >
              <option value="">{lookupsLoading ? 'Loading…' : 'Select city'}</option>
              {form.location && !cityNames.includes(form.location) && (
                <option value={form.location}>{form.location} (current)</option>
              )}
              {cityNames.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="pimg">Image URLs</label>
            <textarea
              id="pimg"
              value={form.image}
              onChange={(e) => setField('image', e.target.value)}
              placeholder="Comma-separated URLs"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="pstatus">Status</label>
            <select id="pstatus" value={form.status} onChange={(e) => setField('status', e.target.value)}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={isLoading || lookupsLoading}>
              {isLoading ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;
