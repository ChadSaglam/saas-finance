'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  lastLoginIp: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isTwoFactorVerified: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  verifyCode: (code: string) => Promise<boolean>;
  needsVerification: boolean;
  isLoading: boolean;
}

// Test credentials
export const TEST_EMAIL = "test@example.com";
export const TEST_PASSWORD = "password123";
export const TEST_VERIFICATION_CODE = "123456";

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isTwoFactorVerified: false,
  user: null,
  login: async () => false,
  logout: () => {},
  verifyCode: async () => false,
  needsVerification: false,
  isLoading: true,
});

// Global counter to prevent redirect loops
let redirectCount = 0; 
let lastRedirectTime = 0;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTwoFactorVerified, setIsTwoFactorVerified] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load auth state from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      console.log('[AUTH] Loading auth state from localStorage...');
      
      // Check if user exists in localStorage
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
          
          // Check if 2FA is already verified
          const verified2FA = localStorage.getItem('2fa_verified');
          if (verified2FA === 'true') {
            setIsTwoFactorVerified(true);
            setNeedsVerification(false);
            console.log('[AUTH] User authenticated with 2FA verified');
          } else {
            setIsTwoFactorVerified(false);
            setNeedsVerification(true);
            console.log('[AUTH] User authenticated but needs 2FA verification');
          }
        } catch (e) {
          console.error('[AUTH] Error parsing user data:', e);
          localStorage.removeItem('user');
          localStorage.removeItem('2fa_verified');
          setIsAuthenticated(false);
        }
      } else {
        console.log('[AUTH] No authenticated user found');
        setIsAuthenticated(false);
        setIsTwoFactorVerified(false);
        setNeedsVerification(false);
      }
    } catch (error) {
      console.error('[AUTH] Error loading auth state:', error);
      // Reset localStorage if corrupted
      localStorage.removeItem('user');
      localStorage.removeItem('2fa_verified');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('[AUTH] Login attempt with:', email);
      
      // Simple hardcoded credential check
      if (email.trim() === TEST_EMAIL && password === TEST_PASSWORD) {
        const mockUser = { 
          id: '123', 
          email: email.trim(), 
          name: 'Test User',
          lastLoginIp: '192.168.1.1'
        };
        
        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify(mockUser));
        localStorage.removeItem('2fa_verified'); // Reset verification
        
        setUser(mockUser);
        setIsAuthenticated(true);
        setIsTwoFactorVerified(false);
        setNeedsVerification(true);
        
        console.log('[AUTH] Login successful');
        return true;
      }
      
      console.log('[AUTH] Login failed - invalid credentials');
      return false;
    } catch (error) {
      console.error('[AUTH] Login error:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('[AUTH] Logging out');
    
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('2fa_verified');
    
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
    setIsTwoFactorVerified(false);
    setNeedsVerification(false);
    
    // Reset redirect count for safety
    redirectCount = 0;
    
    console.log('[AUTH] Logout complete');
  };

  const verifyCode = async (code: string): Promise<boolean> => {
    console.log('[AUTH] Verifying code');
    
    // Simple verification with hardcoded code
    if (code.trim() === TEST_VERIFICATION_CODE) {
      localStorage.setItem('2fa_verified', 'true');
      setIsTwoFactorVerified(true);
      setNeedsVerification(false);
      console.log('[AUTH] Code verification successful');
      return true;
    }
    
    console.log('[AUTH] Code verification failed');
    return false;
  };

  const value = {
    user,
    isAuthenticated,
    isTwoFactorVerified,
    login,
    logout,
    verifyCode,
    needsVerification,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Helper to prevent redirect loops
export const safeRedirect = (router: any, path: string): boolean => {
  // Don't redirect on server
  if (typeof window === 'undefined') return false;
  
  const now = Date.now();
  
  // If we've done too many redirects too quickly, stop
  if (redirectCount > 5 && now - lastRedirectTime < 2000) {
    console.warn('[REDIRECT] Too many redirects, stopping');
    
    // Reset count after a delay
    setTimeout(() => {
      redirectCount = 0;
    }, 3000);
    
    return false;
  }
  
  // Track redirects
  redirectCount++;
  lastRedirectTime = now;
  
  console.log(`[REDIRECT] (${redirectCount}) To: ${path}`);
  
  // Only redirect if we're not already on that page
  if (window.location.pathname !== path) {
    router.push(path);
    return true;
  }
  
  return false;
};

export const useAuth = () => useContext(AuthContext);