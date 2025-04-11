'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';

export default function LoginForm() {
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{email?: string, password?: string}>({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Validate form
  const validateForm = () => {
    const newErrors: {email?: string, password?: string} = {};
    let isValid = true;
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  // Handle input changes
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: undefined }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };
  
  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMe(e.target.checked);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    console.log('Attempting login...');
    
    try {
      // Direct API call for better control over redirection
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          email, 
          password,
          rememberMe
        })
      });
      
      const data = await response.json();
      console.log('Login response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      if (data.success) {
        // Direct redirection based on 2FA status
        if (data.needsVerification) {
          console.log('Redirecting to 2FA verification...');
          window.location.href = '/verify-2fa';
        } else {
          console.log('Redirecting to dashboard...');
          window.location.href = '/dashboard';
        }
      } else {
        setGeneralError(data.message || 'Login failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setGeneralError(error.message || 'An error occurred during login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      
      {generalError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm" role="alert">
          {generalError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          id="email"
          name="email"
          type="email"
          label="Email Address"
          value={email}
          onChange={handleEmailChange}
          error={errors.email}
          autoComplete="email"
          autoFocus
          required
        />
        
        <PasswordInput
          id="password"
          name="password"
          label="Password"
          value={password}
          onChange={handlePasswordChange}
          error={errors.password}
          autoComplete="current-password"
          required
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Checkbox
              id="remember_me"
              name="remember_me"
              checked={rememberMe}
              onChange={handleRememberMeChange}
              aria-label="Remember me"
            />
            <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          
          <div className="text-sm">
            <Link href="/forgot-password" className="text-blue-600 hover:text-blue-500">
              Forgot password?
            </Link>
          </div>
        </div>
        
        <Button
          type="submit"
          isLoading={isSubmitting}
          loadingText="Logging in..."
          fullWidth
        >
          Login
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}