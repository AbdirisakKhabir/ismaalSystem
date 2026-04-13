import axios from 'axios';

const API_BASE_URL = 'https://ismaal.taamsolutions.net';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function adminHeaders() {
  try {
    const raw = localStorage.getItem('adminUser');
    if (!raw) return {};
    const u = JSON.parse(raw);
    if (u?.id != null) return { 'x-user-id': String(u.id) };
  } catch {
    /* ignore */
  }
  return {};
}

function withAdmin(config = {}) {
  return {
    ...config,
    headers: { ...config.headers, ...adminHeaders() },
  };
}

export const systemApi = {
  getCities: async (includeInactive = true) => {
    const res = await api.get(
      '/api/admin/cities',
      withAdmin({ params: { includeInactive: includeInactive ? '1' : undefined } })
    );
    return res.data;
  },

  createCity: async (payload) => {
    const res = await api.post('/api/admin/cities', payload, withAdmin());
    return res.data;
  },

  updateCity: async (id, payload) => {
    const res = await api.put(`/api/admin/cities/${id}`, payload, withAdmin());
    return res.data;
  },

  deleteCity: async (id) => {
    const res = await api.delete(`/api/admin/cities/${id}`, withAdmin());
    return res.data;
  },

  getCategories: async (type, includeInactive = true) => {
    const res = await api.get(
      '/api/admin/categories',
      withAdmin({
        params: {
          type,
          includeInactive: includeInactive ? '1' : undefined,
        },
      })
    );
    return res.data;
  },

  createCategory: async (payload) => {
    const res = await api.post('/api/admin/categories', payload, withAdmin());
    return res.data;
  },

  updateCategory: async (id, payload) => {
    const res = await api.put(`/api/admin/categories/${id}`, payload, withAdmin());
    return res.data;
  },

  deleteCategory: async (id) => {
    const res = await api.delete(`/api/admin/categories/${id}`, withAdmin());
    return res.data;
  },
};

export default systemApi;
