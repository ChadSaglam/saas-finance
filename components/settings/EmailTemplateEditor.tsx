"use client";

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { EmailTemplate } from '@/lib/types/email';

interface EmailTemplateEditorProps {
  template: EmailTemplate;
  onUpdate: (updates: Partial<EmailTemplate>) => void;
  onReset: () => void;
  onPreview: () => void;
}

const EmailTemplateEditor: React.FC<EmailTemplateEditorProps> = ({
  template,
  onUpdate,
  onReset,
  onPreview
}) => {
  const [subject, setSubject] = useState(template.subject);
  const [body, setBody] = useState(template.body);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewData, setPreviewData] = useState({
    company_name: 'Your Company Name',
    client_name: 'Sample Client',
    invoice_number: 'INV-2025-001',
    invoice_total: '$1,500.00',
    invoice_due_date: '2025-05-01',
    invoice_link: '#',
    offer_number: 'OFF-2025-001',
    offer_total: '$3,200.00',
    offer_valid_until: '2025-04-30',
    offer_link: '#',
  });
  
  // Update local state when template changes
  useEffect(() => {
    setSubject(template.subject);
    setBody(template.body);
  }, [template]);

  const handleSave = () => {
    onUpdate({
      subject,
      body
    });
  };

  const handleReset = () => {
    setIsResetModalOpen(false);
    onReset();
  };

  // Replaces template variables with actual values for preview
  const getPreviewContent = (text: string) => {
    let result = text;
    Object.entries(previewData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value);
    });
    return result;
  };

  return (
    <>
      <Card>
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 sm:flex sm:items-center sm:justify-between">
          <h3 className="text-base font-medium text-gray-900">
            {template.name}
          </h3>
          <div className="mt-3 flex sm:mt-0">
            <span className="text-sm text-gray-500">
              {template.lastUpdated ? (
                <>Last updated: {new Date(template.lastUpdated).toLocaleDateString()}</>
              ) : 'Not modified yet'}
            </span>
          </div>
        </div>
        <div className="p-4 space-y-6">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject Line
            </label>
            <input
              type="text"
              id="subject"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-500">
              Use {'{{variable_name}}'} to insert dynamic content
            </p>
          </div>
          
          <div>
            <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
              Email Body (HTML)
            </label>
            <div className="border border-gray-300 rounded-md">
              <textarea
                id="body"
                rows={12}
                className="block w-full rounded-md border-0 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              You can use basic HTML tags and {'{{variable_name}}'} placeholders
            </p>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button 
              onClick={() => setIsResetModalOpen(true)} 
              variant="secondary"
              type="button"
            >
              Reset to Default
            </Button>
            <div className="space-x-3">
              <Button 
                onClick={() => setIsPreviewModalOpen(true)} 
                variant="outline"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </Button>
              <Button 
                onClick={handleSave}
                type="button"
              >
                Save Template
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Reset Confirmation Modal */}
      <Modal 
        isOpen={isResetModalOpen} 
        onClose={() => setIsResetModalOpen(false)} 
        title="Reset Template"
      >
        <div className="p-6">
          <p className="text-sm text-gray-600">
            Are you sure you want to reset this email template to its default content?
            This will discard all your changes.
          </p>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
          <Button
            onClick={handleReset}
            variant="danger"
            className="w-full sm:w-auto sm:ml-3"
          >
            Reset Template
          </Button>
          <Button
            onClick={() => setIsResetModalOpen(false)}
            variant="outline"
            className="mt-3 sm:mt-0 w-full sm:w-auto"
          >
            Cancel
          </Button>
        </div>
      </Modal>
      
      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title="Email Preview"
        size="lg"
      >
        <div className="p-6">
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Subject:</h4>
            <p className="text-sm text-gray-900">{getPreviewContent(subject)}</p>
          </div>
          
          <div className="border border-gray-200 rounded-lg">
            <div className="p-4 max-h-96 overflow-y-auto">
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: getPreviewContent(body) }}
              />
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-xs text-gray-500">
              This is a preview with sample data. Actual emails will use data from your invoices and clients.
            </p>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-200">
          <Button
            onClick={() => setIsPreviewModalOpen(false)}
            className="w-full sm:w-auto"
          >
            Close Preview
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default EmailTemplateEditor;