import React, { useState, FormEvent, ChangeEvent } from 'react';
import { CatalogItem } from '@/lib/models';
import { CODE_CATEGORIES, generateProductCode } from '@/lib/utils/product-codes';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/TextArea';

interface AddCatalogItemFormProps {
  onAddItem: (item: Omit<CatalogItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

const AddCatalogItemForm: React.FC<AddCatalogItemFormProps> = ({ onAddItem, onCancel }) => {
  const [category, setCategory] = useState<keyof typeof CODE_CATEGORIES>('DEV');
  const [codeNumber, setCodeNumber] = useState(101);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [defaultUnit, setDefaultUnit] = useState('hours');
  const [defaultPrice, setDefaultPrice] = useState(0);
  const [isActive, setIsActive] = useState(true);
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Generate the code
    const code = generateProductCode(category, codeNumber);
    
    onAddItem({
      code,
      name,
      description,
      defaultUnit,
      defaultPrice,
      category,
      isActive
    });
  };
  
  return (
    <Card className="shadow-md">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <h3 className="text-lg font-medium text-gray-900">Add New Catalog Item</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={category}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => 
                setCategory(e.target.value as keyof typeof CODE_CATEGORIES)
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {Object.entries(CODE_CATEGORIES).map(([key, { name }]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Code Number</label>
            <input
              type="number"
              value={codeNumber}
              onChange={(e: ChangeEvent<HTMLInputElement>) => 
                setCodeNumber(parseInt(e.target.value || '0'))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              min="100"
              max="999"
            />
            
            <div className="mt-2 text-sm text-gray-500">
              Code: <span className="font-mono font-medium">{generateProductCode(category, codeNumber)}</span>
            </div>
          </div>
        </div>
        
        <Input
          label="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        
        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Unit</label>
            <select
              value={defaultUnit}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setDefaultUnit(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="hours">Hours</option>
              <option value="pcs">Pieces</option>
              <option value="month">Month</option>
              <option value="days">Days</option>
              <option value="users">Users</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Default Price</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={defaultPrice}
                onChange={(e: ChangeEvent<HTMLInputElement>) => 
                  setDefaultPrice(parseFloat(e.target.value || '0'))
                }
                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="0.00"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <input
            id="is-active"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="is-active" className="ml-2 block text-sm text-gray-900">
            Active (available for selection in forms)
          </label>
        </div>
        
        <div className="pt-3 flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Add to Catalog
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AddCatalogItemForm;