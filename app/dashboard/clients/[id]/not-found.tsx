import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function ClientNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Card className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Client Not Found</h2>
        <p className="text-gray-600 mb-6">
          The client you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/dashboard/clients">
          <Button>Back to Clients</Button>
        </Link>
      </Card>
    </div>
  );
}