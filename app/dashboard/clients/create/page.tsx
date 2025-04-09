"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import ClientForm from '@/components/clients/ClientForm';
import { Client } from '@/lib/models';

export default function CreateClientPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Current date/time and user info
  const currentDateTime = "2025-04-09 10:12:57";
  const currentUser = "ChadSaglam";
  
  const handleSubmit = async (client: Client) => {
    setIsSubmitting(true);
    try {
      // In a real app, you'd save this to your database
      console.log('Creating client:', client);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to clients list
      router.push('/dashboard/clients');
    } catch (error) {
      console.error('Error creating client:', error);
      setIsSubmitting(false);
    }
  };
  
  return (
    <AnimatedContainer animation="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Create New Client</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add a new client to your database • {currentDateTime} • {currentUser}
        </p>
      </div>
      
      <ClientForm 
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </AnimatedContainer>
  );
}