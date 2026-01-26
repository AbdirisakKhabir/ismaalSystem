import axios from 'axios';

const API_BASE_URL = 'https://ismaal.taamsolutions.net';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User API functions
export const userApi = {
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await api.get('/api/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get single user by ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404 || error.response?.status === 405) {
        const customError = new Error('DELETE endpoint not available on server');
        customError.code = 'ENDPOINT_NOT_FOUND';
        throw customError;
      }
      console.error('Error deleting user:', error);
      throw error;
    }
  },
};

export default userApi;
