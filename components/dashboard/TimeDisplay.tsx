"use client";

import React, { useState, useEffect } from 'react';
import { formatRelativeTime } from '@/lib/utils/format';

interface TimeDisplayProps {
  date: Date;
  className?: string;
}

const TimeDisplay: React.FC<TimeDisplayProps> = ({ date, className = '' }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  
  // Use a stable date format for initial render, switch to relative time after hydration
  if (!isHydrated) {
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return <span className={className}>{formattedDate}</span>;
  }
  
  return <span className={className}>{formatRelativeTime(date)}</span>;
};

export default TimeDisplay;