import React, { useState } from 'react';
import Card from '@/components/ui/Card';

type Tab = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

interface TabPanelProps {
  tabs: Tab[];
  children: React.ReactNode[];
}

const TabPanel: React.FC<TabPanelProps> = ({ tabs, children }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);

  return (
    <div>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm flex items-center
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="space-y-6">
        {tabs.map((tab, index) => (
          <div 
            key={tab.id}
            className={activeTab === tab.id ? 'block' : 'hidden'}
          >
            {children[index]}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabPanel;