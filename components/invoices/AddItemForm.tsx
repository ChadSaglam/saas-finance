import React, { useState, FormEvent, ChangeEvent } from 'react';
import { LineItem } from '@/lib/models';
import { CODE_CATEGORIES, generateProductCode } from '@/lib/utils/product-codes';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface AddItemFormProps {
  onAddItem: (item: Omit<LineItem, 'id'> & { id?: string }) => void;
  onCancel?: () => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ onAddItem, onCancel }) => {
  const [category, setCategory] = useState<keyof typeof CODE_CATEGORIES>('DEV');
  const [codeNumber, setCodeNumber] = useState(101);
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('hours');
  const [price, setPrice] = useState(0);
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Generate the service/product code
    const code = generateProductCode(category, codeNumber);
    
    onAddItem({
      id: `item-${Date.now()}`,
      code,
      description,
      quantity,
      unit,
      price,
      total: quantity * price
    });
    
    // Reset form to add more items or cancel
    resetForm();
  };
  
  const resetForm = () => {
    setDescription('');
    setQuantity(1);
    setPrice(0);
  };
  
  return (
    <Card className="shadow-md">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Add New Item</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4 pb-2">
          <div className="text-sm text-gray-500">Generated Code: <span className="font-mono font-medium">{generateProductCode(category, codeNumber)}</span></div>
        </div>
        
        <div className="pt-2">
          <Input
            label="Description"
            value={description}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              min="1"
              step="0.01"
              value={quantity}
              onChange={(e: ChangeEvent<HTMLInputElement>) => 
                setQuantity(parseFloat(e.target.value || '1'))
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Unit</label>
            <select
              value={unit}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setUnit(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="hours">Hours</option>
              <option value="pcs">Pieces</option>
              <option value="month">Month</option>
              <option value="days">Days</option>
              <option value="users">Users</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Unit Price</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e: ChangeEvent<HTMLInputElement>) => 
                  setPrice(parseFloat(e.target.value || '0'))
                }
                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="0.00"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Total</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                value={(quantity * price).toFixed(2)}
                className="pl-7 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm sm:text-sm"
                disabled
              />
            </div>
          </div>
        </div>
        
        <div className="pt-4 flex justify-end space-x-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            Add Item
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default AddItemForm;