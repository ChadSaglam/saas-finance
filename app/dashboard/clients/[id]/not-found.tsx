import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function ClientNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Card className="text-center max-w-md card-shadow">
        <div className="p-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Client Not Found</h2>
          <p className="text-gray-600 mb-6">
            The client you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/dashboard/clients">
            <Button variant="primary" fullWidth>Back to Clients</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}