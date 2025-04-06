"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/layout/PageHeader';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Toast from '@/components/ui/Toast';
import EmailTemplateEditor from '@/components/settings/EmailTemplateEditor';
import TemplateVariablesList from '@/components/settings/TemplateVariablesList';
import { EmailTemplate, TemplateType } from '@/lib/types/email';

const defaultTemplates: EmailTemplate[] = [
  {
    id: 'invoice_new',
    name: 'New Invoice',
    subject: 'Invoice #{{invoice_number}} from {{company_name}}',
    body: `<p>Dear {{client_name}},</p>
<p>We have issued a new invoice #{{invoice_number}} for {{invoice_total}}.</p>
<p>The invoice is due on {{invoice_due_date}}.</p>
<p>You can view and pay your invoice using the link below:</p>
<p><a href="{{invoice_link}}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Invoice</a></p>
<p>Thank you for your business!</p>
<p>Best regards,<br>{{company_name}}</p>`,
    description: 'Sent when a new invoice is created and ready to be sent to the client.',
    lastUpdated: new Date('2025-03-15')
  },
  {
    id: 'invoice_reminder',
    name: 'Invoice Reminder',
    subject: 'Reminder: Invoice #{{invoice_number}} is due soon',
    body: `<p>Dear {{client_name}},</p>
<p>This is a friendly reminder that invoice #{{invoice_number}} for {{invoice_total}} is due on {{invoice_due_date}}.</p>
<p>If you have already made the payment, please disregard this email.</p>
<p>You can view and pay your invoice using the link below:</p>
<p><a href="{{invoice_link}}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Invoice</a></p>
<p>Thank you for your business!</p>
<p>Best regards,<br>{{company_name}}</p>`,
    description: 'Automatically sent as a reminder a few days before the invoice due date.',
    lastUpdated: new Date('2025-03-15')
  },
  {
    id: 'invoice_paid',
    name: 'Invoice Paid',
    subject: 'Receipt for Invoice #{{invoice_number}}',
    body: `<p>Dear {{client_name}},</p>
<p>Thank you for your payment of {{invoice_total}} for invoice #{{invoice_number}}.</p>
<p>Your payment has been received and processed successfully.</p>
<p>You can view the receipt using the link below:</p>
<p><a href="{{invoice_link}}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Receipt</a></p>
<p>We appreciate your business!</p>
<p>Best regards,<br>{{company_name}}</p>`,
    description: 'Sent as a confirmation when an invoice has been marked as paid.',
    lastUpdated: new Date('2025-03-15')
  },
  {
    id: 'offer_new',
    name: 'New Offer',
    subject: 'New Offer #{{offer_number}} from {{company_name}}',
    body: `<p>Dear {{client_name}},</p>
<p>We're pleased to present our offer #{{offer_number}} for {{offer_total}}.</p>
<p>The offer is valid until {{offer_valid_until}}.</p>
<p>You can view and respond to our offer using the link below:</p>
<p><a href="{{offer_link}}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Offer</a></p>
<p>If you have any questions, please don't hesitate to contact us.</p>
<p>Best regards,<br>{{company_name}}</p>`,
    description: 'Sent when a new offer/proposal is created for a client.',
    lastUpdated: new Date('2025-03-15')
  },
  {
    id: 'offer_accepted',
    name: 'Offer Accepted Confirmation',
    subject: 'Confirmation: Offer #{{offer_number}} Accepted',
    body: `<p>Dear {{client_name}},</p>
<p>Thank you for accepting our offer #{{offer_number}} for {{offer_total}}.</p>
<p>We're excited to work with you on this project!</p>
<p>Our team will be in touch shortly with next steps.</p>
<p>You can view the accepted offer using the link below:</p>
<p><a href="{{offer_link}}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Offer</a></p>
<p>Best regards,<br>{{company_name}}</p>`,
    description: 'Confirmation sent when a client accepts an offer.',
    lastUpdated: new Date('2025-03-15')
  },
  {
    id: 'offer_expired',
    name: 'Offer Expired',
    subject: 'Offer #{{offer_number}} has expired',
    body: `<p>Dear {{client_name}},</p>
<p>Our offer #{{offer_number}} for {{offer_total}} has expired on {{offer_valid_until}}.</p>
<p>If you're still interested, please let us know and we can issue an updated offer.</p>
<p>You can view the expired offer using the link below:</p>
<p><a href="{{offer_link}}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View Offer</a></p>
<p>Best regards,<br>{{company_name}}</p>`,
    description: 'Notification when an offer has expired without being accepted or rejected.',
    lastUpdated: new Date('2025-03-15')
  }
] as EmailTemplate[];

export default function EmailTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<EmailTemplate[]>(defaultTemplates);
  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Initialize with the first template
  useEffect(() => {
    if (templates.length > 0 && !currentTemplate) {
      setCurrentTemplate(templates[0]);
    }
  }, [templates, currentTemplate]);

  const handleSelectTemplate = (templateId: TemplateType) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setCurrentTemplate(template);
    }
  };

  const handleUpdateTemplate = (updates: Partial<EmailTemplate>) => {
    if (!currentTemplate) return;
    
    // Update the current template
    const updatedTemplate = { ...currentTemplate, ...updates, lastUpdated: new Date() };
    
    // Update in the templates array
    const updatedTemplates = templates.map(t => 
      t.id === currentTemplate.id ? updatedTemplate : t
    );
    
    setCurrentTemplate(updatedTemplate);
    setTemplates(updatedTemplates);
    
    // Show success notification
    setNotification({
      type: 'success',
      message: 'Email template updated successfully!'
    });
    
    // In a real app, this is where you would save to the backend
    // saveTemplateToBackend(updatedTemplate);
  };

  const handleResetTemplate = (templateId: TemplateType) => {
    // Find the default template
    const defaultTemplate = defaultTemplates.find(t => t.id === templateId);
    if (!defaultTemplate || !currentTemplate) return;
    
    // Reset to default
    const resetTemplate = { 
      ...defaultTemplate,
      lastUpdated: new Date() 
    };
    
    // Update in templates array
    const updatedTemplates = templates.map(t => 
      t.id === templateId ? resetTemplate : t
    );
    
    setCurrentTemplate(resetTemplate);
    setTemplates(updatedTemplates);
    
    setNotification({
      type: 'success',
      message: 'Email template reset to default!'
    });
  };

  return (
    <div className="p-6">
      <PageHeader 
        title="Email Templates" 
        description="Customize your automated email messages sent to clients"
      />
      
      {notification && (
        <Toast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
          duration={3000}
        />
      )}

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Template Selector */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700">Email Templates</h3>
            </div>
            <ul className="divide-y divide-gray-200">
              {templates.map((template) => (
                <li key={template.id}>
                  <button
                    onClick={() => handleSelectTemplate(template.id as TemplateType)}
                    className={`w-full px-4 py-3 flex items-center text-left text-sm hover:bg-gray-50 transition-colors
                      ${currentTemplate?.id === template.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                  >
                    <div>
                      <p className={`font-medium ${currentTemplate?.id === template.id ? 'text-blue-700' : 'text-gray-900'}`}>
                        {template.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                        {template.description}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </Card>

          <div className="mt-6">
            <TemplateVariablesList />
          </div>
        </div>

        {/* Template Editor */}
        <div className="lg:col-span-3">
          {currentTemplate && (
            <EmailTemplateEditor 
              template={currentTemplate} 
              onUpdate={handleUpdateTemplate}
              onReset={() => handleResetTemplate(currentTemplate.id as TemplateType)}
              onPreview={() => setIsPreviewOpen(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}