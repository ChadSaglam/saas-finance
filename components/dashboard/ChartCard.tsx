import React, { ReactNode, memo } from 'react';
import Card from '@/components/ui/Card';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

const ChartCard = memo<ChartCardProps>(({ 
  title, 
  subtitle, 
  children, 
  className = '' 
}) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="p-4 sm:p-5">
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {children}
      </div>
    </Card>
  );
});

ChartCard.displayName = 'ChartCard';

export default ChartCard;