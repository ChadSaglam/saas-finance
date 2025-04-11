'use client';

import { useState, useEffect, useCallback } from 'react';

export function use2FAVerification(initialTime = 600) {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [remainingTime, setRemainingTime] = useState(initialTime); // seconds
  const [attempts, setAttempts] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Max attempts before showing warning
  const MAX_ATTEMPTS = 5;
  
  // Format time as mm:ss
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);
  
  // Check if attempts exceeded
  const attemptsExceeded = attempts >= MAX_ATTEMPTS;
  
  // Timer for code expiration
  useEffect(() => {
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
  }, []);
  
  // Handle code input change with only digits
  const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only digits and limit to 6 characters
    const value = e.target.value.replace(/[^0-9]/g, '').substring(0, 6);
    setVerificationCode(value);
    
    // Clear error when typing
    if (error) setError('');
  }, [error]);
  
  return {
    verificationCode,
    setVerificationCode,
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
  };
}