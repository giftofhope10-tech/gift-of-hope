import { Request, Response } from 'express';
import { capturePaypalOrder } from '../server/paypal.js';
import { db } from '../server/db.js';
import { donations, pendingOrders, campaigns } from '../shared/schema.js';
import { sendDonationReceipt } from '../server/email.js';
import { eq } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let pendingOrderId: number | null = null;

  try {
    let orderID = (req.query.orderID as string) || req.body.orderID;
    
    if (!orderID && req.url) {
      const urlMatch = req.url.match(/\/order\/([^\/]+)\/capture/);
      if (urlMatch && urlMatch[1]) {
        orderID = urlMatch[1].split('?')[0];
      }
    }
    
    console.log('[ORDER-CAPTURE] Request URL:', req.url);
    console.log('[ORDER-CAPTURE] Query params:', req.query);
    console.log('[ORDER-CAPTURE] Starting capture for order:', orderID);

    if (!orderID || !db) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    const pendingOrder = await db.query.pendingOrders.findFirst({
      where: eq(pendingOrders.paypalOrderId, orderID)
    });

    if (!pendingOrder) {
      return res.status(404).json({ error: 'Order not found or expired' });
    }

    pendingOrderId = pendingOrder.id;

    if (pendingOrder.status !== 'pending') {
      return res.status(400).json({ error: 'Order already processed' });
    }

    if (new Date() > new Date(pendingOrder.expiresAt)) {
      await db.update(pendingOrders)
        .set({ status: 'expired' })
        .where(eq(pendingOrders.id, pendingOrder.id));
      return res.status(400).json({ error: 'Order has expired' });
    }

    let captureResponse: any;
    try {
      captureResponse = await capturePaypalOrder(orderID);
    } catch (paypalError: any) {
      await db.update(pendingOrders)
        .set({ status: 'failed' })
        .where(eq(pendingOrders.id, pendingOrder.id));
      return res.status(500).json({ error: 'PayPal capture failed' });
    }

    if (!captureResponse || captureResponse.status !== 'COMPLETED' || !captureResponse.purchase_units) {
      await db.update(pendingOrders)
        .set({ status: 'failed' })
        .where(eq(pendingOrders.id, pendingOrder.id));
      return res.status(500).json({ error: 'Invalid PayPal response' });
    }

    const capture = captureResponse.purchase_units[0]?.payments?.captures?.[0];
    const capturedAmount = capture?.amount?.value;
    const capturedCurrency = capture?.amount?.currency_code;

    if (!capturedAmount || !capturedCurrency) {
      await db.update(pendingOrders)
        .set({ status: 'failed' })
        .where(eq(pendingOrders.id, pendingOrder.id));
      return res.status(500).json({ error: 'Invalid PayPal capture response' });
    }

    if (parseFloat(capturedAmount) !== parseFloat(pendingOrder.amount) || 
        capturedCurrency !== pendingOrder.currency) {
      await db.update(pendingOrders)
        .set({ status: 'failed' })
        .where(eq(pendingOrders.id, pendingOrder.id));
      return res.status(400).json({ error: 'Payment amount/currency mismatch' });
    }

    console.log('[ORDER-CAPTURE] Saving donation to database...');
    console.log('[ORDER-CAPTURE] DB Status:', db ? 'Connected' : 'NOT CONNECTED');
    
    if (!db) {
      console.error('[ORDER-CAPTURE] FATAL: Database not available!');
      throw new Error('Database not available');
    }
    
    const [donation] = await db.insert(donations).values({
      donorName: pendingOrder.donorName,
      donorEmail: pendingOrder.donorEmail || '',
      amount: pendingOrder.amount,
      currency: pendingOrder.currency,
      localAmount: pendingOrder.localAmount,
      localCurrency: pendingOrder.localCurrency,
      paypalOrderId: orderID,
      campaignId: pendingOrder.campaignId,
      status: 'completed',
    }).returning();
    
    if (!donation || !donation.id) {
      console.error('[ORDER-CAPTURE] FATAL: Donation insert returned no data!');
      throw new Error('Failed to save donation');
    }
    
    console.log('[ORDER-CAPTURE] Donation saved successfully:', donation.id);

    await db.update(pendingOrders)
      .set({ status: 'completed' })
      .where(eq(pendingOrders.id, pendingOrder.id));

    if (pendingOrder.campaignId && donation) {
      const campaign = await db.query.campaigns.findFirst({
        where: eq(campaigns.id, pendingOrder.campaignId)
      });
      
      if (campaign) {
        const newAmount = (parseFloat(campaign.currentAmount) + parseFloat(pendingOrder.amount)).toString();
        await db.update(campaigns)
          .set({ currentAmount: newAmount })
          .where(eq(campaigns.id, pendingOrder.campaignId));
      }
    }

    if (pendingOrder.donorEmail && donation) {
      try {
        await sendDonationReceipt(
          pendingOrder.donorEmail,
          pendingOrder.donorName,
          pendingOrder.amount,
          pendingOrder.currency,
          donation.id,
          new Date().toLocaleDateString()
        );
      } catch (emailError: any) {
        console.error('Email send failed:', emailError.message);
      }
    }

    return res.json(captureResponse);

  } catch (error: any) {
    console.error('Order capture error:', error);
    
    if (db && pendingOrderId) {
      await db.update(pendingOrders)
        .set({ status: 'failed' })
        .where(eq(pendingOrders.id, pendingOrderId))
        .catch((cleanupError) => {
          console.error('Failed to mark order as failed:', cleanupError);
        });
    }
    
    return res.status(500).json({ 
      error: 'Payment capture failed',
      message: error.message 
    });
  }
}
