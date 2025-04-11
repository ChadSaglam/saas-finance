import React from 'react';
import SignupForm from '@/components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">InvoicePro</h1>
          <p className="mt-2 text-sm text-gray-600">
            Create your account to get started
          </p>
        </div>
        
        <SignupForm />
      </div>
    </div>
  );
}