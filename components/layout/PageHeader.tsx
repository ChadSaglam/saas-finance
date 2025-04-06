import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions }) => {
  return (
    <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
        {description && (
          <p className="mt-2 text-sm text-gray-600 max-w-4xl">{description}</p>
        )}
      </div>
      {actions && (
        <div className="mt-3 flex sm:mt-0 sm:ml-4">{actions}</div>
      )}
    </div>
  );
};

export default PageHeader;