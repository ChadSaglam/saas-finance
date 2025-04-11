'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  const [isClient, setIsClient] = useState(false);
  const auth = useAuth();
  
  // Mark when client-side rendering is active
  useEffect(() => {
    setIsClient(true);
  }, []);

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
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">InvoicePro</h1>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back to your finance management
          </p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
}