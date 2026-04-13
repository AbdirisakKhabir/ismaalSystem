import React, { useState, useEffect, useCallback } from 'react';
import { systemApi } from '../services/systemApi';
import './Plans.css';
import './System.css';

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
        await systemApi.updateCategory(editingId, { ...payload, type: categoryType });
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

      <div className="system-toolbar">
        <button
          type="button"
          className={section === 'cities' ? 'nav-tab active' : 'nav-tab'}
          id="system-city-tab"
          onClick={() => { setSection('cities'); setEditingId(null); }}
        >
          Cities
        </button>
        <button
          type="button"
          className={section === 'categories' ? 'nav-tab active' : 'nav-tab'}
          id="system-category-tab"
          onClick={() => { setSection('categories'); setEditingId(null); }}
        >
          Categories
        </button>
        {section === 'categories' && (
          <select
            value={categoryType}
            onChange={(e) => { setCategoryType(e.target.value); setEditingId(null); }}
            className="system-select"
          >
            {CATEGORY_TYPES.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        )}
      </div>

      <form className="edit-plan-form system-form" onSubmit={handleAdd}>
        <div className="form-body">
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
            <div className="form-group system-form-action">
              <button type="submit" className="btn-refresh" disabled={saving || !newName.trim()}>
                {saving ? 'Saving…' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="plans-content">
        {loading ? (
          <p className="system-loading">Loading…</p>
        ) : (
          <div className="table-wrapper system-table-wrapper">
            <table className="data-table system-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Sort</th>
                  <th>Active</th>
                  <th className="system-actions-head">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    {editingId === row.id ? (
                      <>
                        <td>
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="system-input-name"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={editSort}
                            onChange={(e) => setEditSort(e.target.value)}
                            className="system-input-sort"
                          />
                        </td>
                        <td>
                          <label className="system-checkbox-wrap">
                            <input
                              type="checkbox"
                              checked={editActive}
                              onChange={(e) => setEditActive(e.target.checked)}
                            />
                            <span>{editActive ? 'Yes' : 'No'}</span>
                          </label>
                        </td>
                        <td className="system-actions-cell">
                          <button type="button" className="btn-refresh" onClick={saveEdit} disabled={saving}>Save</button>
                          <button type="button" className="logout-btn system-btn-gap" onClick={cancelEdit}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{row.name}</td>
                        <td>{row.sortOrder}</td>
                        <td>
                          <span className={row.active ? 'system-badge-active' : 'system-badge-inactive'}>
                            {row.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="system-actions-cell">
                          <button type="button" className="btn-refresh" onClick={() => startEdit(row)}>Edit</button>
                          <button type="button" className="logout-btn system-btn-gap" onClick={() => handleDelete(row)}>Delete</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {!rows.length && !loading && (
              <p className="system-empty">No rows yet. Run DB seed or add items above.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default System;
