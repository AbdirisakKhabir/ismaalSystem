import axios from 'axios';

const API_BASE_URL = 'https://ismaal.taamsolutions.net';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Plan API functions
export const planApi = {
  // Get all plans
  getAllPlans: async () => {
    try {
      const response = await api.get('/api/plans');
      return response.data;
    } catch (error) {
      console.error('Error fetching plans:', error);
      throw error;
    }
  },

  // Get single plan by ID
  getPlanById: async (id) => {
    try {
      const response = await api.get(`/api/plans/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching plan:', error);
      throw error;
    }
  },

  // Update plan
  // Endpoint: PUT /api/plans/:id
  updatePlan: async (id, planData) => {
    try {
      const response = await api.put(`/api/plans/${id}`, planData);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 405) {
        const customError = new Error('UPDATE endpoint not available on server');
        customError.code = 'ENDPOINT_NOT_FOUND';
        throw customError;
      }
      console.error('Error updating plan:', error);
      throw error;
    }
  },

  // Delete plan
  // Endpoint: DELETE /api/plans/:id
  deletePlan: async (id) => {
    try {
      const response = await api.delete(`/api/plans/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 405) {
        const customError = new Error('DELETE endpoint not available on server');
        customError.code = 'ENDPOINT_NOT_FOUND';
        throw customError;
      }
      console.error('Error deleting plan:', error);
      throw error;
    }
  },
};

export default planApi;
