import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function InvoiceNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Card className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Invoice Not Found</h2>
        <p className="text-gray-600 mb-6">
          The invoice you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/dashboard/invoices">
          <Button>Back to Invoices</Button>
        </Link>
      </Card>
    </div>
  );
}