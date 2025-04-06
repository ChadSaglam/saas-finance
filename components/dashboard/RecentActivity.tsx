import Link from "next/link";

const recentInvoices = [
  { id: '1', number: 'INV-001', client: 'Acme Inc.', amount: 1200, status: 'paid' },
  { id: '2', number: 'INV-002', client: 'Globex Corp', amount: 850, status: 'pending' },
  { id: '3', number: 'INV-003', client: 'Wayne Enterprises', amount: 3200, status: 'overdue' },
];

const recentOffers = [
  { id: '1', title: 'Website Redesign', client: 'Acme Inc.', amount: 2500, status: 'sent' },
  { id: '2', title: 'Marketing Campaign', client: 'Globex Corp', amount: 1800, status: 'draft' },
];

export function RecentActivity() {
  return (
    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Invoices</h2>
        <ul className="space-y-3">
          {recentInvoices.map(invoice => (
            <li key={invoice.id} className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium">{invoice.number}</p>
                <p className="text-sm text-gray-500">{invoice.client}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${invoice.amount.toLocaleString()}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 
                  invoice.status === 'overdue' ? 'bg-red-100 text-red-800' : 
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {invoice.status.toUpperCase()}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-right">
          <Link href="/invoices" className="text-blue-600 hover:underline">View all invoices</Link>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Recent Offers</h2>
        <ul className="space-y-3">
          {recentOffers.map(offer => (
            <li key={offer.id} className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-medium">{offer.title}</p>
                <p className="text-sm text-gray-500">{offer.client}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">${offer.amount.toLocaleString()}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  offer.status === 'sent' ? 'bg-blue-100 text-blue-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {offer.status.toUpperCase()}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-right">
          <Link href="/offers" className="text-blue-600 hover:underline">View all offers</Link>
        </div>
      </div>
    </div>
  );
}