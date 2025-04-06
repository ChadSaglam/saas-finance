import Link from 'next/link';
import { Client } from '@/lib/models';

interface ClientCardProps {
  client: Client;
  invoiceCount: number;
  offerCount: number;
  totalAmount: number;
}

export default function ClientCard({ client, invoiceCount, offerCount, totalAmount }: ClientCardProps) {
  return (
    <Link href={`/dashboard/clients/${client.id}`}>
      <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200 hover:border-blue-500 transition-colors cursor-pointer">
        <div className="flex flex-col h-full">
          <h3 className="text-lg font-medium text-gray-900 mb-1">{client.name}</h3>
          <p className="text-sm text-gray-500 mb-4">{client.contactPerson}</p>
          
          <div className="mt-auto">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Invoices:</span>
              <span className="font-medium">{invoiceCount}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">Offers:</span>
              <span className="font-medium">{offerCount}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
              <span className="text-gray-500">Total:</span>
              <span className="font-semibold text-blue-600">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}