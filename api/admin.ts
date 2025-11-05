import { Request, Response } from 'express';
import { db } from '../server/db.js';
import { donations, contacts, campaigns } from '../shared/schema.js';
import { eq, desc } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
if (!ADMIN_PASSWORD) {
  throw new Error('ADMIN_PASSWORD environment variable is required');
}

function verifyToken(req: Request): boolean {
  const token = req.cookies?.adminToken;
  if (!token || !JWT_SECRET) return false;
  
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export default async function handler(req: Request, res: Response) {
  const path = req.url || req.path || '';
  
  if (!req.cookies && req.headers.cookie) {
    req.cookies = {};
    req.headers.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      req.cookies[name] = value;
    });
  }
  
  try {
    if (path.includes('/login') && req.method === 'POST') {
      const { password } = req.body;
      
      if (!password || !ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      if (!JWT_SECRET || !ADMIN_PASSWORD) {
        return res.status(500).json({ error: 'Server configuration error' });
      }
      
      const isValid = await bcrypt.compare(password, ADMIN_PASSWORD);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const token = jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '24h' });
      
      const isProduction = process.env.NODE_ENV === 'production';
      const secureCookie = isProduction ? '; Secure' : '';
      
      res.setHeader('Set-Cookie', `adminToken=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict${secureCookie}`);
      return res.json({ success: true, message: 'Logged in successfully' });
    }
    
    if (path.includes('/logout') && req.method === 'POST') {
      const isProduction = process.env.NODE_ENV === 'production';
      const secureCookie = isProduction ? '; Secure' : '';
      
      res.setHeader('Set-Cookie', `adminToken=; HttpOnly; Path=/; Max-Age=0${secureCookie}`);
      return res.json({ success: true, message: 'Logged out successfully' });
    }
    
    if (!verifyToken(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (path.includes('/donations') && req.method === 'GET') {
      if (!db) {
        return res.json([]);
      }
      
      const donationsList = await db.query.donations.findMany({
        orderBy: (donations, { desc }) => [desc(donations.createdAt)],
        limit: 100,
      });
      
      return res.json(donationsList);
    }
    
    if (path.includes('/contacts') && req.method === 'GET') {
      if (!db) {
        return res.json({ contacts: [] });
      }
      
      const contactsList = await db.query.contacts.findMany({
        orderBy: (contacts, { desc }) => [desc(contacts.createdAt)],
        limit: 100,
      });
      
      return res.json({ contacts: contactsList });
    }
    
    if (path.includes('/contacts/') && req.method === 'PATCH') {
      const id = parseInt(path.split('/').pop() || '0');
      const { status } = req.body;
      
      if (!db || !id) {
        return res.status(400).json({ error: 'Invalid request' });
      }
      
      await db.update(contacts).set({ status }).where(eq(contacts.id, id));
      return res.json({ success: true });
    }
    
    if (path.includes('/campaigns') && req.method === 'GET') {
      if (!db) {
        return res.json({ campaigns: [] });
      }
      
      const campaignsList = await db.query.campaigns.findMany({
        orderBy: (campaigns, { desc }) => [desc(campaigns.createdAt)],
      });
      
      return res.json({ campaigns: campaignsList });
    }
    
    if (path.includes('/campaigns') && req.method === 'POST') {
      if (!db) {
        return res.status(503).json({ error: 'Database not available' });
      }
      
      const { title, description, goalAmount, imageUrl, endDate } = req.body;
      
      const newCampaign = await db.insert(campaigns).values({
        title,
        description,
        goalAmount: parseFloat(goalAmount).toString(),
        currentAmount: '0',
        startDate: new Date(),
        endDate: endDate ? new Date(endDate) : null,
        isActive: true,
        imageUrl: imageUrl || null,
      }).returning();
      
      return res.json({ campaign: newCampaign[0] });
    }
    
    if (path.match(/\/campaigns\/\d+/) && req.method === 'PATCH') {
      const id = parseInt(path.split('/').pop() || '0');
      
      if (!db || !id) {
        return res.status(400).json({ error: 'Invalid request' });
      }
      
      const updates = req.body;
      await db.update(campaigns).set(updates).where(eq(campaigns.id, id));
      return res.json({ success: true });
    }
    
    if (path.match(/\/campaigns\/\d+/) && req.method === 'PUT') {
      const id = parseInt(path.split('/').pop() || '0');
      
      if (!db || !id) {
        return res.status(400).json({ error: 'Invalid request' });
      }
      
      const { title, description, goalAmount, imageUrl, endDate } = req.body;
      
      const updates: any = {
        title,
        description,
        goalAmount: parseFloat(goalAmount).toString(),
        imageUrl: imageUrl || null,
      };
      
      if (endDate) {
        updates.endDate = new Date(endDate);
      }
      
      const updatedCampaign = await db.update(campaigns)
        .set(updates)
        .where(eq(campaigns.id, id))
        .returning();
      
      return res.json({ campaign: updatedCampaign[0] });
    }
    
    if (path.match(/\/campaigns\/\d+/) && req.method === 'DELETE') {
      const id = parseInt(path.split('/').pop() || '0');
      
      if (!db || !id) {
        return res.status(400).json({ error: 'Invalid request' });
      }
      
      await db.delete(campaigns).where(eq(campaigns.id, id));
      return res.json({ success: true });
    }
    
    return res.status(404).json({ error: 'Not found' });
    
  } catch (error: any) {
    console.error('Admin API error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
