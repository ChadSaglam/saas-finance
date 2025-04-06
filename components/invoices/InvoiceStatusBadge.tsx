import { Invoice } from '@/lib/models';

interface InvoiceStatusBadgeProps {
  status: Invoice['status'];
  size?: 'sm' | 'md' | 'lg';
}

export default function InvoiceStatusBadge({ status, size = 'sm' }: InvoiceStatusBadgeProps) {
  const statusColors = {
    draft: 'bg-yellow-100 text-yellow-800',
    sent: 'bg-blue-100 text-blue-800',
    paid: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };
  
  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };
  
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${statusColors[status]} ${sizeClasses[size]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}