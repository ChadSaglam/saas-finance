"use client";

import { useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { dummyClients } from '@/lib/dummy-data/clients';
import { ViewListIcon, ViewGridIcon, FilterIcon, SearchIcon, PlusIcon } from '@/components/ui/Icons';
import { formatDisplayDate } from '@/lib/utils/date-format';

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showFilters, setShowFilters] = useState(false);
  
  // Handle search
  const filteredClients = dummyClients.filter((client) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      client.name.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      client.phone.toLowerCase().includes(searchLower) ||
      (client.contactPerson && client.contactPerson.toLowerCase().includes(searchLower))
    );
  });
  
  // Sort clients by name
  const sortedClients = [...filteredClients].sort((a, b) => 
    a.name.localeCompare(b.name)
  );
  
  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Reference date for consistent timestamps
  const referenceDate = new Date('2025-04-07T15:00:50Z');

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your client database</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/dashboard/clients/create">
            <Button variant="primary">
              <PlusIcon className="h-5 w-5 mr-1" />
              Add Client
            </Button>
          </Link>
        </div>
      </div>
      
      <Card>
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="relative w-full md:max-w-xs">
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 py-2 border border-gray-300 rounded-md inline-flex items-center text-sm text-gray-700 bg-white hover:bg-gray-50"
              >
                <FilterIcon className="h-4 w-4 mr-2" />
                Filters
              </button>
              
              <div className="border rounded-md flex">
                <button 
                  onClick={() => setViewMode('list')} 
                  className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                  title="List view"
                >
                  <ViewListIcon className="h-5 w-5 text-gray-500" />
                </button>
                <button 
                  onClick={() => setViewMode('grid')} 
                  className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                  title="Grid view"
                >
                  <ViewGridIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                  <option value="">All Countries</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Germany</option>
                  <option>France</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
                <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                  <option value="">Any Time</option>
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>This year</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md text-sm">
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Client List View */}
        {viewMode === 'list' ? (
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
                {sortedClients.length > 0 ? (
                  sortedClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="font-medium text-gray-600">{getInitials(client.name)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              <Link href={`/dashboard/clients/${client.id}`} className="hover:text-blue-600">
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
                        <a href={`mailto:${client.email}`} className="text-sm text-blue-600 hover:text-blue-900">
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
                        <Link href={`/dashboard/clients/${client.id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                          View
                        </Link>
                        <Link href={`/dashboard/clients/${client.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No clients found. Add your first client to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          // Client Grid View
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedClients.length > 0 ? (
              sortedClients.map((client) => (
                <div key={client.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="font-medium text-gray-600 text-lg">{getInitials(client.name)}</span>
                      </div>
                      <div className="ml-4 flex-1 min-w-0">
                        <Link href={`/dashboard/clients/${client.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate block">
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
                        <a href={`mailto:${client.email}`} className="text-sm text-blue-600 hover:text-blue-900 truncate block">
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
                    <Link href={`/dashboard/clients/${client.id}`} className="text-sm text-blue-600 hover:text-blue-900">
                      View
                    </Link>
                    <Link href={`/dashboard/clients/${client.id}/edit`} className="text-sm text-indigo-600 hover:text-indigo-900">
                      Edit
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                No clients found. Add your first client to get started.
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}