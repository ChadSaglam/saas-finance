'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Auth context type definition
interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  needsVerification: boolean;
  isTwoFactorVerified: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  verifyCode: (code: string) => Promise<boolean>;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  needsVerification: false,
  isTwoFactorVerified: false,
  login: async () => false,
  logout: async () => {},
  verifyCode: async () => false
});

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

// Safe redirect function to avoid errors
export const safeRedirect = (router: ReturnType<typeof useRouter>, path: string) => {
  try {
    router.push(path);
  } catch (error) {
    console.error('Navigation error:', error);
    // Fallback to window.location if router fails
    window.location.href = path;
  }
};

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // State
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [isTwoFactorVerified, setIsTwoFactorVerified] = useState(false);
  const router = useRouter();
  
  // Memoize authentication status
  const isAuthenticated = useMemo(() => !!user, [user]);
  
  // Check authentication status
  const checkAuthStatus = useCallback(async () => {
    try {
      // Add cache-busting query parameter for development
      const cacheBuster = process.env.NODE_ENV === 'development' ? `?_cb=${Date.now()}` : '';
      
      const response = await fetch(`/api/auth/session${cacheBuster}`, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (!response.ok) {
        if (response.status !== 401) {
          console.error('Session check failed:', response.status);
        }
        return false;
      }
      
      const data = await response.json();
      
      if (data.success && data.authenticated) {
        setUser(data.user);
        setNeedsVerification(data.needsVerification || false);
        setIsTwoFactorVerified(data.isTwoFactorVerified || false);
        return true;
      } else {
        setUser(null);
        setNeedsVerification(false);
        setIsTwoFactorVerified(false);
        return false;
      }
    } catch (error) {
      console.error('Failed to check authentication status:', error);
      return false;
    }
  }, []);
  
  // Login function
  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) return false;
      
      const data = await response.json();
      
      if (!data.success) return false;
      
      setUser(data.user);
      setNeedsVerification(data.needsVerification || false);
      setIsTwoFactorVerified(data.isTwoFactorVerified || false);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);
  
  // Logout function
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setNeedsVerification(false);
      setIsTwoFactorVerified(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [router]);
  
  // 2FA verification function
  const verifyCode = useCallback(async (code: string) => {
    try {
      const response = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      
      if (!response.ok) return false;
      
      const data = await response.json();
      
      if (!data.success) return false;
      
      setIsTwoFactorVerified(true);
      setNeedsVerification(false);
      
      return true;
    } catch (error) {
      console.error('2FA verification error:', error);
      return false;
    }
  }, []);
  
  // Check auth status on mount (once only)
  useEffect(() => {
    const checkAuth = async () => {
      await checkAuthStatus();
      setIsLoading(false);
    };
    
    checkAuth();
    // No dependencies - run once on mount
  }, []);
  
  // Create memoized context value
  const authContextValue = useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
    needsVerification,
    isTwoFactorVerified,
    login,
    logout,
    verifyCode
  }), [
    user,
    isAuthenticated,
    isLoading,
    needsVerification,
    isTwoFactorVerified,
    login,
    logout,
    verifyCode
  ]);
  
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}