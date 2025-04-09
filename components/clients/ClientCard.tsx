import React from 'react';
import Link from 'next/link';
import { Client } from '@/lib/models';
import { formatDisplayDate } from '@/lib/utils/date-format';
import Card from '@/components/ui/Card';

interface ClientCardProps {
  client: Client;
}

const ClientCard: React.FC<ClientCardProps> = ({ client }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
            {client.name.charAt(0).toUpperCase()}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">
              <Link href={`/dashboard/clients/${client.id}`} className="hover:text-blue-600">
                {client.name}
              </Link>
            </h3>
            <p className="text-sm text-gray-500 truncate">{client.contactPerson}</p>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            <span className="text-gray-600 truncate">{client.email}</span>
          </div>
          
          <div className="flex items-start">
            <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            <span className="text-gray-600 truncate">{client.phone}</span>
          </div>
          
          <div className="flex items-start">
            <svg className="h-5 w-5 text-gray-400 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span className="text-gray-600 truncate">{client.address}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-500">
            Added on {formatDisplayDate(client.createdAt)}
          </div>
          <div className="flex space-x-2">
            <Link href={`/dashboard/clients/${client.id}`}>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View
              </button>
            </Link>
            <Link href={`/dashboard/clients/${client.id}/edit`}>
              <button className="text-sm text-gray-600 hover:text-gray-800 font-medium">
                Edit
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ClientCard;