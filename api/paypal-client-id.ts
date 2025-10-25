import { Request, Response } from 'express';

export default function handler(req: Request, res: Response) {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  
  if (!clientId) {
    console.error('PAYPAL_CLIENT_ID environment variable not set');
    return res.status(500).json({ 
      error: 'PayPal configuration missing',
      message: 'PAYPAL_CLIENT_ID not configured'
    });
  }
  
  res.json({ clientId });
}
