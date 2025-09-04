"use client";

import { createContext, useState, useContext, useEffect } from 'react';
import { decodeJWTToken } from '../utils/tokenUtils';

import { authAPI } from '../services/api';
import { 
  getDecodedTokenFromStorage, 
  validateAndRefreshUserFromToken,
  isTokenExpired 
} from '../utils/tokenUtils';

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
    try {
      const token = localStorage.getItem('auth_token');
      const decodedToken = decodeJWTToken(token);
      console.log(decodedToken);


      if (token) {
        // Check if token is expired
        if (isTokenExpired(token)) {
          console.log('Token expired, clearing storage');
          localStorage.removeItem('user');
          localStorage.removeItem('auth_token');
          setUser(null);
        } else {
          // Decode token and get user data
          const decodedUser = validateAndRefreshUserFromToken();
          
          if (decodedUser) {
            console.log('User loaded from decoded token:', decodedUser);
            setUser(decodedUser);
            
            // Update stored user data with decoded info
            localStorage.setItem('user', JSON.stringify(decodedUser));
          } else {
            // Token is invalid, clear storage
            console.log('Invalid token, clearing storage');
            localStorage.removeItem('user');
            localStorage.removeItem('auth_token');
            setUser(null);
          }
        }
      } else {
        // No token, check if there's stored user data (fallback)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            console.log('User loaded from localStorage (no token):', parsedUser);
            setUser(parsedUser);
          } catch (error) {
            console.error('Error parsing stored user:', error);
            localStorage.removeItem('user');
          }
        }
      }
    } catch (error) {
      console.error('Error during auth initialization:', error);
      // Clear everything on error
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
      setUser(null);
    }
    
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login({ email, password });
      console.log(response);

      if (response && response.token) {
        // Store the token first
        localStorage.setItem('auth_token', response.token);
        
        // Try to get user data from decoded token
        const decodedUser = validateAndRefreshUserFromToken();
        
        let userData;
        if (decodedUser) {
          // Use decoded token data
          userData = decodedUser;
          console.log('User data from decoded token:', userData);
        } else {
          // Fallback to response data
          userData = {
            id: response.userId,
            email: email,
            name: response.name || email,
            role: response.role || 'user'
          };
          console.log('User data from API response (fallback):', userData);
        }
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
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
    localStorage.removeItem('DecodedToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isClient');
    localStorage.removeItem('isPartner');
    localStorage.removeItem('isMember');
    localStorage.removeItem('isNews');
    localStorage.removeItem('isCircular');
    localStorage.removeItem('isCertificate');
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
    return user && (user.role === 'Admin' || user.Role === 'Admin');
  };

  // Get decoded token data
  const getDecodedToken = () => {
    return getDecodedTokenFromStorage();
  };

  // Check if current token is valid
  const isTokenValid = () => {
    const token = localStorage.getItem('auth_token');
    return token && !isTokenExpired(token);
  };

  // Value to be provided by the context
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAdmin,
    getDecodedToken,
    isTokenValid
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
