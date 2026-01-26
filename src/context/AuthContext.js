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
      const { user: loggedInUser } = await authApi.login(email, password);
      setUser(loggedInUser);
      setIsAuthenticated(true);
      return { success: true, user: loggedInUser };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Login failed. Please try again.',
        code: error.code
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
