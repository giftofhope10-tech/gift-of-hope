import { Request, Response } from 'express';
import { db } from '../server/db.js';
import { contacts } from '../shared/schema.js';
import { sendContactNotification } from '../server/email.js';
import xss from 'xss';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const sanitizedData = {
      name: xss(name.trim()),
      email: xss(email.trim().toLowerCase()),
      subject: xss(subject.trim()),
      message: xss(message.trim()),
    };

    if (db) {
      await db.insert(contacts).values({
        ...sanitizedData,
        status: 'unread',
      });
    }

    try {
      await sendContactNotification(
        sanitizedData.name,
        sanitizedData.email,
        sanitizedData.subject,
        sanitizedData.message
      );
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }

    res.json({ 
      success: true,
      message: 'Thank you for contacting us. We will get back to you soon!'
    });
  } catch (error: any) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      error: 'Failed to submit contact form',
      message: error.message 
    });
  }
}
