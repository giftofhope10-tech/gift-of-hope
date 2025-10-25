import { Resend } from 'resend';

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

interface EmailSendResult {
  success: boolean;
  message?: string;
  data?: any;
  error?: any;
}

async function sendEmailWithRetry(
  emailData: any,
  maxRetries: number = 2
): Promise<EmailSendResult> {
  if (!process.env.RESEND_API_KEY) {
    return { success: false, message: 'Email service not configured' };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const sendPromise = resend.emails.send(emailData);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email send timeout after 10 seconds')), 10000)
      );
      
      const result = await Promise.race([sendPromise, timeoutPromise]) as any;
      const { data, error } = result;

      if (error) {
        if (error.message && error.message.includes('rate limit')) {
          if (attempt < maxRetries) {
            await sleep(1000);
            continue;
          }
        }
        
        if (error.message && (error.message.includes('Not authorized') || error.message.includes('invalid') || error.message.includes('not verified'))) {
          return { success: false, message: error.message, error };
        }
        
        if (attempt < maxRetries) {
          await sleep(1000);
          continue;
        }
        
        return { success: false, message: error.message || 'Failed to send email', error };
      }

      return { success: true, data };
      
    } catch (error: any) {
      if (attempt < maxRetries) {
        await sleep(1000);
        continue;
      }
      
      return { 
        success: false, 
        message: error.message || 'Failed to send email', 
        error 
      };
    }
  }

  return { success: false, message: 'All retry attempts exhausted' };
}

export async function sendDonationReceipt(
  recipientEmail: string,
  donorName: string,
  amount: string,
  currency: string,
  donationId: number,
  date: string
) {
  if (!process.env.RESEND_API_KEY) {
    return { success: false, message: 'Email service not configured' };
  }

  if (!validateEmail(recipientEmail)) {
    return { success: false, message: 'Invalid email address format' };
  }

  const formattedAmount = parseFloat(amount).toFixed(2);
  const formattedAmountWithCommas = parseFloat(formattedAmount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const emailData = {
    from: 'Gift of Hope <receipt@giftofhope.online>',
    to: [recipientEmail],
    subject: 'Thank You for Your Donation - Gift of Hope',
    replyTo: 'support@giftofhope.online',
    headers: {
      'X-Entity-Ref-ID': `donation-${donationId}-${Date.now()}`
    },
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6; 
            color: #1f2937;
            background-color: #f3f4f6;
            padding: 20px;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center;
          }
          .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
          }
          .header p {
            font-size: 16px;
            opacity: 0.95;
          }
          .content { 
            padding: 40px 30px;
            background: white;
          }
          .greeting {
            font-size: 18px;
            color: #1f2937;
            margin-bottom: 20px;
          }
          .message {
            color: #4b5563;
            margin-bottom: 30px;
            line-height: 1.8;
          }
          .receipt-box { 
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
            padding: 25px;
            border-radius: 10px;
            margin: 30px 0;
            border-left: 4px solid #8B5CF6;
          }
          .receipt-box h2 {
            color: #1f2937;
            font-size: 20px;
            margin-bottom: 20px;
            font-weight: 600;
          }
          .receipt-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #d1d5db;
          }
          .receipt-item:last-child {
            border-bottom: none;
          }
          .receipt-label {
            color: #6b7280;
            font-weight: 500;
          }
          .receipt-value {
            color: #1f2937;
            font-weight: 600;
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: break-word;
            max-width: 250px;
          }
          .amount { 
            font-size: 32px; 
            color: #8B5CF6; 
            font-weight: bold;
            word-wrap: break-word;
            overflow-wrap: break-word;
            word-break: break-word;
          }
          .impact-section {
            margin: 30px 0;
          }
          .impact-section h3 {
            color: #1f2937;
            font-size: 18px;
            margin-bottom: 15px;
            font-weight: 600;
          }
          .impact-list {
            list-style: none;
            padding: 0;
          }
          .impact-list li {
            padding: 12px 0;
            padding-left: 35px;
            position: relative;
            color: #4b5563;
          }
          .impact-list li::before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #10b981;
            font-weight: bold;
            font-size: 20px;
          }
          .closing {
            margin-top: 30px;
            color: #4b5563;
            line-height: 1.8;
          }
          .signature {
            margin-top: 15px;
            color: #1f2937;
            font-weight: 600;
          }
          .footer { 
            text-align: center; 
            background: #f9fafb;
            padding: 30px;
            border-top: 1px solid #e5e7eb;
          }
          .footer-links {
            color: #6b7280;
            margin-bottom: 15px;
            font-size: 14px;
          }
          .footer-note {
            color: #9ca3af;
            font-size: 13px;
            font-style: italic;
          }
          .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
            margin: 25px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💜 Thank You for Your Generosity!</h1>
            <p>Together, we bring hope to every heart</p>
          </div>
          <div class="content">
            <p class="greeting">Dear ${donorName},</p>
            <p class="message">
              We are deeply grateful for your generous donation to Gift of Hope. Your contribution will help us continue our mission to support families worldwide through food, education, and healthcare programs.
            </p>
            
            <div class="receipt-box">
              <h2>📄 Donation Receipt</h2>
              <div class="receipt-item">
                <span class="receipt-label">Receipt Number</span>
                <span class="receipt-value">#${donationId}</span>
              </div>
              <div class="receipt-item">
                <span class="receipt-label">Date</span>
                <span class="receipt-value">${date}</span>
              </div>
              <div class="receipt-item">
                <span class="receipt-label">Donor</span>
                <span class="receipt-value">${donorName}</span>
              </div>
              <div class="receipt-item">
                <span class="receipt-label">Amount</span>
                <span class="amount">${currency} ${formattedAmountWithCommas}</span>
              </div>
            </div>

            <div class="divider"></div>

            <div class="impact-section">
              <h3>🌟 Your Impact</h3>
              <p class="message">Your donation will directly support our three core programs:</p>
              <ul class="impact-list">
                <li><strong>Food Distribution</strong> - Providing nutritious meals to families in need</li>
                <li><strong>Education Support</strong> - Empowering children through quality learning</li>
                <li><strong>Healthcare Services</strong> - Delivering essential medical care to communities</li>
              </ul>
            </div>

            <div class="divider"></div>

            <p class="closing">
              Together, we bring hope to every heart. Thank you for being part of our mission and making a real difference in the lives of those who need it most.
            </p>

            <p class="signature">
              With heartfelt gratitude,<br>
              <strong>The Gift of Hope Team</strong>
            </p>
          </div>
          <div class="footer">
            <p class="footer-links">
              Gift of Hope | support@giftofhope.online | www.giftofhope.online
            </p>
            <p class="footer-note">
              This email serves as your official donation receipt for tax purposes.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Dear ${donorName},

