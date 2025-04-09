"use client";

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/TextArea';
import Toast from '@/components/ui/Toast';
import IconButton from '@/components/ui/IconButton';
import Modal from '@/components/ui/Modal';
import Checkbox from '@/components/ui/Checkbox';
import Tabs from '@/components/ui/Tabs';
import { CatalogItem } from '@/lib/models';
import { dummyCatalogData } from '@/lib/dummy-data/catalog';

export default function CatalogPage() {
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<CatalogItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<CatalogItem> | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'product' | 'service'>('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  // Initialize with dummy data
  useEffect(() => {
    setCatalogItems(dummyCatalogData);
    setFilteredItems(dummyCatalogData);

    // Extract unique categories
    const uniqueCategories = Array.from(new Set(dummyCatalogData.map(item => item.category)));
    setCategories(uniqueCategories);
  }, []);

  useEffect(() => {
    // Apply filters and search
    let results = catalogItems;

    // Filter by type (product/service/all)
    if (filterType !== 'all') {
      results = results.filter(item => item.type === filterType);
    }

    // Filter by category
    if (filterCategory !== 'all') {
      results = results.filter(item => item.category === filterCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(item => 
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.code.toLowerCase().includes(term)
      );
    }

    // Filter by active tab
    if (activeTab === 'products') {
      results = results.filter(item => item.type === 'product');
    } else if (activeTab === 'services') {
      results = results.filter(item => item.type === 'service');
    }

    setFilteredItems(results);
  }, [catalogItems, searchTerm, filterType, filterCategory, activeTab]);

  const resetForm = () => {
    setCurrentItem({
      name: '',
      description: '',
      type: 'product',
      defaultPrice: 0,
      defaultUnit: '',
      taxRate: 20,
      code: '',
      category: '',
      isActive: true,
    });
  };

  const handleOpenModal = (item?: CatalogItem) => {
    if (item) {
      setCurrentItem({ ...item });
      setIsEditing(true);
    } else {
      resetForm();
      setIsEditing(false);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  const handleInputChange = (field: keyof CatalogItem, value: any) => {
    setCurrentItem(prev => {
      if (!prev) return null;
      return { ...prev, [field]: value };
    });
  };

  const validateForm = (): boolean => {
    if (!currentItem) return false;
    
    if (!currentItem.name || currentItem.name.trim().length === 0) {
      setNotification({
        type: 'error',
        message: 'Name is required'
      });
      return false;
    }

    // Fix for TypeScript error - add a safety check for undefined
    const price = currentItem.defaultPrice ?? 0;
    if (price < 0) {
      setNotification({
        type: 'error',
        message: 'Price cannot be negative'
      });
      return false;
    }

    if (!currentItem.defaultUnit || currentItem.defaultUnit.trim().length === 0) {
      setNotification({
        type: 'error',
        message: 'Unit is required'
      });
      return false;
    }

    return true;
  };

  const handleSaveItem = () => {
    if (!validateForm()) return;
    
    const now = new Date();
    
    if (isEditing && currentItem?.id) {
      // Update existing item
      setCatalogItems(prev => 
        prev.map(item => 
          item.id === currentItem.id 
            ? { 
                ...item,
                ...currentItem, 
                // Fix TypeScript issue by providing default values for required fields
                defaultPrice: currentItem.defaultPrice ?? item.defaultPrice,
                name: currentItem.name ?? item.name,
                type: currentItem.type ?? item.type,
                defaultUnit: currentItem.defaultUnit ?? item.defaultUnit,
                taxRate: currentItem.taxRate ?? item.taxRate,
                updatedAt: now
              } 
            : item
        )
      );
      setNotification({
        type: 'success',
        message: `${currentItem.name} has been updated`
      });
    } else {
      // Create new item with safe defaults for all required properties
      const newItem: CatalogItem = {
        id: `cat-${Date.now()}`,
        name: currentItem?.name || 'Unnamed Item',
        description: currentItem?.description || '',
        type: currentItem?.type || 'product',
        defaultPrice: currentItem?.defaultPrice ?? 0,
        defaultUnit: currentItem?.defaultUnit || 'each',
        taxRate: currentItem?.taxRate ?? 0,
        code: currentItem?.code || `NEW-${Math.floor(Math.random() * 1000)}`,
        category: currentItem?.category || 'Uncategorized',
        isActive: currentItem?.isActive ?? true,
        createdAt: now,
        updatedAt: now
      };
      
      setCatalogItems(prev => [...prev, newItem]);
      setNotification({
        type: 'success',
        message: `${newItem.name} has been added to catalog`
      });
    }
    
    handleCloseModal();
  };

  const handleDeleteItem = (id: string) => {
    setCatalogItems(prev => prev.filter(item => item.id !== id));
    setDeleteConfirmationId(null);
    setNotification({
      type: 'success',
      message: 'Item has been removed from catalog'
    });
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const tabOptions = [
    { id: 'all', label: 'All Items' },
    { id: 'products', label: 'Products' },
    { id: 'services', label: 'Services' },
  ];

  return (
    <div className="p-6">
      <PageHeader 
        title="Service & Product Catalog" 
        description="Manage your products and services for invoices and offers" 
      />
      
      {notification && (
        <Toast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="mt-6 space-y-6">
        <Card>
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex justify-between items-center">
            <h3 className="text-base font-medium text-gray-900">Catalog Items</h3>
            <Button onClick={() => handleOpenModal()}>
              Add New Item
            </Button>
          </div>
          
          <div className="p-4">
            {/* Search and Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  type="text"
                  id="search"
                  label="Search"
                  placeholder="Search by name, description or code"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-0"
                />
              </div>
              <div>
                <Select
                  id="category-filter"
                  label="Category"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  options={[
                    { value: 'all', label: 'All Categories' },
                    ...categories.map(cat => ({ value: cat, label: cat }))
                  ]}
                  className="mb-0"
                />
              </div>
              <div>
                <Select
                  id="type-filter"
                  label="Type"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as 'all' | 'product' | 'service')}
                  options={[
                    { value: 'all', label: 'All Types' },
                    { value: 'product', label: 'Products' },
                    { value: 'service', label: 'Services' }
                  ]}
                  className="mb-0"
                />
              </div>
            </div>
            
            {/* Tabs */}
            <Tabs 
              options={tabOptions} 
              activeTab={activeTab} 
              onChange={setActiveTab}
              className="mb-4" 
            />
            
            {/* Items List */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-4 text-center text-sm text-gray-500">
                        No items found. Try adjusting your search or filters.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-gray-500 truncate max-w-xs">{item.description}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.type === 'product' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {item.type === 'product' ? 'Product' : 'Service'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {item.category}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {formatPrice(item.defaultPrice)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {item.defaultUnit}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {item.code}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
                          <div className="flex justify-end space-x-2">
                            <IconButton
                              aria-label="Edit item"
                              onClick={() => handleOpenModal(item)}
                              className="text-gray-600 hover:text-blue-600"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </IconButton>
                            <IconButton
                              aria-label="Delete item"
                              onClick={() => setDeleteConfirmationId(item.id)}
                              className="text-gray-600 hover:text-red-600"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Add/Edit Item Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={isEditing ? 'Edit Catalog Item' : 'Add New Catalog Item'}
      >
        <div className="space-y-4">
          <Input
            type="text"
            id="item-name"
            label="Name"
            value={currentItem?.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
            placeholder="e.g., Web Design Service"
          />
          
          <Textarea
            id="item-description"
            label="Description"
            value={currentItem?.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe this product or service..."
            rows={3}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              id="item-type"
              label="Type"
              value={currentItem?.type || 'product'}
              onChange={(e) => handleInputChange('type', e.target.value)}
              options={[
                { value: 'product', label: 'Product' },
                { value: 'service', label: 'Service' }
              ]}
            />
            
            <Input
              type="text"
              id="item-category"
              label="Category"
              value={currentItem?.category || ''}
              onChange={(e) => handleInputChange('category', e.target.value)}
              placeholder="e.g., DEV, DES, CON"
              list="categories"
            />
            <datalist id="categories">
              {categories.map(category => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              id="item-price"
              label="Default Price"
              value={String(currentItem?.defaultPrice ?? 0)}
              onChange={(e) => handleInputChange('defaultPrice', parseFloat(e.target.value) || 0)}
              step="0.01"
              min="0"
            />
            
            <Input
              type="text"
              id="item-unit"
              label="Default Unit"
              value={currentItem?.defaultUnit || ''}
              onChange={(e) => handleInputChange('defaultUnit', e.target.value)}
              placeholder="e.g., hours, pcs, month"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="number"
              id="item-tax-rate"
              label="Tax Rate (%)"
              value={String(currentItem?.taxRate ?? 0)}
              onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
              step="0.01"
              min="0"
            />
            
            <Input
              type="text"
              id="item-code"
              label="Item Code"
              value={currentItem?.code || ''}
              onChange={(e) => handleInputChange('code', e.target.value)}
              placeholder="e.g., DEV-101"
            />
          </div>
          
          <div className="flex items-center">
            <Checkbox
              id="item-active"
              checked={currentItem?.isActive ?? false}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
            />
            <Label 
              text="Active (available for selection in invoices and offers)"
              htmlFor="item-active"
              className="ml-2 mb-0"
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button onClick={handleSaveItem}>
            {isEditing ? 'Update Item' : 'Add Item'}
          </Button>
        </div>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmationId}
        onClose={() => setDeleteConfirmationId(null)}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this item? This action cannot be undone.
          </p>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setDeleteConfirmationId(null)}>
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={() => deleteConfirmationId && handleDeleteItem(deleteConfirmationId)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}