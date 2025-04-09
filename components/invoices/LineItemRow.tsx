import React from 'react';
import { LineItem } from '@/lib/models';
import { formatCurrency } from '@/lib/utils/format';

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
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
        {item.code || '-'}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {item.description}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500 text-right">
        {item.quantity}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">
        {item.unit}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500 text-right">
        {formatCurrency(item.price)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-900 font-medium text-right">
        {formatCurrency(item.total)}
      </td>
      {showActions && (
        <td className="px-4 py-3 text-right text-sm font-medium">
          <div className="flex justify-end space-x-2">
            {onEdit && (
              <button 
                onClick={() => onEdit(item.id)} 
                className="text-indigo-600 hover:text-indigo-900"
                type="button"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button 
                onClick={() => onDelete(item.id)} 
                className="text-red-600 hover:text-red-900"
                type="button"
              >
                Remove
              </button>
            )}
          </div>
        </td>
      )}
    </tr>
  );
};

export default LineItemRow;