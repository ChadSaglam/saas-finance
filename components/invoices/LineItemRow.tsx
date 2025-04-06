import React from 'react';
import { LineItem } from '@/lib/models';
import { getCategoryFromCode } from '@/lib/utils/product-codes';
import { formatCurrency } from '@/lib/utils/format';
import IconButton from '@/components/ui/IconButton';

interface LineItemRowProps {
  item: LineItem;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

const LineItemRow: React.FC<LineItemRowProps> = ({ 
  item, 
  onEdit, 
  onDelete,
  showActions = true
}) => {
  // Get category name if code exists
  const categoryName = item.code ? getCategoryFromCode(item.code) : undefined;
  
  return (
    <tr className="hover:bg-gray-50 border-b border-gray-200">
      <td className="px-4 py-3 whitespace-nowrap text-sm">
        <div className="flex flex-col">
          <span className="font-mono font-medium">{item.code || '-'}</span>
          {categoryName && (
            <span className="text-xs text-gray-500">{categoryName}</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-sm">
        {item.description}
      </td>
      <td className="px-4 py-3 text-sm text-right">
        {item.quantity}
      </td>
      <td className="px-4 py-3 text-sm">
        {item.unit}
      </td>
      <td className="px-4 py-3 text-sm text-right">
        {formatCurrency(item.price)}
      </td>
      <td className="px-4 py-3 text-sm font-medium text-right">
        {formatCurrency(item.total)}
      </td>
      {showActions && (
        <td className="px-4 py-3 whitespace-nowrap text-right text-sm">
          <div className="flex justify-end space-x-2">
            {onEdit && (
              <IconButton
                onClick={() => onEdit(item.id)}
                aria-label="Edit item"
                className="text-blue-600 hover:text-blue-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </IconButton>
            )}
            {onDelete && (
              <IconButton
                onClick={() => onDelete(item.id)}
                aria-label="Delete item"
                className="text-red-600 hover:text-red-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </IconButton>
            )}
          </div>
        </td>
      )}
    </tr>
  );
};

export default LineItemRow;