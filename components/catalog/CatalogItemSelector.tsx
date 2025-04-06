"use client";

import React, { useState, useEffect } from 'react';
import { CatalogItem, LineItem } from '@/lib/models';
import { dummyCatalogItems } from '@/lib/dummy-data/catalog-items';
import { CODE_CATEGORIES } from '@/lib/utils/product-codes';
import { formatCurrency } from '@/lib/utils/format';
import Modal from '@/components/ui/Modal';
import SearchInput from '@/components/ui/SearchInput';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';

interface CatalogItemSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectItem: (item: Omit<LineItem, 'id'>) => void;
  initialCategory?: string;
}

const CatalogItemSelector: React.FC<CatalogItemSelectorProps> = ({
  isOpen,
  onClose,
  onSelectItem,
  initialCategory = 'all'
}) => {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<CatalogItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch catalog items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, this would be an API call
        // For now, we use the dummy data with a delay to simulate loading
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Only get active items
        const activeItems = dummyCatalogItems.filter(item => item.isActive);
        setItems(activeItems);
        setFilteredItems(activeItems);
      } catch (error) {
        console.error("Error fetching catalog items:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isOpen) {
      fetchItems();
    }
  }, [isOpen]);

  // Filter items when search or category changes
  useEffect(() => {
    let results = [...items];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.code.toLowerCase().includes(query) || 
        item.description.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      results = results.filter(item => item.category === selectedCategory);
    }
    
    setFilteredItems(results);
  }, [items, searchQuery, selectedCategory]);

  // Handle item selection
  const handleSelectItem = (item: CatalogItem) => {
    onSelectItem({
      code: item.code,
      description: item.name,
      quantity: 1,
      unit: item.defaultUnit,
      price: item.defaultPrice,
      total: item.defaultPrice
    });
    
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select from Catalog" size="lg">
      <div className="p-4 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items..."
            onClear={() => setSearchQuery('')}
            className="w-full sm:w-64"
          />
          
          <div className="w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="all">All Categories</option>
              {Object.entries(CODE_CATEGORIES).map(([key, { name }]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-3 text-sm text-gray-500">Loading catalog items...</p>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No matching items</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Item
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Unit
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr 
                      key={item.id} 
                      className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                      onClick={() => handleSelectItem(item)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800 font-mono">
                          {item.code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500 line-clamp-1 hidden md:block">{item.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">
                        {item.defaultUnit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {formatCurrency(item.defaultPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button size="sm" variant="secondary">
                          Select
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
        <Button
          onClick={onClose}
          variant="outline"
          className="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto"
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default CatalogItemSelector;