"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import ClientForm from '@/components/clients/ClientForm';
import { Client } from '@/lib/models';
import { dummyClients } from '@/lib/dummy-data/clients';
import { usePageParams } from '@/lib/hooks/usePageParams';

export default function EditClientPage() {
  const router = useRouter();
  const params = usePageParams();
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // In a real app, you'd fetch this from your API
    const foundClient = dummyClients.find(client => client.id === params.id);
    
    if (foundClient) {
      setClient(foundClient);
    }
    
    setIsLoading(false);
  }, [params.id]);
  
  // Show not found if client doesn't exist
  if (!isLoading && !client) {
    notFound();
  }
  
  const handleSubmit = async (updatedClient: Client) => {
    setIsSubmitting(true);
    try {
      // In a real app, you'd update this in your database
      console.log('Updating client:', updatedClient);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to client detail page
      router.push(`/dashboard/clients/${params.id}`);
    } catch (error) {
      console.error('Error updating client:', error);
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Client</h1>
        <p className="mt-1 text-sm text-gray-500">Update information for {client?.name}</p>
      </div>
      
      {client && (
        <ClientForm 
          client={client}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}