"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientForm from '@/components/clients/ClientForm';
import { Client } from '@/lib/models';

export default function CreateClientPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Create New Client</h1>
        <p className="mt-1 text-sm text-gray-500">Add a new client to your database</p>
      </div>
      
      <ClientForm 
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}