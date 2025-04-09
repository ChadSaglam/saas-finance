"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import AnimatedContainer from '@/components/ui/AnimatedContainer';
import { dummyClients } from '@/lib/dummy-data/clients';
import { 
  ViewListIcon, 
  ViewGridIcon, 
  FilterIcon, 
  SearchIcon, 
  PlusIcon 
} from '@/components/ui/Icons';
import ClientListView from '@/components/clients/ClientListView';
import ClientGridView from '@/components/clients/ClientGridView';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { formatDateTimeUTC } from '@/lib/utils/format';

// Country options for filter
const COUNTRY_OPTIONS = [
  { value: '', label: 'All Countries' },
  { value: 'US', label: 'United States' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
];

// Date filter options
const DATE_FILTER_OPTIONS = [
  { value: '', label: 'Any Time' },
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
  { value: 'year', label: 'This year' },
];

export default function ClientsPage() {
  // State for UI controls
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [countryFilter, setCountryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  // State for current date/time to avoid hydration errors
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [userLogin, setUserLogin] = useState('');
  
  // Set current date and user after component mounts (client-side only)
  useEffect(() => {
    setCurrentDateTime(formatDateTimeUTC(new Date()));
    setUserLogin('ChadSaglam'); // Set the user name
  }, []);
  
  // Simulate API loading with cleanup
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Rest of the component remains unchanged
  
  // Handle search with memoization for better performance
  const filteredClients = useMemo(() => {
    if (!searchTerm.trim() && !countryFilter && !dateFilter) return dummyClients;
    
    return dummyClients.filter((client) => {
      // Search term filter
      const matchesSearch = !searchTerm.trim() || 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.contactPerson && client.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Country filter
      const matchesCountry = !countryFilter || 
        (client.country && client.country.toLowerCase() === countryFilter.toLowerCase());
      
      // Date filter
      let matchesDate = true;
      if (dateFilter) {
        const today = new Date();
        let filterDate = new Date();
        
        if (dateFilter === '7') {
          filterDate.setDate(today.getDate() - 7);
        } else if (dateFilter === '30') {
          filterDate.setDate(today.getDate() - 30);
        } else if (dateFilter === '90') {
          filterDate.setDate(today.getDate() - 90);
        } else if (dateFilter === 'year') {
          filterDate = new Date(today.getFullYear(), 0, 1); // Start of current year
        }
        
        matchesDate = client.createdAt >= filterDate;
      }
      
      return matchesSearch && matchesCountry && matchesDate;
    });
  }, [searchTerm, countryFilter, dateFilter]);
  
  // Sort clients by name (memoized)
  const sortedClients = useMemo(() => (
    [...filteredClients].sort((a, b) => a.name.localeCompare(b.name))
  ), [filteredClients]);
  
  // Handle search input change
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);
  
  // Toggle filters
  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);
  
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setCountryFilter('');
    setDateFilter('');
    setShowFilters(false);
  }, []);

  // Handle country filter change
  const handleCountryFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setCountryFilter(e.target.value);
  }, []);

  // Handle date filter change
  const handleDateFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateFilter(e.target.value);
  }, []);

  return (
    <div>
      <AnimatedContainer animation="fade-in" duration={400}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your client database ({sortedClients.length} {sortedClients.length === 1 ? 'client' : 'clients'})
              {currentDateTime && ` • ${currentDateTime}`}
              {userLogin && ` • ${userLogin}`}
            </p>
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
        
        {/* Rest of the component remains the same */}
        <Card hoverable className="overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div className="relative w-full md:max-w-xs">
                <div className="relative">
                  <Input
                    label=""
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-10 mb-0"
                    aria-label="Search clients"
                  />
                  <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
              </div>
              
              <div className="flex space-x-2 w-full md:w-auto justify-between md:justify-start">
                <Button 
                  variant="outline"
                  onClick={toggleFilters}
                  aria-expanded={showFilters}
                  aria-controls="filter-panel"
                >
                  <FilterIcon className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                
                <div className="border rounded-md flex">
                  <button 
                    onClick={() => setViewMode('list')} 
                    className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''} transition-colors`}
                    title="List view"
                    aria-pressed={viewMode === 'list'}
                  >
                    <ViewListIcon className="h-5 w-5 text-gray-500" />
                  </button>
                  <button 
                    onClick={() => setViewMode('grid')} 
                    className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''} transition-colors`}
                    title="Grid view"
                    aria-pressed={viewMode === 'grid'}
                  >
                    <ViewGridIcon className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
            
            {showFilters && (
              <AnimatedContainer animation="slide-in-up" duration={300}>
                <div id="filter-panel" className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select
                    id="country-filter"
                    label="Country"
                    options={COUNTRY_OPTIONS}
                    value={countryFilter}
                    onChange={handleCountryFilterChange}
                  />
                  
                  <Select
                    id="date-filter"
                    label="Created Date"
                    options={DATE_FILTER_OPTIONS}
                    value={dateFilter}
                    onChange={handleDateFilterChange}
                  />
                  
                  <div className="flex items-end">
                    <Button 
                      variant="secondary"
                      onClick={resetFilters}
                      className="mt-auto"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </AnimatedContainer>
            )}
          </div>
          
          {/* Conditionally render list or grid view with loading skeleton */}
          {isLoading ? (
            viewMode === 'list' ? (
              <div className="p-4">
                <LoadingSkeleton height="400px" />
              </div>
            ) : (
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <LoadingSkeleton key={i} height="200px" />
                ))}
              </div>
            )
          ) : (
            <AnimatedContainer animation="fade-in" duration={400}>
              {viewMode === 'list' ? (
                <ClientListView clients={sortedClients} />
              ) : (
                <ClientGridView clients={sortedClients} />
              )}
            </AnimatedContainer>
          )}
          
          {/* No results message */}
          {!isLoading && sortedClients.length === 0 && (
            <AnimatedContainer animation="fade-in" duration={400}>
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
                  <SearchIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No clients found</h3>
                <p className="text-gray-500 mb-4">
                  {(searchTerm || countryFilter || dateFilter) ? (
                    <>No results match your search criteria. Try different keywords or <Button
                      variant="ghost"
                      onClick={resetFilters}
                      className="text-blue-600 hover:text-blue-800 font-medium p-0 h-auto"
                    >clear all filters</Button>.</>
                  ) : (
                    <>Get started by adding your first client.</>
                  )}
                </p>
                {!(searchTerm || countryFilter || dateFilter) && (
                  <Link href="/dashboard/clients/create">
                    <Button variant="primary" size="md">
                      <PlusIcon className="h-5 w-5 mr-1" />
                      Add Client
                    </Button>
                  </Link>
                )}
              </div>
            </AnimatedContainer>
          )}
        </Card>
      </AnimatedContainer>
    </div>
  );
}