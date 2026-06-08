import axios from 'axios';

const API_BASE_URL = 'https://ismaal.taamsolutions.net';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API functions
export const authApi = {
  // Login step 1 - validate credentials and send WhatsApp verification code
  login: async (email, password) => {
    try {
      const response = await api.post('/api/auth/admin/login', {
        email,
        password,
      });

      if (response.data.requiresVerification) {
        return {
          requiresVerification: true,
          email: response.data.email,
          maskedPhone: response.data.maskedPhone,
          message: response.data.message,
        };
      }

      const { user } = response.data;
      localStorage.setItem('adminUser', JSON.stringify(user));
      return { user };
    } catch (error) {
      if (error.response?.status === 403) {
        const customError = new Error('Access denied. Admin privileges required.');
        customError.code = 'NOT_ADMIN';
        throw customError;
      }

      if (error.response?.status === 401) {
        const customError = new Error('Invalid email or password');
        customError.code = 'INVALID_CREDENTIALS';
        throw customError;
      }

      if (error.response?.data?.error) {
        const customError = new Error(error.response.data.error);
        customError.code = 'LOGIN_FAILED';
        throw customError;
      }

      console.error('Login error:', error);
      throw error;
    }
  },

  // Login step 2 - verify WhatsApp code and complete sign-in
  verifyLogin: async (email, code) => {
    try {
      const response = await api.post('/api/auth/admin/verify-login', {
        email,
        code,
      });

      const { user } = response.data;
      localStorage.setItem('adminUser', JSON.stringify(user));
      return { user };
    } catch (error) {
      if (error.response?.data?.error) {
        const customError = new Error(error.response.data.error);
        customError.code = 'INVALID_CODE';
        throw customError;
      }
      console.error('Verify login error:', error);
      throw error;
    }
  },

  // Resend WhatsApp verification code
  resendLoginCode: async (email) => {
    try {
      const response = await api.post('/api/auth/admin/resend-login-code', {
        email,
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.error) {
        const customError = new Error(error.response.data.error);
        customError.code = 'RESEND_FAILED';
        throw customError;
      }
      console.error('Resend login code error:', error);
      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('adminUser');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const user = localStorage.getItem('adminUser');
    
    if (!user) {
      return false;
    }

    try {
      const parsedUser = JSON.parse(user);
      return parsedUser.role === 'ADMIN';
    } catch {
      return false;
    }
  },

  // Get current user
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('adminUser');
      if (!user) return null;
      
      const parsedUser = JSON.parse(user);
      if (parsedUser.role !== 'ADMIN') {
        authApi.logout();
        return null;
      }
      
      return parsedUser;
    } catch {
      return null;
    }
  },

  // Verify session is still valid (optional - can implement if backend supports it)
  verifySession: async () => {
    const user = authApi.getCurrentUser();
    if (!user) {
      return false;
    }

    // For now, just check localStorage
    // You can implement a backend endpoint to verify if needed
    return user.role === 'ADMIN';
  },
};

export default authApi;
