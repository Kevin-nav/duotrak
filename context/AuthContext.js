import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService'; // Import userService

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // The apiClient automatically uses the token from localStorage
          const profileResponse = await userService.getCurrentUser();
          if (profileResponse.success) {
            setUser(profileResponse.data);
          } else {
            // Token is invalid or expired
            localStorage.removeItem('authToken');
            setUser(null);
          }
        } catch (error) {
          console.error("Failed to fetch user with token:", error);
          localStorage.removeItem('authToken');
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      if (response.success && response.data.token) {
        // Assume API returns { success: true, data: { user: {...}, token: '...' } }
        localStorage.setItem('authToken', response.data.token);
        setUser(response.data.user);
        router.push('/dashboard');
        return response;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error("AuthContext login error:", error);
      throw error;
    }
  };

  const signup = async (email, password) => {
    try {
      const response = await authService.signup({ email, password });
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || 'Signup failed');
      }
    } catch (error) {
      console.error("AuthContext signup error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    router.push('/auth/login');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 