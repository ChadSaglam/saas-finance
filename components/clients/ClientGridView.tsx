import React, { memo } from 'react';
import Link from 'next/link';
import { Client } from '@/lib/models';

interface ClientGridViewProps {
  clients: Client[];
}

// Function to get initials from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const ClientGridView = memo(({ clients }: ClientGridViewProps) => {
  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {clients.map((client) => (
        <div key={client.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
          <div className="p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="font-medium text-gray-600 text-lg">{getInitials(client.name)}</span>
              </div>
              <div className="ml-4 flex-1 min-w-0">
                <Link href={`/dashboard/clients/${client.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors truncate block">
                  {client.name}
                </Link>
                <p className="text-xs text-gray-500 truncate">
                  {client.city && client.country ? `${client.city}, ${client.country}` : client.address}
                </p>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div>
                <p className="text-xs text-gray-500">Contact</p>
                <p className="text-sm">{client.contactPerson || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <a href={`mailto:${client.email}`} className="text-sm text-blue-600 hover:text-blue-900 transition-colors truncate block">
                  {client.email}
                </a>
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm">{client.phone}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-between">
            <Link href={`/dashboard/clients/${client.id}`} className="text-sm text-blue-600 hover:text-blue-900 transition-colors">
              View
            </Link>
            <Link href={`/dashboard/clients/${client.id}/edit`} className="text-sm text-indigo-600 hover:text-indigo-900 transition-colors">
              Edit
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
});

ClientGridView.displayName = 'ClientGridView';

export default ClientGridView;