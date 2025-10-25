import app from './app.js';
import { db } from './db.js';
import { campaigns } from '../shared/schema.js';
import { eq } from 'drizzle-orm';

const PORT = 3001;

const cleanupExpiredCampaigns = async () => {
  try {
    if (!db) return;

    const expiredCampaigns = await db.query.campaigns.findMany({
      where: (campaigns, { and, lt, isNotNull }) => 
        and(
          lt(campaigns.endDate, new Date()),
          isNotNull(campaigns.endDate)
        )
    });

    for (const campaign of expiredCampaigns) {
      await db.delete(campaigns).where(eq(campaigns.id, campaign.id));
    }
  } catch (error) {
    // Error logged internally
  }
};

const isServerless = !!(process.env.VERCEL && process.env.VERCEL_ENV) || !!process.env.AWS_LAMBDA_FUNCTION_NAME;

if (!isServerless) {
  setInterval(cleanupExpiredCampaigns, 60 * 60 * 1000);

  app.listen(PORT, '0.0.0.0', () => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📊 Database: ${db ? 'Connected' : 'Not configured'}`);
      console.log(`📧 Email: ${process.env.RESEND_API_KEY ? 'Configured' : 'Not configured'}`);
      console.log(`🧹 Auto-cleanup: Running hourly for expired campaigns`);
    }
    
    cleanupExpiredCampaigns();
  });
}
