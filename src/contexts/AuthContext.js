"use client";

import { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('auth_token');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login({ email, password });
      
      if (response && response.token) {
        const userData = {
          id: response.userId,
          email: email,
          name: response.name || email,
          role: response.role || 'user'
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('auth_token', response.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to login');
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.register(userData);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Failed to register');
      return false;
    }
  };

  // Check if user is admin
  const isAdmin = () => {
    return user && user.Role === 'Admin';
  };

  // Value to be provided by the context
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
