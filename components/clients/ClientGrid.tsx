import { Client } from '@/lib/models';
import ClientCard from './ClientCard';
import { dummyInvoices } from '@/lib/dummy-data/invoices';
import { dummyOffers } from '@/lib/dummy-data/offers';

interface ClientGridProps {
  clients: Client[];
}

export default function ClientGrid({ clients }: ClientGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {clients.map(client => {
        const clientInvoices = dummyInvoices.filter(invoice => 
          typeof invoice.client === 'object' && invoice.client.id === client.id
        );
        
        const clientOffers = dummyOffers.filter(offer => 
          typeof offer.client === 'object' && offer.client.id === client.id
        );
        
        const totalAmount = clientInvoices.reduce((sum, inv) => sum + inv.total, 0);
        
        return (
          <ClientCard 
            key={client.id}
            client={client}
            invoiceCount={clientInvoices.length}
            offerCount={clientOffers.length}
            totalAmount={totalAmount}
          />
        );
      })}
    </div>
  );
}