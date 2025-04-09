"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
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
  
  // Current date/time and user info
  const currentDateTime = "2025-04-09 10:12:57";
  const currentUser = "ChadSaglam";
  
  useEffect(() => {
    // In a real app, you'd fetch this from your API
    const timer = setTimeout(() => {
      const foundClient = dummyClients.find(client => client.id === params.id);
      
      if (foundClient) {
        setClient(foundClient);
      }
      
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
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
      <AnimatedContainer animation="fade-in">
        <div className="mb-6">
          <LoadingSkeleton height="30px" width="200px" className="mb-2" />
          <LoadingSkeleton height="20px" width="300px" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LoadingSkeleton height="500px" />
          </div>
          <div>
            <LoadingSkeleton height="250px" />
          </div>
        </div>
      </AnimatedContainer>
    );
  }
  
  return (
    <AnimatedContainer animation="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Client</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update information for {client?.name} • {currentDateTime} • {currentUser}
        </p>
      </div>
      
      {client && (
        <ClientForm 
          client={client}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </AnimatedContainer>
  );
}