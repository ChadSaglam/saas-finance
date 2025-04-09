import React from 'react';
import { LineItem } from '@/lib/models';
import LineItemRow from './LineItemRow';
import { formatCurrency } from '@/lib/utils/format';

interface LineItemsTableProps {
  items: LineItem[];
  onChange?: (items: LineItem[]) => void;  // Added onChange prop
  readOnly?: boolean;                      // Added readOnly prop
  onEditItem?: (id: string) => void;
  onDeleteItem?: (id: string) => void;
  showActions?: boolean;
  className?: string;
}

const LineItemsTable: React.FC<LineItemsTableProps> = ({ 
  items, 
  onChange,
  readOnly = false,
  onEditItem, 
  onDeleteItem,
  showActions = true,
  className = '' 
}) => {
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  
  // If readOnly is true, don't show actions regardless of showActions prop
  const displayActions = readOnly ? false : showActions;
  
  return (
    <div className={`overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg ${className}`}>
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3 pl-4 pr-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              Code
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              Description
            </th>
            <th scope="col" className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
              Qty
            </th>
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
              Unit
            </th>
            <th scope="col" className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
              Unit Price
            </th>
            <th scope="col" className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
              Amount
            </th>
            {displayActions && (
              <th scope="col" className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {items.length > 0 ? (
            items.map(item => (
              <LineItemRow 
                key={item.id} 
                item={item} 
                onEdit={readOnly ? undefined : onEditItem} 
                onDelete={readOnly ? undefined : onDeleteItem}
                showActions={displayActions}
              />
            ))
          ) : (
            <tr>
              <td colSpan={displayActions ? 7 : 6} className="px-4 py-6 text-sm text-gray-500 text-center">
                No items added yet.
              </td>
            </tr>
          )}
        </tbody>
        <tfoot className="bg-gray-50">
          <tr>
            <td colSpan={displayActions ? 5 : 4} className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
              Subtotal:
            </td>
            <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
              {formatCurrency(subtotal)}
            </td>
            {displayActions && <td></td>}
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default LineItemsTable;