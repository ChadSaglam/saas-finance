import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import InvoiceForm from '@/components/invoices/InvoiceForm';

export default function CreateInvoicePage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Create New Invoice</h1>
        <Link href="/dashboard/invoices">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>
      
      <Card>
        <InvoiceForm />
      </Card>
    </div>
  );
}