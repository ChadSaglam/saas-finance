import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ClientForm from '@/components/clients/ClientForm';

export default function CreateClientPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Add New Client</h1>
        <Link href="/dashboard/clients">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>
      
      <Card>
        <ClientForm />
      </Card>
    </div>
  );
}