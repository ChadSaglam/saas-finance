"use client";

import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import OfferForm from '@/components/offers/OfferForm';
import { dummyOffers } from '@/lib/dummy-data/offers';
import { usePageParams } from '@/lib/hooks/usePageParams';

export default function EditOfferPage() {
  const params = usePageParams();

  const id = params.id;
  const offer = dummyOffers.find(o => o.id === id);
  
  if (!offer) {
    notFound();
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Price Offer {offer.offerNumber}</h1>
        <Link href={`/dashboard/offers/${offer.id}`}>
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>
      
      <Card>
        <OfferForm initialData={offer} isEditing={true} />
      </Card>
    </div>
  );
}