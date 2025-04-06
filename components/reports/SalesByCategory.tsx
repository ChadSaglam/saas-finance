import { getCategoryFromCode } from '@/lib/utils/product-codes';
import { dummyInvoices } from '@/lib/dummy-data/invoices';
import { dummyOffers } from '@/lib/dummy-data/offers';

export default function SalesByCategoryReport() {
  // Combine all items from invoices and offers
  const allItems = [
    ...dummyInvoices.flatMap(inv => inv.items),
    ...dummyOffers.flatMap(offer => offer.items)
  ];
  
  // Group by category
  const salesByCategory = allItems.reduce((acc, item) => {
    const categoryName = item.code ? getCategoryFromCode(item.code) || 'Uncategorized' : 'Uncategorized';
    
    if (!acc[categoryName]) {
      acc[categoryName] = 0;
    }
    acc[categoryName] += item.total;
    return acc;
  }, {} as Record<string, number>);
  
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Sales by Category</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {Object.entries(salesByCategory).map(([category, total]) => (
          <div key={category} className="flex justify-between border-b border-gray-200 p-4">
            <span className="font-medium">{category}</span>
            <span className="text-right">${total.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}