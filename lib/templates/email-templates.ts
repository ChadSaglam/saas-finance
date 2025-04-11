export function getVerificationEmailTemplate(code: string, name: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verification Code</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          padding: 20px;
          max-width: 600px;
          margin: 0 auto;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background-color: #1a56db;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
        }
        .code {
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 5px;
          text-align: center;
          margin: 30px 0;
          color: #1a56db;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #666;
          padding: 15px;
          border-top: 1px solid #eee;
        }
        .note {
          background-color: #f8fafc;
          padding: 15px;
          border-radius: 6px;
          margin-top: 20px;
          font-size: 14px;
          color: #64748b;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>InvoicePro</h1>
        </div>
        <div class="content">
          <h2>Verification Required</h2>
          <p>Hello ${name},</p>
          <p>To continue signing in to your InvoicePro account, please use the verification code below:</p>
          
          <div class="code">${code}</div>
          
          <p>This code will expire in 10 minutes.</p>
          
          <div class="note">
            <strong>Security Tip:</strong> Never share this code with anyone. InvoicePro representatives will never ask for your verification code.
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} InvoicePro. All rights reserved.</p>
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}