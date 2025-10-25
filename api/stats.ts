import { Request, Response } from 'express';
import { db } from '../server/db.js';
import { donations } from '../shared/schema.js';
import { eq, sum } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  try {
    if (!db) {
      return res.json({
        totalDonations: 0,
        totalAmount: 0,
        recentDonations: []
      });
    }

    const result = await db
      .select({ total: sum(donations.amount) })
      .from(donations)
      .where(eq(donations.status, 'COMPLETED'));

    const totalAmount = Number(result[0]?.total || 0);

    const donationsList = await db.query.donations.findMany({
      where: (donations, { eq }) => eq(donations.status, 'COMPLETED'),
      orderBy: (donations, { desc }) => [desc(donations.createdAt)],
      limit: 10,
    });

    const recentDonations = donationsList.map(d => ({
      donorName: d.donorName,
      amount: d.amount,
      date: d.createdAt,
    }));

    res.json({
      totalDonations: donationsList.length,
      totalAmount,
      recentDonations
    });
  } catch (error: any) {
    console.error('Stats error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch stats',
      totalDonations: 0,
      totalAmount: 0,
      recentDonations: []
    });
  }
}
