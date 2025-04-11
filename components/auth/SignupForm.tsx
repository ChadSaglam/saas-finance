'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthForm } from '@/lib/hooks/useAuthForm';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import Button from '@/components/ui/Button';

export default function SignupForm() {
  const { 
    formData, 
    errors, 
    isSubmitting, 
    setIsSubmitting,
    generalError,
    setGeneralError,
    validateForm, 
    handleChange,
    router
  } = useAuthForm({
    requireName: true,
    requirePasswordMatch: true,
    requireStrongPassword: true
  });
  
  const [signupSuccess, setSignupSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }
      
      setSignupSuccess(true);
      
      // Redirect to login after a delay
      setTimeout(() => {
        router.push('/login');
      }, 3000);
      
    } catch (error: any) {
      setGeneralError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (signupSuccess) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center">
          <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="text-2xl font-semibold mb-2">Account Created Successfully!</h2>
          <p className="text-gray-600 mb-4">You will be redirected to the login page shortly.</p>
          <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
            Login now
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Your Account</h2>
      
      {generalError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm" role="alert">
          {generalError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          id="name"
          name="name"
          type="text"
          label="Full Name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          autoComplete="name"
          autoFocus
          required
        />
        
        <Input
          id="email"
          name="email"
          type="email"
          label="Email Address"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
          required
        />
        
        <PasswordInput
          id="password"
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          helpText="Must be at least 8 characters with uppercase, lowercase, and numbers"
          autoComplete="new-password"
          required
        />
        
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          autoComplete="new-password"
          required
        />
        
        <Button
          type="submit"
          isLoading={isSubmitting}
          loadingText="Creating Account..."
          fullWidth
        >
          Create Account
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}