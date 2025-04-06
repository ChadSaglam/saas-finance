"use client";

import React, { useState } from 'react';
import { LineItem } from '@/lib/models';
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';
import { formatCurrency } from '@/lib/utils/format';
import CatalogItemSelector from '@/components/catalog/CatalogItemSelector';

interface LineItemsFormProps {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
}

const LineItemsForm: React.FC<LineItemsFormProps> = ({ items, onChange }) => {
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  
  const addItem = (newItem?: Partial<LineItem>) => {
    const item: LineItem = {
      id: `item-${Date.now()}`,
      description: newItem?.description || '',
      quantity: newItem?.quantity || 1,
      unit: newItem?.unit || 'hours',
      price: newItem?.price || 0,
      total: newItem?.total || 0,
      code: newItem?.code || ''
    };
    
    onChange([...items, item]);
  };
  
  const updateItem = (id: string, updates: Partial<LineItem>) => {
    onChange(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, ...updates };
        
        // Recalculate total if quantity or price changed
        if ('quantity' in updates || 'price' in updates) {
          updatedItem.total = (updatedItem.quantity || 0) * (updatedItem.price || 0);
        }
        
        return updatedItem;
      }
      return item;
    }));
  };
  
  const removeItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };
  
  const handleAddFromCatalog = (newItem: Omit<LineItem, 'id'>) => {
    addItem(newItem);
    setIsCatalogOpen(false);
  };
  
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <Button 
          type="button"
          onClick={() => addItem()}
          size="sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Line Item
        </Button>
        
        <Button 
          type="button"
          onClick={() => setIsCatalogOpen(true)}
          variant="secondary"
          size="sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="-ml-0.5 mr-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Add from Catalog
        </Button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-0 hidden sm:table-cell">
                Code
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Qty
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24 hidden sm:table-cell">
                Unit
              </th>
              <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Price
              </th>
              <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Total
              </th>
              <th scope="col" className="w-16 px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-6 text-center text-sm text-gray-500">
                  No items yet. Click "Add Line Item" or "Add from Catalog" above to get started.
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                    {item.code ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 font-mono">
                        {item.code}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, { description: e.target.value })}
                      className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Description"
                    />
                    {item.code && (
                      <div className="mt-1 sm:hidden">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 font-mono">
                          {item.code}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                      className="block w-full text-right text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap hidden sm:table-cell">
                    <select
                      value={item.unit}
                      onChange={(e) => updateItem(item.id, { unit: e.target.value })}
                      className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="hours">hours</option>
                      <option value="pcs">pcs</option>
                      <option value="days">days</option>
                      <option value="month">month</option>
                      <option value="users">users</option>
                    </select>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, { price: parseFloat(e.target.value) || 0 })}
                        className="block w-full text-right text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 pl-7"
                      />
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                    {formatCurrency(item.total)}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-right flex justify-center">
                    <IconButton 
                      onClick={() => removeItem(item.id)} 
                      className="text-red-600 hover:text-red-800"
                      aria-label="Remove item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </IconButton>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Catalog selector modal */}
      <CatalogItemSelector 
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        onSelectItem={handleAddFromCatalog}
      />
    </div>
  );
};

export default LineItemsForm;