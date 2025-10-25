import { Request, Response } from 'express';
import { db } from '../server/db.js';
import { donations } from '../shared/schema.js';
import { eq, desc, count } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  
  try {
    if (!db) {
      return res.json({
        donations: [],
        total: 0
      });
    }

    const recentDonations = await db.query.donations.findMany({
      where: (donations, { eq }) => eq(donations.status, 'completed'),
      orderBy: (donations, { desc }) => [desc(donations.createdAt)],
      limit: 10,
      columns: {
        donorName: true,
        amount: true,
        currency: true,
        paypalOrderId: true,
        createdAt: true,
      }
    });

    const totalResult = await db
      .select({ count: count() })
      .from(donations)
      .where(eq(donations.status, 'completed'));

    const formattedDonations = recentDonations.map(d => ({
      donorName: d.donorName,
      amount: d.amount.toString(),
      currency: d.currency || 'USD',
      paypalReference: d.paypalOrderId 
        ? `****${d.paypalOrderId.slice(-4)}`
        : '****',
      createdAt: d.createdAt?.toISOString() || new Date().toISOString(),
    }));

    res.json({
      donations: formattedDonations,
      total: totalResult[0]?.count || 0
    });
  } catch (error: any) {
    console.error('Error fetching recent donations:', error);
    res.json({
      donations: [],
      total: 0
    });
  }
}
