import { Request, Response } from 'express';
import { createPaypalOrder } from '../server/paypal.js';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { donorName, donorEmail, amount, localAmount, localCurrency, campaignId } = req.body;

    const numAmount = parseFloat(amount);
    const numLocalAmount = localAmount ? parseFloat(localAmount) : 0;

    if (!numAmount || numAmount <= 0) {
      return res.status(400).json({ error: 'Invalid donation amount' });
    }

    const order = await createPaypalOrder(
      donorName,
      donorEmail,
      numAmount,
      numLocalAmount,
      localCurrency,
      campaignId
    );

    res.json(order);
  } catch (error: any) {
    console.error('Order creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create order',
      message: error.message 
    });
  }
}
