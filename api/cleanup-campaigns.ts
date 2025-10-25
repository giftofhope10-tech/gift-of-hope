import { Request, Response } from 'express';
import { db } from '../server/db.js';
import { campaigns } from '../shared/schema.js';
import { eq, lt, isNotNull, and } from 'drizzle-orm';

export default async function handler(req: Request, res: Response) {
  const authHeader = req.headers['authorization'];
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    if (!db) {
      return res.json({ success: true, deleted: 0, message: 'Database not configured' });
    }

    const now = new Date();
    const expiredCampaigns = await db.query.campaigns.findMany({
      where: (campaigns, { and, lt, isNotNull }) => 
        and(
          lt(campaigns.endDate, now),
          isNotNull(campaigns.endDate)
        )
    });

    let deletedCount = 0;
    for (const campaign of expiredCampaigns) {
      await db.delete(campaigns).where(eq(campaigns.id, campaign.id));
      deletedCount++;
    }

    return res.json({
      success: true,
      deleted: deletedCount,
      timestamp: now.toISOString()
    });
  } catch (error: any) {
    console.error('Cleanup error:', error);
    return res.status(500).json({
      success: false,
      error: 'Cleanup failed',
      message: error.message
    });
  }
}
