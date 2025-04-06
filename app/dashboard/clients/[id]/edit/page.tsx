"use client";

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ClientForm from '@/components/clients/ClientForm';
import { dummyClients } from '@/lib/dummy-data/clients';
import { usePageParams } from '@/lib/hooks/usePageParams';

export default function EditClientPage() {
  const params = usePageParams();
  const id = params.id;
  
  const client = dummyClients.find(c => c.id === id);
  
  if (!client) {
    notFound();
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Client: {client.name}</h1>
        <Link href={`/dashboard/clients/${client.id}`}>
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>
      
      <Card>
        <ClientForm initialData={client} isEditing={true} />
      </Card>
    </div>
  );
}