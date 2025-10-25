import { Request, Response } from 'express';
import { createPaypalOrder } from '../server/paypal.js';
import { db } from '../server/db.js';
import { pendingOrders } from '../shared/schema.js';
import xss from 'xss';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { donorName, donorEmail, amount, currency, localAmount, localCurrency, campaignId } = req.body;

    const sanitizedDonorName = xss(donorName?.trim() || 'Anonymous');
    const sanitizedDonorEmail = donorEmail ? xss(donorEmail.trim()) : null;

    const numAmount = parseFloat(amount);
    const numLocalAmount = localAmount ? parseFloat(localAmount) : 0;

    if (!numAmount || numAmount <= 0) {
      return res.status(400).json({ error: 'Invalid donation amount' });
    }

    const paypalOrderData = await createPaypalOrder(
      sanitizedDonorName,
      sanitizedDonorEmail,
      numAmount,
      numLocalAmount,
      localCurrency || 'USD',
      campaignId || null
    );

    if (paypalOrderData && paypalOrderData.id && paypalOrderData.status && db) {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 3);
      
      try {
        await db.insert(pendingOrders).values({
          paypalOrderId: paypalOrderData.id,
          donorName: sanitizedDonorName,
          donorEmail: sanitizedDonorEmail,
          amount: numAmount.toString(),
          currency: currency || 'USD',
          localAmount: localAmount?.toString() || null,
          localCurrency: localCurrency || null,
          campaignId: campaignId || null,
          expiresAt: expiresAt,
        });
      } catch (err: any) {
        console.error('Failed to store pending order:', err);
        return res.status(500).json({ error: 'Failed to store order details' });
      }
    }

    res.json(paypalOrderData);
  } catch (error: any) {
    console.error('Order creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create order',
      message: error.message 
    });
  }
}
