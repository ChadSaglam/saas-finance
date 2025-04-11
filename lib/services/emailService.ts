import nodemailer from 'nodemailer';

// Import from your templates file
import { getVerificationEmailTemplate } from '@/lib/templates/email-templates';

// Type definitions for better TypeScript support
interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

/**
 * Email service for sending transactional emails
 * Uses Nodemailer with SMTP configuration from environment variables
 */
class EmailService {
  // Fix TypeScript error with definite assignment operator
  private transporter!: nodemailer.Transporter;
  private initialized: boolean = false;
  
  constructor() {
    this.initialize();
  }
  
  /**
   * Initialize the SMTP transporter
   * Called automatically on service creation
   */
  public initialize(): void {
    try {
      // Check for required configuration
      if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
        console.warn('Email service not fully configured. Some features may not work.');
        this.initialized = false;
        return;
      }
      
      // Create the transporter with environment configuration
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });
      
      // Verify connection in development
      if (process.env.NODE_ENV === 'development') {
        this.verifyConnection();
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize email service:', error);
      this.initialized = false;
    }
  }
  
  /**
   * Verify the SMTP connection
   */
  private verifyConnection(): void {
    this.transporter.verify((error) => {
      if (error) {
        console.error('SMTP connection error:', error);
      } else {
        console.log('SMTP server is ready to send emails');
      }
    });
  }
  
  /**
   * Send an email
   * 
   * @param options - Email options
   * @returns Promise with sending result
   */
  public async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (!this.initialized) {
        console.warn('Email service not initialized. Check your configuration.');
        return false;
      }
      
      // Send email
      const info = await this.transporter.sendMail({
        from: `"InvoicePro Security" <${process.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });
      
      console.log('Email sent successfully:', info.messageId);
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }
  
  /**
   * Send a verification code
   * 
   * @param to - Recipient email
   * @param code - Verification code
   * @param name - Recipient name
   * @returns Promise with sending result
   */
  public async sendVerificationCode(to: string, code: string, name: string): Promise<boolean> {
    const subject = 'Your InvoicePro Verification Code';
    const text = `Hello ${name}, Your verification code is: ${code}. This code will expire in 10 minutes.`;
    const html = getVerificationEmailTemplate(code, name);
    
    return this.sendEmail({
      to,
      subject,
      text,
      html
    });
  }
}

// Create singleton instance for the application
const emailService = new EmailService();

export default emailService;