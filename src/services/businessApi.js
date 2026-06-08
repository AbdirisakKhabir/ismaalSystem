import axios from 'axios';

const API_BASE_URL = 'https://ismaal.taamsolutions.net';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Business API functions
export const businessApi = {
  // Get all businesses
  getAllBusinesses: async () => {
    try {
      const response = await api.get('/api/businesses');
      return response.data;
    } catch (error) {
      console.error('Error fetching businesses:', error);
      throw error;
    }
  },

  // Get single business by ID
  getBusinessById: async (id) => {
    try {
      const response = await api.get(`/api/businesses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching business:', error);
      throw error;
    }
  },

  // Update business
  updateBusiness: async (id, data, userId) => {
    try {
      const response = await api.patch(`/api/businesses/${id}`, data, {
        headers: {
          'x-user-id': userId.toString(),
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating business:', error);
      throw error;
    }
  },

  // Delete business
  // Expected endpoint: DELETE /api/businesses/:id
  deleteBusiness: async (id) => {
    try {
      const response = await api.delete(`/api/businesses/${id}`);
      return response.data;
    } catch (error) {
      // If DELETE endpoint returns 404 or 405, it means the endpoint doesn't exist
      if (error.response?.status === 404 || error.response?.status === 405) {
        const customError = new Error('DELETE endpoint not available on server');
        customError.code = 'ENDPOINT_NOT_FOUND';
        throw customError;
      }
      console.error('Error deleting business:', error);
      throw error;
    }
  },
};

export default businessApi;
