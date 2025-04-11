'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { use2FAVerification } from '@/lib/hooks/use2FAVerification';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function VerifyTwoFactorForm() {
  const {
    verificationCode,
    error,
    setError,
    remainingTime,
    formatTime,
    attempts,
    setAttempts,
    attemptsExceeded,
    isSubmitting,
    setIsSubmitting,
    handleCodeChange
  } = use2FAVerification();
  
  const { verifyCode, isAuthenticated, isTwoFactorVerified } = useAuth();
  
  // Direct redirection for better performance
  useEffect(() => {
    if (isTwoFactorVerified) {
      console.log('2FA verified, redirecting to dashboard');
      window.location.href = '/dashboard';
    }
  }, [isTwoFactorVerified]);
  
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('Not authenticated, redirecting to login');
      window.location.href = '/login';
    }
  }, [isAuthenticated]);
  
  // Submit handler with optimizations
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting 2FA code');
    
    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }
    
    if (remainingTime === 0) {
      setError('Verification code has expired. Please login again.');
      return;
    }
    
    if (attemptsExceeded) {
      setError('Too many verification attempts. Please login again.');
      return;
    }

    setIsSubmitting(true);

    try {
      setAttempts(prev => prev + 1);
      console.log('Verifying code...');
      const success = await verifyCode(verificationCode);
      console.log('Verification result:', success);
      
      if (success) {
        // Direct navigation for faster response
        window.location.href = '/dashboard';
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

  // Form rendering and rest of implementation...
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-2">Verification Required</h1>
          
      <p className="text-gray-600 mb-6 text-center">
        A verification code has been sent to your email.
        Please enter it below to continue.
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm" role="alert">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="code"
          name="code"
          type="text"
          label="Verification Code"
          value={verificationCode}
          onChange={handleCodeChange}
          error={error ? ' ' : undefined}
          helpText={
            remainingTime > 0 
              ? `Code expires in: ${formatTime(remainingTime)}`
              : 'Code expired'
          }
          placeholder="Enter 6-digit code"
          autoComplete="one-time-code"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          autoFocus
          disabled={remainingTime === 0 || attemptsExceeded}
          className="text-center text-xl tracking-wider"
        />
        
        <Button
          type="submit"
          isLoading={isSubmitting}
          loadingText="Verifying..."
          fullWidth
          disabled={remainingTime === 0 || verificationCode.length !== 6 || attemptsExceeded}
        >
          Verify & Continue
        </Button>
        
        {(remainingTime === 0 || attemptsExceeded) && (
          <div className="text-center">
            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Return to login
            </Link>
          </div>
        )}
      </form>
    </div>
  );
}