We are deeply grateful for your generous donation to Gift of Hope. Your contribution will help us continue our mission to support families worldwide through food, education, and healthcare programs.

DONATION RECEIPT
================
Receipt Number: #${donationId}
Date: ${date}
Donor: ${donorName}
Amount: ${currency} ${formattedAmountWithCommas}

YOUR IMPACT
===========
Your donation will directly support our three core programs:

✓ Food Distribution - Providing nutritious meals to families in need
✓ Education Support - Empowering children through quality learning
✓ Healthcare Services - Delivering essential medical care to communities

Together, we bring hope to every heart. Thank you for being part of our mission and making a real difference in the lives of those who need it most.

With heartfelt gratitude,
The Gift of Hope Team

---
Gift of Hope | support@giftofhope.online | www.giftofhope.online
This email serves as your official donation receipt for tax purposes.
    `
  };

  return await sendEmailWithRetry(emailData, 2);
}

export async function sendContactNotification(
  name: string,
  email: string,
  subject: string,
  message: string
) {
  if (!process.env.RESEND_API_KEY) {
    return { success: false, message: 'Email service not configured' };
  }

  if (!validateEmail(email)) {
    return { success: false, message: 'Invalid email address format' };
  }

  const emailData = {
    from: 'Gift of Hope <support@giftofhope.online>',
    to: ['support@giftofhope.online'],
    replyTo: email,
    subject: `New Contact Message: ${subject}`,
    headers: {
      'X-Entity-Ref-ID': `contact-${Date.now()}`
    },
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6; 
            color: #1f2937;
            background-color: #f3f4f6;
            padding: 20px;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); 
            color: white; 
            padding: 30px; 
            text-align: center;
          }
          .header h2 {
            font-size: 24px;
            font-weight: 600;
          }
          .content { 
            padding: 30px;
          }
          .info-box {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #3b82f6;
          }
          .info-item {
            padding: 8px 0;
          }
          .label {
            color: #6b7280;
            font-weight: 500;
            display: inline-block;
            width: 80px;
          }
          .value {
            color: #1f2937;
            font-weight: 600;
          }
          .message-box {
            background: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            white-space: pre-wrap;
            line-height: 1.8;
          }
          .footer {
            text-align: center;
            padding: 20px;
            background: #f9fafb;
            border-top: 1px solid #e5e7eb;
            color: #9ca3af;
            font-size: 13px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📬 New Contact Form Submission</h2>
          </div>
          <div class="content">
            <div class="info-box">
              <div class="info-item">
                <span class="label">From:</span>
                <span class="value">${name}</span>
              </div>
              <div class="info-item">
                <span class="label">Email:</span>
                <span class="value">${email}</span>
              </div>
              <div class="info-item">
                <span class="label">Subject:</span>
                <span class="value">${subject}</span>
              </div>
            </div>
            
            <h3 style="color: #1f2937; margin: 20px 0 10px 0;">Message:</h3>
            <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
          </div>
          <div class="footer">
            Sent from Gift of Hope Contact Form
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
NEW CONTACT FORM SUBMISSION
===========================

From: ${name}
Email: ${email}
Subject: ${subject}

Message:
--------
${message}

---
Sent from Gift of Hope Contact Form
    `
  };

  return await sendEmailWithRetry(emailData, 2);
}
