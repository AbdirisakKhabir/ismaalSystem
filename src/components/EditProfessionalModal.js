import React, { useState, useEffect } from 'react';
import { systemApi } from '../services/systemApi';
import './EditBusinessModal.css';

const parseProfessions = (prof) => {
  if (prof == null || prof === '') return [];
  if (Array.isArray(prof)) return prof.map(String).map((s) => s.trim()).filter(Boolean);
  return String(prof)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
};

const STATUS_OPTIONS = ['PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'INACTIVE'];

const EditProfessionalModal = ({ professional, isOpen, onClose, onSave, isLoading }) => {
  const [form, setForm] = useState({
    specialty: '',
    experience: '',
    location: '',
    phone: '',
    email: '',
    description: '',
    image: '',
    status: 'PENDING',
    published: true,
    professionSelections: [],
  });

  const [cityNames, setCityNames] = useState([]);
  const [professionNames, setProfessionNames] = useState([]);
  const [lookupsLoading, setLookupsLoading] = useState(false);

  useEffect(() => {
    if (!professional) return;
    setForm({
      specialty: professional.specialty || '',
      experience: professional.experience || '',
      location: professional.location || '',
      phone: professional.phone || '',
      email: professional.email || '',
      description: professional.description || '',
      image: professional.image || '',
      status: professional.status || 'PENDING',
      published: professional.published !== false,
      professionSelections: parseProfessions(professional.profession),
    });
  }, [professional]);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    (async () => {
      try {
        setLookupsLoading(true);
        const [cities, cats] = await Promise.all([
          systemApi.getCities(false),
          systemApi.getCategories('profession', false),
        ]);
        if (cancelled) return;
        const cNames = (Array.isArray(cities) ? cities : [])
          .filter((r) => r.active !== false)
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || String(a.name).localeCompare(String(b.name)))
          .map((r) => r.name);
        const prNames = (Array.isArray(cats) ? cats : [])
          .filter((r) => r.active !== false)
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || String(a.name).localeCompare(String(b.name)))
          .map((r) => r.name);
        setCityNames(cNames);
        setProfessionNames(prNames);
      } catch {
        if (!cancelled) {
          setCityNames([]);
          setProfessionNames([]);
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

  const toggleProfession = (name) => {
    setForm((prev) => {
      const sel = prev.professionSelections;
      const next = sel.includes(name) ? sel.filter((x) => x !== name) : [...sel, name];
      return { ...prev, professionSelections: next };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.professionSelections.length === 0) {
      alert('Select at least one profession.');
      return;
    }
    if (!form.location.trim()) {
      alert('Select a city.');
      return;
    }
    onSave({
      profession: form.professionSelections.join(', '),
      specialty: form.specialty.trim(),
      experience: form.experience.trim(),
      location: form.location.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      description: form.description.trim() || null,
      image: form.image,
      status: form.status,
      published: form.published,
    });
  };

  if (!isOpen || !professional) return null;

  const orphanProf = form.professionSelections.filter((p) => !professionNames.includes(p));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 640 }}>
        <div className="modal-header">
          <h2>Edit professional</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-business-form">
          <p style={{ margin: '0 0 16px', color: '#6b7280', fontSize: 14 }}>
            User #{professional.userId} · Record #{professional.id}
          </p>

          <div className="form-group">
            <label>Professions <span className="required">*</span></label>
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
                  {orphanProf.map((n) => (
                    <label key={`o-${n}`} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
                      <input type="checkbox" checked={form.professionSelections.includes(n)} onChange={() => toggleProfession(n)} />
                      <span>{n} <em style={{ color: '#9ca3af' }}>(current)</em></span>
                    </label>
                  ))}
                  {professionNames.map((n) => (
                    <label key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}>
                      <input type="checkbox" checked={form.professionSelections.includes(n)} onChange={() => toggleProfession(n)} />
                      <span>{n}</span>
                    </label>
                  ))}
                </>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="pspec">Specialty <span className="required">*</span></label>
            <input id="pspec" value={form.specialty} onChange={(e) => setField('specialty', e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="pexp">Experience <span className="required">*</span></label>
            <input id="pexp" value={form.experience} onChange={(e) => setField('experience', e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="ploc">City / location <span className="required">*</span></label>
            <select
              id="ploc"
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pphone">Phone <span className="required">*</span></label>
              <input id="pphone" type="tel" value={form.phone} onChange={(e) => setField('phone', e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="pmail">Email <span className="required">*</span></label>
              <input id="pmail" type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} required />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="pdesc">Description</label>
            <textarea id="pdesc" value={form.description} onChange={(e) => setField('description', e.target.value)} rows={4} />
          </div>

          <div className="form-group">
            <label htmlFor="pimg">Image URL</label>
            <input id="pimg" value={form.image} onChange={(e) => setField('image', e.target.value)} />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pst">Status</label>
              <select id="pst" value={form.status} onChange={(e) => setField('status', e.target.value)}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ alignSelf: 'flex-end' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setField('published', e.target.checked)}
                />
                Published (directory)
              </label>
            </div>
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

export default EditProfessionalModal;
