import React, { useState, useEffect, useCallback } from 'react';
import { systemApi } from '../services/systemApi';
import './Plans.css';

const CATEGORY_TYPES = [
  { value: 'business', label: 'Business' },
  { value: 'product', label: 'Product' },
  { value: 'profession', label: 'Profession' },
];

const System = () => {
  const [section, setSection] = useState('cities');
  const [categoryType, setCategoryType] = useState('business');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newName, setNewName] = useState('');
  const [newSort, setNewSort] = useState('0');
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editSort, setEditSort] = useState('0');
  const [editActive, setEditActive] = useState(true);
  /** Preserves the row's category type while editing so the top filter does not overwrite PUT payload. */
  const [editCategoryType, setEditCategoryType] = useState('business');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (section === 'cities') {
        const data = await systemApi.getCities(true);
        setRows(Array.isArray(data) ? data : []);
      } else {
        const data = await systemApi.getCategories(categoryType, true);
        setRows(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [section, categoryType]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async (e) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    try {
      setSaving(true);
      setError(null);
      const sortOrder = Number.parseInt(newSort, 10);
      if (section === 'cities') {
        await systemApi.createCity({
          name,
          sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
          active: true,
        });
      } else {
        await systemApi.createCategory({
          name,
          type: categoryType,
          sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
          active: true,
        });
      }
      setNewName('');
      setNewSort('0');
      await load();
    } catch (err) {
      alert(err.response?.data?.error || err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (row) => {
    setEditingId(row.id);
    setEditName(row.name);
    setEditSort(String(row.sortOrder ?? 0));
    setEditActive(!!row.active);
    if (section === 'categories') {
      setEditCategoryType(row.type || 'business');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async () => {
    if (editingId == null) return;
    const name = editName.trim();
    if (!name) return;
    try {
      setSaving(true);
      const sortOrder = Number.parseInt(editSort, 10);
      const payload = {
        name,
        sortOrder: Number.isFinite(sortOrder) ? sortOrder : 0,
        active: editActive,
      };
      if (section === 'cities') {
        await systemApi.updateCity(editingId, payload);
      } else {
        await systemApi.updateCategory(editingId, {
          ...payload,
          type: editCategoryType,
        });
      }
      setEditingId(null);
      await load();
    } catch (err) {
      alert(err.response?.data?.error || err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete "${row.name}"?`)) return;
    try {
      setSaving(true);
      if (section === 'cities') {
        await systemApi.deleteCity(row.id);
      } else {
        await systemApi.deleteCategory(row.id);
      }
      await load();
    } catch (err) {
      alert(err.response?.data?.error || err.message || 'Delete failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="plans-container">
      <div className="plans-header">
        <div className="header-content">
          <h1 className="plans-title">System</h1>
          <p className="plans-subtitle">Manage cities and category lists for the mobile app</p>
        </div>
        <button type="button" className="btn-refresh" onClick={load} disabled={loading}>
          Refresh
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div style={{ padding: '0 24px 16px', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          type="button"
          className={section === 'cities' ? 'nav-tab active' : 'nav-tab'}
          style={{ border: '1px solid var(--border, #e5e7eb)', borderRadius: 8, padding: '8px 16px', background: section === 'cities' ? 'var(--primary, #3b82f6)' : '#fff', color: section === 'cities' ? '#fff' : 'inherit' }}
          onClick={() => { setSection('cities'); setEditingId(null); }}
        >
          Cities
        </button>
        <button
          type="button"
          className={section === 'categories' ? 'nav-tab active' : 'nav-tab'}
          style={{ border: '1px solid var(--border, #e5e7eb)', borderRadius: 8, padding: '8px 16px', background: section === 'categories' ? 'var(--primary, #3b82f6)' : '#fff', color: section === 'categories' ? '#fff' : 'inherit' }}
          onClick={() => { setSection('categories'); setEditingId(null); }}
        >
          Categories
        </button>
        {section === 'categories' && (
          <select
            value={categoryType}
            onChange={(e) => { setCategoryType(e.target.value); setEditingId(null); }}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb' }}
          >
            {CATEGORY_TYPES.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        )}
      </div>

      <form className="edit-plan-form" onSubmit={handleAdd} style={{ marginBottom: 24 }}>
        <div className="form-body" style={{ paddingTop: 0 }}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sysNewName">{section === 'cities' ? 'New city' : 'New category'}</label>
              <input
                id="sysNewName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="sysNewSort">Sort order</label>
              <input
                id="sysNewSort"
                type="number"
                value={newSort}
                onChange={(e) => setNewSort(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ alignSelf: 'flex-end' }}>
              <button type="submit" className="btn-refresh" disabled={saving || !newName.trim()}>
                {saving ? 'Saving…' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="plans-content">
        {loading ? (
          <p style={{ padding: 24 }}>Loading…</p>
        ) : (
          <div className="table-wrapper" style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: 12 }}>Name</th>
                  {section === 'categories' && (
                    <th style={{ textAlign: 'left', padding: 12 }}>Type</th>
                  )}
                  <th style={{ textAlign: 'left', padding: 12 }}>Sort</th>
                  <th style={{ textAlign: 'left', padding: 12 }}>Active</th>
                  <th style={{ textAlign: 'right', padding: 12 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} style={{ borderTop: '1px solid #eee' }}>
                    {editingId === row.id ? (
                      <>
                        <td style={{ padding: 8 }}>
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            style={{ width: '100%', maxWidth: 280, padding: 8 }}
                          />
                        </td>
                        {section === 'categories' && (
                          <td style={{ padding: 8 }}>
                            <select
                              value={editCategoryType}
                              onChange={(e) => setEditCategoryType(e.target.value)}
                              style={{ padding: 8, borderRadius: 6, border: '1px solid #e5e7eb' }}
                            >
                              {CATEGORY_TYPES.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                              ))}
                            </select>
                          </td>
                        )}
                        <td style={{ padding: 8 }}>
                          <input
                            type="number"
                            value={editSort}
                            onChange={(e) => setEditSort(e.target.value)}
                            style={{ width: 80, padding: 8 }}
                          />
                        </td>
                        <td style={{ padding: 8 }}>
                          <label>
                            <input
                              type="checkbox"
                              checked={editActive}
                              onChange={(e) => setEditActive(e.target.checked)}
                            />
                          </label>
                        </td>
                        <td style={{ padding: 8, textAlign: 'right' }}>
                          <button type="button" className="btn-refresh" onClick={saveEdit} disabled={saving}>Save</button>
                          <button type="button" className="logout-btn" style={{ marginLeft: 8 }} onClick={cancelEdit}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: 12 }}>{row.name}</td>
                        {section === 'categories' && (
                          <td style={{ padding: 12 }}>{row.type}</td>
                        )}
                        <td style={{ padding: 12 }}>{row.sortOrder}</td>
                        <td style={{ padding: 12 }}>{row.active ? 'Yes' : 'No'}</td>
                        <td style={{ padding: 12, textAlign: 'right' }}>
                          <button type="button" className="btn-refresh" onClick={() => startEdit(row)}>Edit</button>
                          <button type="button" className="logout-btn" style={{ marginLeft: 8 }} onClick={() => handleDelete(row)}>Delete</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {!rows.length && !loading && (
              <p style={{ padding: 16, color: '#6b7280' }}>No rows yet. Run DB seed or add items above.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default System;
