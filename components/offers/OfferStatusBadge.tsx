import { Offer } from '@/lib/models';

interface OfferStatusBadgeProps {
  status: Offer['status'];
  size?: 'sm' | 'md' | 'lg';
  isExpired?: boolean;
}

export default function OfferStatusBadge({ status, size = 'sm', isExpired = false }: OfferStatusBadgeProps) {
  const statusColors = {
    draft: 'bg-yellow-100 text-yellow-800',
    sent: 'bg-blue-100 text-blue-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    expired: 'bg-gray-100 text-gray-800',
  };
  
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };
  
  const displayStatus = isExpired && status !== 'accepted' && status !== 'rejected' ? 'expired' : status;
  
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${statusColors[displayStatus]} ${sizeClasses[size]}`}>
      {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
    </span>
  );
}