import React, { useState, useCallback } from 'react';
import { LineItem } from '@/lib/models';
import Button from '@/components/ui/Button';
import LineItemsTable from './LineItemsTable';
import LineItemEditor from './LineItemEditor';

interface LineItemsEditorProps {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
  className?: string;
}

const LineItemsEditor: React.FC<LineItemsEditorProps> = ({
  items,
  onChange,
  className = ''
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Find the item being edited - memoize this for performance
  const editingItem = editingItemId ? items.find(item => item.id === editingItemId) : undefined;

  // Handle saving a line item (new or edited)
  const handleSaveItem = useCallback((item: LineItem) => {
    let newItems: LineItem[];
    
    if (editingItemId) {
      // Replace existing item
      newItems = items.map(i => i.id === editingItemId ? item : i);
      setEditingItemId(null);
    } else {
      // Add new item
      newItems = [...items, item];
      setIsAdding(false);
    }
    
    onChange(newItems);
  }, [items, editingItemId, onChange]);
  
  // Handle deleting a line item
  const handleDeleteItem = useCallback((id: string) => {
    const newItems = items.filter(item => item.id !== id);
    onChange(newItems);
  }, [items, onChange]);
  
  // Handle editing a line item
  const handleEditItem = useCallback((id: string) => {
    setEditingItemId(id);
    setIsAdding(false);
  }, []);
  
  // Handle canceling add/edit
  const handleCancel = useCallback(() => {
    setIsAdding(false);
    setEditingItemId(null);
  }, []);

  return (
    <div className={className}>
      {(isAdding || editingItemId) ? (
        <LineItemEditor 
          item={editingItem}
          onSave={handleSaveItem}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <LineItemsTable 
            items={items} 
            onEditItem={handleEditItem} 
            onDeleteItem={handleDeleteItem}
            showActions={true}
          />
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsAdding(true)}
            >
              Add Line Item
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default LineItemsEditor;