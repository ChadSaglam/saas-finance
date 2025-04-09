import React, { useState, useEffect } from 'react';
import { LineItem, CatalogItem } from '@/lib/models';
import { v4 as uuidv4 } from 'uuid';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { dummyCatalogItems, findCatalogItemByCode } from '@/lib/dummy-data/catalog';
import { formatCurrency } from '@/lib/utils/format';

interface LineItemEditorProps {
  item?: LineItem;
  onSave: (item: LineItem) => void;
  onCancel: () => void;
}

const LineItemEditor: React.FC<LineItemEditorProps> = ({ item, onSave, onCancel }) => {
  const [code, setCode] = useState(item?.code || '');
  const [description, setDescription] = useState(item?.description || '');
  const [quantity, setQuantity] = useState(item?.quantity || 1);
  const [unit, setUnit] = useState(item?.unit || 'hours');
  const [price, setPrice] = useState(item?.price || 0);
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<CatalogItem | null>(null);
  const [showCatalogDropdown, setShowCatalogDropdown] = useState(false);

  const calculateTotal = () => {
    return quantity * price;
  };

  // When code changes, try to find a matching catalog item
  useEffect(() => {
    if (code) {
      const catalogItem = findCatalogItemByCode(code);
      if (catalogItem) {
        setSelectedCatalogItem(catalogItem);
        // Update fields with catalog item defaults
        setDescription(catalogItem.description);
        setUnit(catalogItem.defaultUnit);
        setPrice(catalogItem.defaultPrice);
      } else {
        setSelectedCatalogItem(null);
      }
    } else {
      setSelectedCatalogItem(null);
    }
  }, [code]);

  // Handle form submission - changed to normal function
  const handleSubmit = () => {
    const lineItem: LineItem = {
      id: item?.id || uuidv4(),
      code,
      description,
      quantity,
      unit,
      price,
      total: calculateTotal()
    };
    
    onSave(lineItem);
  };

  // Handle catalog item selection
  const handleCatalogItemSelect = (catalogItem: CatalogItem) => {
    setCode(catalogItem.code);
    setDescription(catalogItem.description);
    setUnit(catalogItem.defaultUnit);
    setPrice(catalogItem.defaultPrice);
    setShowCatalogDropdown(false);
  };
  
  // Unit options for the select dropdown
  const unitOptions = [
    { value: 'hours', label: 'hours' },
    { value: 'days', label: 'days' },
    { value: 'pcs', label: 'pcs' },
    { value: 'users', label: 'users' },
    { value: 'month', label: 'month' },
    { value: 'year', label: 'year' },
    { value: 'project', label: 'project' }
  ];

  return (
    <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
      <h3 className="text-lg font-medium mb-4">{item ? 'Edit Line Item' : 'Add Line Item'}</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <div className="flex mb-4">
              <Input
                label="Product/Service Code"
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. DEV-101"
                className="flex-1"
              />
              <div className="ml-2 self-end mb-4">
                <Button 
                  type="button" 
                  variant="outline"
                  size="md"
                  onClick={() => setShowCatalogDropdown(!showCatalogDropdown)}
                >
                  Browse
                </Button>
              </div>
            </div>
            
            {/* Catalog dropdown */}
            {showCatalogDropdown && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                <div className="sticky top-0 z-10 bg-white px-2 py-1.5 border-b border-gray-200">
                  <Input
                    label=""
                    className="p-0 m-0"
                    placeholder="Search catalog items..."
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase">Services</div>
                {dummyCatalogItems.filter(item => item.type === 'service').map((item) => (
                  <div
                    key={item.code}
                    onClick={() => handleCatalogItemSelect(item)}
                    className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <span className="font-medium block truncate">{item.code}</span>
                      <span className="ml-2 text-gray-500">{item.name}</span>
                    </div>
                  </div>
                ))}
                <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase">Products</div>
                {dummyCatalogItems.filter(item => item.type === 'product').map((item) => (
                  <div
                    key={item.code}
                    onClick={() => handleCatalogItemSelect(item)}
                    className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <span className="font-medium block truncate">{item.code}</span>
                      <span className="ml-2 text-gray-500">{item.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {selectedCatalogItem && (
              <p className="mt-1 text-sm text-green-600">
                {selectedCatalogItem.name} - {formatCurrency(selectedCatalogItem.defaultPrice)}/{selectedCatalogItem.defaultUnit}
              </p>
            )}
          </div>
          
          <Input
            label="Description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description of service or product"
            required
          />
          
          <Input
            label="Quantity"
            id="quantity"
            type="number"
            min="0.01"
            step="0.01"
            value={quantity.toString()}
            onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
            required
          />
          
          <Select
            label="Unit"
            id="unit"
            value={unit}
            options={unitOptions}
            onChange={(e) => setUnit(e.target.value)}
            helpText="Unit of measurement"
          />
          
          <Input
            label="Unit Price"
            id="price"
            type="number"
            min="0.01"
            step="0.01"
            value={price.toString()}
            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            required
          />
          
          <Input
            label="Total"
            id="total"
            value={formatCurrency(calculateTotal())}
            readOnly
            helpText="Automatically calculated"
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="primary"
            onClick={handleSubmit}
          >
            {item ? 'Update' : 'Add'} Item
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LineItemEditor;