'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types'; // Assuming User interface is defined in '@/types'
import { getAccessToken, clearTokens, saveTokens, getRefreshToken } from '@/lib/tokenManager';
import { refreshAccessToken } from '@/lib/authenUtils';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  loading: boolean; // To indicate if auth state is being loaded
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const decodeAndSetUser = (accessToken: string) => {
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      if (payload && payload.dat && payload.dat.user) {
        setUser(payload.dat.user);
      }
    } catch (e) {
      console.error('Failed to decode access token or set user data:', e);
      setUser(null);
    }
  };

  const login = (accessToken: string, refreshToken: string) => {
    saveTokens(accessToken, refreshToken);
    decodeAndSetUser(accessToken);
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = getAccessToken();
      if (accessToken) {
        decodeAndSetUser(accessToken);
      } else {
        // Try to refresh token if access token is missing
        try {
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            decodeAndSetUser(newAccessToken);
          } else {
            logout(); // Clear any stale refresh token
          }
        } catch (e) {
          console.error('Failed to refresh token during initialization:', e);
          logout();
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
