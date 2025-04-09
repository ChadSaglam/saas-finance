import React from 'react';

type StatusType = 'invoice' | 'offer';

interface StatusBadgeProps {
  status: string;
  type?: StatusType;
  size?: 'sm' | 'md';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'invoice', size = 'sm' }) => {
  // Determine background and text colors based on status and type
  let colorClasses = '';
  
  if (type === 'invoice') {
    switch (status) {
      case 'paid':
        colorClasses = 'bg-green-100 text-green-800';
        break;
      case 'sent':
        colorClasses = 'bg-blue-100 text-blue-800';
        break;
      case 'overdue':
        colorClasses = 'bg-red-100 text-red-800';
        break;
      case 'cancelled':
        colorClasses = 'bg-gray-100 text-gray-800';
        break;
      case 'draft':
      default:
        colorClasses = 'bg-yellow-100 text-yellow-800';
        break;
    }
  } else {
    switch (status) {
      case 'accepted':
        colorClasses = 'bg-green-100 text-green-800';
        break;
      case 'sent':
        colorClasses = 'bg-blue-100 text-blue-800';
        break;
      case 'rejected':
        colorClasses = 'bg-red-100 text-red-800';
        break;
      case 'expired':
        colorClasses = 'bg-gray-100 text-gray-800';
        break;
      case 'draft':
      default:
        colorClasses = 'bg-yellow-100 text-yellow-800';
        break;
    }
  }
  
  const sizeClasses = size === 'sm' 
    ? 'px-2 text-xs leading-5' 
    : 'px-3 py-1 text-sm';

  return (
    <span className={`${sizeClasses} inline-flex font-semibold rounded-full ${colorClasses}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;