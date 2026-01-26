import axios from 'axios';

const API_BASE_URL = 'https://ismaal.taamsolutions.net';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Product API functions
export const productApi = {
  // Get all products
  getAllProducts: async () => {
    try {
      const response = await api.get('/api/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get single product by ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Delete product
  // Expected endpoint: DELETE /api/products/:id
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      // If DELETE endpoint returns 404 or 405, it means the endpoint doesn't exist
      if (error.response?.status === 404 || error.response?.status === 405) {
        const customError = new Error('DELETE endpoint not available on server');
        customError.code = 'ENDPOINT_NOT_FOUND';
        throw customError;
      }
      console.error('Error deleting product:', error);
      throw error;
    }
  },
};

export default productApi;
