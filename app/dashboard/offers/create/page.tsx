import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import OfferForm from '@/components/offers/OfferForm';

export default function CreateOfferPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Create New Price Offer</h1>
        <Link href="/dashboard/offers">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>
      
      <Card>
        <OfferForm />
      </Card>
    </div>
  );
}