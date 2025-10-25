import { Request, Response } from 'express';
import { db } from '../server/db.js';

export default async function handler(req: Request, res: Response) {
  try {
    if (!db) {
      return res.status(503).json({ 
        error: 'Database not configured',
        campaigns: [] 
      });
    }

    const activeCampaigns = await db.query.campaigns.findMany({
      where: (campaigns, { eq }) => eq(campaigns.isActive, true),
      orderBy: (campaigns, { desc }) => [desc(campaigns.createdAt)],
    });

    res.json({ campaigns: activeCampaigns });
  } catch (error: any) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ 
      error: 'Failed to fetch campaigns',
      campaigns: [] 
    });
  }
}
