import axios from 'axios';

const API_BASE_URL = 'https://ismaal.taamsolutions.net';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Professional API functions
export const professionalApi = {
  // Get all professionals
  getAllProfessionals: async () => {
    try {
      const response = await api.get('/api/professionals');
      return response.data;
    } catch (error) {
      console.error('Error fetching professionals:', error);
      throw error;
    }
  },

  // Get single professional by ID
  getProfessionalById: async (id) => {
    try {
      const response = await api.get(`/api/professionals/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching professional:', error);
      throw error;
    }
  },

  // Delete professional
  // Expected endpoint: DELETE /api/professionals/:id
  deleteProfessional: async (id) => {
    try {
      const response = await api.delete(`/api/professionals/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 405) {
        const customError = new Error('DELETE endpoint not available on server');
        customError.code = 'ENDPOINT_NOT_FOUND';
        throw customError;
      }
      console.error('Error deleting professional:', error);
      throw error;
    }
  },
};

export default professionalApi;
