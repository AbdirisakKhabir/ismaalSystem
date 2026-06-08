import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/authApi';

// Create Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      
      // Check if user exists in localStorage
      const storedUser = authApi.getCurrentUser();
      
      if (storedUser) {
        // Optionally verify token with backend
        // const isValid = await authApi.verifyToken();
        // if (isValid) {
        //   setUser(storedUser);
        //   setIsAuthenticated(true);
        // }
        
        // For now, trust localStorage
        setUser(storedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      authApi.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const result = await authApi.login(email, password);

      if (result.requiresVerification) {
        return {
          success: true,
          requiresVerification: true,
          email: result.email,
          maskedPhone: result.maskedPhone,
          message: result.message,
        };
      }

      setUser(result.user);
      setIsAuthenticated(true);
      return { success: true, user: result.user };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Login failed. Please try again.',
        code: error.code,
      };
    }
  };

  const verifyLogin = async (email, code) => {
    try {
      const { user: loggedInUser } = await authApi.verifyLogin(email, code);
      setUser(loggedInUser);
      setIsAuthenticated(true);
      return { success: true, user: loggedInUser };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Verification failed. Please try again.',
        code: error.code,
      };
    }
  };

  const resendLoginCode = async (email) => {
    try {
      const result = await authApi.resendLoginCode(email);
      return { success: true, ...result };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Could not resend code. Please try again.',
        code: error.code,
      };
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    verifyLogin,
    resendLoginCode,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
