"use client"; // Add this directive to mark it as a Client Component

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import { TemplateVariable } from '@/lib/types/email';
import Toast from '@/components/ui/Toast';

const templateVariables: TemplateVariable[] = [
  {
    name: 'Company Name',
    placeholder: '{{company_name}}',
    description: 'Your company name as set in company settings',
    context: 'all'
  },
  {
    name: 'Client Name',
    placeholder: '{{client_name}}',
    description: 'Full name of the client',
    context: 'all'
  },
  {
    name: 'Invoice Number',
    placeholder: '{{invoice_number}}',
    description: 'The invoice reference number',
    context: 'invoice'
  },
  {
    name: 'Invoice Total',
    placeholder: '{{invoice_total}}',
    description: 'The total amount of the invoice',
    context: 'invoice'
  },
  {
    name: 'Invoice Due Date',
    placeholder: '{{invoice_due_date}}',
    description: 'The due date for payment',
    context: 'invoice'
  },
  {
    name: 'Invoice Link',
    placeholder: '{{invoice_link}}',
    description: 'Link to view the invoice online',
    context: 'invoice'
  },
  {
    name: 'Offer Number',
    placeholder: '{{offer_number}}',
    description: 'The offer reference number',
    context: 'offer'
  },
  {
    name: 'Offer Total',
    placeholder: '{{offer_total}}',
    description: 'The total amount of the offer',
    context: 'offer'
  },
  {
    name: 'Offer Valid Until',
    placeholder: '{{offer_valid_until}}',
    description: 'The date until the offer is valid',
    context: 'offer'
  },
  {
    name: 'Offer Link',
    placeholder: '{{offer_link}}',
    description: 'Link to view the offer online',
    context: 'offer'
  },
];

const TemplateVariablesList: React.FC = () => {
  const [copiedVariable, setCopiedVariable] = useState<string | null>(null);

  const handleCopyVariable = (placeholder: string) => {
    navigator.clipboard.writeText(placeholder)
      .then(() => {
        setCopiedVariable(placeholder);
        setTimeout(() => setCopiedVariable(null), 2000);
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  };

  return (
    <Card>
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700">Available Variables</h3>
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-500 mb-3">
          Use these variables in your templates to add dynamic content
        </p>
        
        <div className="space-y-4">
          {['all', 'invoice', 'offer', 'client'].map((context) => (
            <div key={context}>
              <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">
                {context === 'all' ? 'General' : `${context.charAt(0).toUpperCase() + context.slice(1)} Variables`}
              </h4>
              <ul className="space-y-2">
                {templateVariables
                  .filter(variable => variable.context === context)
                  .map((variable) => (
                    <li key={variable.placeholder} className="text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700">{variable.name}</span>
                        <code 
                          className={`text-xs px-1.5 py-0.5 rounded font-mono cursor-pointer transition-colors ${
                            copiedVariable === variable.placeholder 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-gray-100 text-blue-600 hover:bg-gray-200'
                          }`}
                          onClick={() => handleCopyVariable(variable.placeholder)}
                          title="Click to copy"
                        >
                          {copiedVariable === variable.placeholder ? 'Copied!' : variable.placeholder}
                        </code>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{variable.description}</p>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      
      {/* Toast notification for copy feedback */}
      {copiedVariable && (
        <div className="fixed bottom-4 right-4 z-50">
          <Toast
            type="success"
            message={`Copied ${copiedVariable} to clipboard!`}
            onClose={() => setCopiedVariable(null)}
            duration={2000}
          />
        </div>
      )}
    </Card>
  );
};

export default TemplateVariablesList;