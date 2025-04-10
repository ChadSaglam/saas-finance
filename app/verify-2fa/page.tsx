'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, TEST_VERIFICATION_CODE, safeRedirect } from '@/lib/contexts/AuthContext';

export default function VerifyPage() {
  const [code, setCode] = useState(TEST_VERIFICATION_CODE);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
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
    
    console.log('[VERIFY PAGE] Auth state:', {
      isAuthenticated: auth.isAuthenticated,
      needsVerification: auth.needsVerification,
      isTwoFactorVerified: auth.isTwoFactorVerified,
    });
    
    // If not authenticated, go to login
    if (!auth.isAuthenticated) {
      safeRedirect(router, '/login');
      return;
    }
    
    // If authenticated and doesn't need verification or already verified, go to dashboard
    if (!auth.needsVerification || auth.isTwoFactorVerified) {
      safeRedirect(router, '/dashboard');
      return;
    }
  }, [isClient, auth.isLoading, auth.isAuthenticated, auth.isTwoFactorVerified, auth.needsVerification, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);
    
    try {
      const success = await auth.verifyCode(code);
      if (success) {
        safeRedirect(router, '/dashboard');
      } else {
        setError('Invalid verification code. Try 123456');
      }
    } catch (error) {
      setError('An error occurred during verification.');
    } finally {
      setIsVerifying(false);
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

  // Don't render if user doesn't need verification
  if (!auth.isAuthenticated || !auth.needsVerification || auth.isTwoFactorVerified) {
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
        <h2 className="text-2xl font-bold mb-6">Verify Your Identity</h2>
        
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded text-sm">
          <p><strong>Test Verification Code:</strong> 123456</p>
        </div>
        
        <p className="mb-4 text-gray-600">
          We've sent a verification code to your email.
          Please enter the code to continue.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
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
            disabled={isVerifying}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isVerifying ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>
    </div>
  );
}