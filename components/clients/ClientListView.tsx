import React, { memo } from 'react';
import Link from 'next/link';
import { Client } from '@/lib/models';
import { formatDisplayDate } from '@/lib/utils/format';

interface ClientListViewProps {
  clients: Client[];
}

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const ClientListView = memo(({ clients }: ClientListViewProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phone
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="font-medium text-gray-600">{getInitials(client.name)}</span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      <Link href={`/dashboard/clients/${client.id}`} className="hover:text-blue-600 transition-colors">
                        {client.name}
                      </Link>
                    </div>
                    <div className="text-sm text-gray-500">
                      {client.city && client.country ? `${client.city}, ${client.country}` : client.address}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {client.contactPerson || "—"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <a href={`mailto:${client.email}`} className="text-sm text-blue-600 hover:text-blue-900 transition-colors">
                  {client.email}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {client.phone}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDisplayDate(client.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link href={`/dashboard/clients/${client.id}`} className="text-blue-600 hover:text-blue-900 mr-4 transition-colors">
                  View
                </Link>
                <Link href={`/dashboard/clients/${client.id}/edit`} className="text-indigo-600 hover:text-indigo-900 transition-colors">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

ClientListView.displayName = 'ClientListView';

export default ClientListView;