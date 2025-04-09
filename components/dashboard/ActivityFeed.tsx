"use client";

import React, { useState, useEffect, memo } from 'react';
import Card from '@/components/ui/Card';
import { formatRelativeTime } from '@/lib/utils/format';

interface ActivityMeta {
  status?: string;
  amount?: number;
  entityId?: string;
}

interface Activity {
  id: string;
  type: 'invoice' | 'offer' | 'client' | 'payment' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  meta?: ActivityMeta;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityIcon = memo(({ type }: { type: Activity['type'] }) => {
  switch (type) {
    case 'invoice':
      return (
        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
          <svg className="h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
      );
    case 'offer':
      return (
        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
          <svg className="h-4 w-4 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
          </svg>
        </div>
      );
    case 'client':
      return (
        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        </div>
      );
    case 'payment':
      return (
        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 01-.75.75h-.75m-6-1.5H2.25M6.75 7.5H3v3h3.75m3-6H21v3h-7.5" />
          </svg>
        </div>
      );
    default:
      return (
        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
        </div>
      );
  }
});

ActivityIcon.displayName = 'ActivityIcon';

const StatusBadge = memo(({ status }: { status?: string }) => {
  if (!status) return null;
  
  let bgColor = '';
  switch (status) {
    case 'paid':
    case 'accepted':
      bgColor = 'bg-green-100 text-green-800';
      break;
    case 'sent':
      bgColor = 'bg-blue-100 text-blue-800';
      break;
    case 'overdue':
    case 'rejected':
      bgColor = 'bg-red-100 text-red-800';
      break;
    case 'draft':
      bgColor = 'bg-yellow-100 text-yellow-800';
      break;
    default:
      bgColor = 'bg-gray-100 text-gray-800';
  }
  
  return (
    <span className={`px-2 py-1 text-xs rounded-full ${bgColor}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';

const ActivityItem = memo(({ activity, isClient }: { activity: Activity, isClient: boolean }) => {
  const formattedTime = isClient 
    ? formatRelativeTime(activity.timestamp)
    : "Recently";

  return (
    <div className="pb-4 mb-4 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0">
      <div className="flex">
        <ActivityIcon type={activity.type} />
        <div className="ml-4 flex-1">
          <div className="flex justify-between items-start mb-1">
            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
            {activity.meta?.status && <StatusBadge status={activity.meta.status} />}
          </div>
          <p className="text-sm text-gray-500">{activity.description}</p>
          <p className="mt-1 text-xs text-gray-400">{formattedTime}</p>
        </div>
      </div>
    </div>
  );
});

ActivityItem.displayName = 'ActivityItem';

const ActivityFeed = memo<ActivityFeedProps>(({ activities }) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Card>
      <div className="flex justify-between items-center mb-4 p-4 pb-0">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <button className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
          View all
        </button>
      </div>
      
      <div className="px-4 pb-4">
        {activities.map((activity) => (
          <ActivityItem 
            key={activity.id} 
            activity={activity} 
            isClient={isClient} 
          />
        ))}
        
        {activities.length === 0 && (
          <div className="py-6 text-center text-gray-500">
            <p>No recent activity</p>
          </div>
        )}
      </div>
    </Card>
  );
});

ActivityFeed.displayName = 'ActivityFeed';

export default ActivityFeed;