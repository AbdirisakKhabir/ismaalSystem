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

const EditProfessionalModal = ({ professional, isOpen, onClose, onSave, isLoading }) => {
  const [location, setLocation] = useState('');
  const [selectedProfessions, setSelectedProfessions] = useState([]);
  const [cityNames, setCityNames] = useState([]);
  const [professionNames, setProfessionNames] = useState([]);
  const [lookupsLoading, setLookupsLoading] = useState(false);

  useEffect(() => {
    if (professional) {
      setLocation(professional.location || '');
      setSelectedProfessions(parseProfessions(professional.profession));
    }
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

  const toggleProfession = (name) => {
    setSelectedProfessions((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location.trim()) {
      alert('Please select a city.');
      return;
    }
    if (selectedProfessions.length === 0) {
      alert('Select at least one profession category.');
      return;
    }
    onSave({
      location: location.trim(),
      profession: selectedProfessions,
    });
  };

  if (!isOpen || !professional) return null;

  const orphanProf = selectedProfessions.filter((p) => !professionNames.includes(p));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit professional city &amp; professions</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-business-form">
          <p style={{ margin: '0 0 16px', color: '#6b7280', fontSize: 14 }}>
            {professional.specialty || `Professional #${professional.id}`}
          </p>

          <div className="form-group">
            <label htmlFor="profCity">
              City / location <span className="required">*</span>
            </label>
            <select
              id="profCity"
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
          </div>

          <div className="form-group">
            <label>
              Professions <span className="required">*</span>
            </label>
            {orphanProf.length > 0 && (
              <p style={{ marginBottom: 8, fontSize: 12, color: '#6b7280' }}>
                Some current values are not in System → Profession categories.
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
                <span style={{ color: '#6b7280' }}>Loading…</span>
              ) : (
                <>
                  {orphanProf.map((n) => (
                    <label
                      key={`orphan-${n}`}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProfessions.includes(n)}
                        onChange={() => toggleProfession(n)}
                      />
                      <span>
                        {n} <em style={{ color: '#9ca3af' }}>(current)</em>
                      </span>
                    </label>
                  ))}
                  {professionNames.map((n) => (
                    <label
                      key={n}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer' }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProfessions.includes(n)}
                        onChange={() => toggleProfession(n)}
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

export default EditProfessionalModal;
