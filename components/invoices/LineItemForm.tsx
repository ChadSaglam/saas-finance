import React from 'react';
import Button from '@/components/ui/Button';
import { LineItem } from '@/lib/models';

interface LineItemFormProps {
  item: Partial<LineItem>;
  onSave: (item: Partial<LineItem>) => void;
  onCancel: () => void;
}

const LineItemForm: React.FC<LineItemFormProps> = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = React.useState<Partial<LineItem>>({
    code: '',
    description: '',
    quantity: 1,
    price: 0,
    unit: 'pcs',
    ...item
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const numericFields = ['quantity', 'price'];
    
    if (numericFields.includes(name)) {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Calculate total
    const total = (formData.quantity || 0) * (formData.price || 0);
    onSave({ ...formData, total });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Code</label>
          <input
            type="text"
            name="code"
            value={formData.code || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Unit</label>
          <select
            name="unit"
            value={formData.unit || 'pcs'}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="pcs">Pieces</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
            <option value="kg">Kilograms</option>
            <option value="m">Meters</option>
            <option value="l">Liters</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Unit Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Total</label>
          <input
            type="text"
            value={((formData.quantity || 0) * (formData.price || 0)).toFixed(2)}
            className="mt-1 block w-full rounded-md bg-gray-50 border-gray-300 shadow-sm sm:text-sm"
            disabled
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Button type="submit">
          Save Item
        </Button>
      </div>
    </form>
  );
};

export default LineItemForm;