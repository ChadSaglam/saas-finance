import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function OfferNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Card className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Price Offer Not Found</h2>
        <p className="text-gray-600 mb-6">
          The price offer you're looking for doesn't exist or has been removed.
        </p>
        <Link href="/dashboard/offers">
          <Button>Back to Price Offers</Button>
        </Link>
      </Card>
    </div>
  );
}