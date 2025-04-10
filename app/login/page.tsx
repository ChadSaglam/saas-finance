'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, safeRedirect } from '@/lib/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const router = useRouter();
  const auth = useAuth();
  
  // Mark when client-side rendering is active
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Handle redirects based on auth state
  useEffect(() => {
    // Only run on client and after auth loads
    if (!isClient || auth.isLoading) return;
    
    console.log('[LOGIN PAGE] Auth state:', {
      isAuthenticated: auth.isAuthenticated,
      needsVerification: auth.needsVerification,
      isTwoFactorVerified: auth.isTwoFactorVerified,
    });
    
    if (auth.isAuthenticated) {
      if (auth.needsVerification && !auth.isTwoFactorVerified) {
        safeRedirect(router, '/verify-2fa');
      } else {
        safeRedirect(router, '/dashboard');
      }
    }
  }, [isClient, auth.isLoading, auth.isAuthenticated, auth.isTwoFactorVerified, auth.needsVerification, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await auth.login(email, password);
      if (success) {
        safeRedirect(router, '/verify-2fa');
      } else {
        setError('Invalid credentials. Try test@example.com / password123');
      }
    } catch (error) {
      setError('An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading until we're sure about client-side rendering and auth state
  if (!isClient || auth.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Don't render login form if already authenticated (will redirect)
  if (auth.isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded text-sm">
          <p><strong>Test Credentials:</strong></p>
          <p>Email: test@example.com</p>
          <p>Password: password123</p>
          <p>Verification Code: 123456</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          {error && (
            <div className="text-red-600 text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}