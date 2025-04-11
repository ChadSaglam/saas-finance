'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function VerifyTwoFactorPage() {
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [remainingTime, setRemainingTime] = useState(600); // 10 minutes in seconds
  const router = useRouter();
  const { verifyCode, needsVerification, isAuthenticated, isTwoFactorVerified } = useAuth();

  // Timer for code expiration
  useEffect(() => {
    // Only start the timer if verification is needed
    if (!needsVerification) return;
    
    const timer = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [needsVerification]);

  // Format remaining time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Redirect if already verified or not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (isTwoFactorVerified) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isTwoFactorVerified, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await verifyCode(verificationCode);
      
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (err) {
      setError('Failed to verify code. Please try again.');
      console.error('Verification error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loader while checking authentication state
  if (!needsVerification && isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Verification Required</h1>
        
        <p className="text-gray-600 mb-6 text-center">
          A verification code has been sent to your email or displayed in the server console.
          Please enter it below to continue.
        </p>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <input
              id="code"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              autoComplete="one-time-code"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
            />
          </div>

          {remainingTime > 0 && (
            <p className="text-sm text-gray-500 text-center">
              Code expires in: <span className="font-medium">{formatTime(remainingTime)}</span>
            </p>
          )}
          
          {remainingTime === 0 && (
            <p className="text-sm text-red-500 text-center">
              Code expired. Please <a href="/login" className="font-bold underline">login again</a>.
            </p>
          )}
          
          <div>
            <button
              type="submit"
              disabled={isSubmitting || remainingTime === 0}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}