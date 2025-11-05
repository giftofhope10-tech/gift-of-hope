import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import xss from 'xss';
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from './paypal.js';
import { db } from './db.js';
import { donations, contacts, campaigns, pendingOrders } from '../shared/schema.js';
import { sendDonationReceipt, sendContactNotification } from './email.js';
import { eq, desc, sum, sql } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

function validateRequiredEnvVars() {
  const required = ['JWT_SECRET', 'ADMIN_PASSWORD'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    const errorMsg = `FATAL: Missing required environment variables: ${missing.join(', ')}`;
    if (process.env.NODE_ENV !== 'production') {
      console.error(errorMsg);
    }
    throw new Error(errorMsg);
  }
}

try {
  validateRequiredEnvVars();
} catch (error: any) {
  if (process.env.NODE_ENV !== 'production') {
    console.error('Environment validation failed:', error.message);
    console.error('The application may not function properly. Please set required environment variables.');
  }
}

const adminPasswordHash = process.env.ADMIN_PASSWORD || null;

const isServerless = !!(process.env.VERCEL && process.env.VERCEL_ENV) || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
const isReplit = process.env.REPL_ID || process.env.REPLIT_DB_URL;
if (isServerless || isReplit) {
  app.set('trust proxy', 1);
}

const securityLogger = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;
  const startTime = Date.now();
  
  res.send = function(data: any): any {
    const duration = Date.now() - startTime;
    
    if (res.statusCode === 401 || res.statusCode === 403) {
      console.warn('Security Event:', {
        type: 'UNAUTHORIZED_ACCESS',
        ip: req.ip,
        path: req.path,
        method: req.method,
        statusCode: res.statusCode,
        userAgent: req.get('user-agent')?.substring(0, 100),
        timestamp: new Date().toISOString()
      });
    }
    
    if (duration > 5000) {
      console.warn('Security Event:', {
        type: 'SLOW_REQUEST',
        ip: req.ip,
        path: req.path,
        duration,
        timestamp: new Date().toISOString()
      });
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};

app.use(securityLogger);

const isProduction = process.env.NODE_ENV === 'production';
const hasHttps = process.env.FORCE_HTTPS === 'true' || isServerless;

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://www.paypal.com", "https://www.paypalobjects.com", "https://www.googletagmanager.com"],
      scriptSrcElem: ["'self'", "https://www.paypal.com", "https://www.paypalobjects.com", "https://www.googletagmanager.com"],
      frameSrc: ["'self'", "https://www.paypal.com"],
      connectSrc: ["'self'", "https://www.paypal.com", "https://www.paypalobjects.com", "https://api.exchangerate-api.com", "https://ipapi.co", "https://www.google-analytics.com", "https://analytics.google.com", "wss://*.replit.dev", "wss://*.repl.co"],
      imgSrc: ["'self'", "data:", "https:", "https://www.paypal.com", "https://www.paypalobjects.com", "https://www.google-analytics.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      styleSrcAttr: ["'unsafe-inline'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'", "https://*.replit.dev", "https://*.repl.co"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: hasHttps ? [] : null,
    },
  },
  hsts: hasHttps ? {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  } : false,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  frameguard: false,
  xPoweredBy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean)
    : true,
  credentials: true,
}));

app.use(cookieParser());

app.use(express.json({
  limit: '10mb',
  verify: (req: any, res, buf, encoding) => {
    const body = buf.toString();
    if (body.length > 0) {
      try {
        JSON.parse(body);
      } catch(e) {
        throw new Error('Invalid JSON');
      }
    }
  }
}));

const inputSanitizer = (req: Request, res: Response, next: NextFunction) => {
  const sanitizeValue = (value: any): any => {
    if (typeof value === 'string') {
      value = value.replace(/\0/g, '');
      
      const sqlPatterns = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|DECLARE)\b)/gi;
      if (sqlPatterns.test(value)) {
        console.warn('Security Event:', {
          type: 'SQL_INJECTION_ATTEMPT',
          ip: req.ip,
          path: req.path,
          value: value.substring(0, 100),
          timestamp: new Date().toISOString()
        });
      }
      
      if (value.includes('../') || value.includes('..\\')) {
        console.warn('Security Event:', {
          type: 'PATH_TRAVERSAL_ATTEMPT',
          ip: req.ip,
          path: req.path,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    if (typeof value === 'object' && value !== null) {
      for (const key in value) {
        value[key] = sanitizeValue(value[key]);
      }
    }
    
    return value;
  };
  
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  
  if (req.query && typeof req.query === 'object') {
    for (const key in req.query) {
      const sanitized = sanitizeValue(req.query[key]);
      Object.defineProperty(req.query, key, { value: sanitized, writable: true, enumerable: true, configurable: true });
    }
  }
  
  next();
};

app.use(inputSanitizer);

const trustProxyForRateLimiting = false;

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  validate: { trustProxy: trustProxyForRateLimiting },
  standardHeaders: true,
  legacyHeaders: false,
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Too many contact submissions from this IP, please try again in an hour.',
  validate: { trustProxy: trustProxyForRateLimiting },
  standardHeaders: true,
  legacyHeaders: false,
});

const donationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many donation attempts, please try again later.',
  validate: { trustProxy: trustProxyForRateLimiting },
  standardHeaders: true,
  legacyHeaders: false,
});

const paymentCaptureLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  message: 'Too many payment capture attempts, please try again later.',
  validate: { trustProxy: trustProxyForRateLimiting },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', generalLimiter);

if (!isServerless) {
  const clientDistPath = path.join(__dirname, '..', 'dist', 'client');
  if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath, {
      etag: true,
      lastModified: true,
      setHeaders: (res, filePath) => {
        const fileName = path.basename(filePath);
        const hasHash = /\-[a-f0-9]{8,}\.(js|css|woff|woff2|ttf|eot|webp|jpg|jpeg|png|gif|svg)$/i.test(fileName);
        
        if (hasHash) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        } else {
          res.setHeader('Cache-Control', 'public, max-age=3600');
        }
      }
    }));
  }
}

app.use((req, res, next) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/setup') || req.path.startsWith('/order')) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
});

const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      path: _req.path,
      method: _req.method,
      timestamp: new Date().toISOString(),
    });
  }

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'An error occurred. Please try again later.' 
    : err.message;

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

app.get('/paypal-client-id', (_req, res) => {
  res.json({ clientId: process.env.PAYPAL_CLIENT_ID });
});

app.post('/order', donationLimiter, async (req, res, next) => {
  try {
    const { amount, currency, donorName, donorEmail, localAmount, localCurrency, campaignId } = req.body;
    
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
          currency: currency,
          localAmount: localAmount?.toString() || null,
          localCurrency: localCurrency || null,
          campaignId: campaignId || null,
          expiresAt: expiresAt,
        });
      } catch (err: any) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Failed to store pending order:', err);
        }
        return res.status(500).json({ error: 'Failed to store order details' });
      }
    }
    
    return res.json(paypalOrderData);
  } catch (error) {
    next(error);
  }
});

app.post('/order/:orderID/capture', paymentCaptureLimiter, async (req, res, next) => {
  let pendingOrderId: number | null = null;
  const originalBodyHandler = res.json.bind(res);
  const originalStatusHandler = res.status.bind(res);
  
  try {
    const { orderID } = req.params;
    
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
    
    let captureResponse: any = null;
    let responseStatus: number = 200;
    let responseSent = false;
    
    res.status = function(code: number) {
      responseStatus = code;
      return originalStatusHandler(code);
    };
    
    res.json = function(data: any) {
      captureResponse = data;
      responseSent = true;
      return res;
    };
    
    try {
      captureResponse = await capturePaypalOrder(orderID);
    } catch (paypalError: any) {
      await db.update(pendingOrders)
        .set({ status: 'failed' })
        .where(eq(pendingOrders.id, pendingOrder.id));
      return res.status(500).json({ error: 'PayPal capture failed' });
    }
    
    if (responseStatus >= 400 || !captureResponse || captureResponse.error) {
      await db.update(pendingOrders)
        .set({ status: 'failed' })
        .where (eq(pendingOrders.id, pendingOrder.id));
      res.status = originalStatusHandler;
      res.json = originalBodyHandler;
      return res.status(responseStatus).json(captureResponse);
    }
    
    if (!captureResponse || captureResponse.status !== 'COMPLETED' || !captureResponse.purchase_units) {
      await db.update(pendingOrders)
        .set({ status: 'failed' })
        .where(eq(pendingOrders.id, pendingOrder.id));
      res.status = originalStatusHandler;
      res.json = originalBodyHandler;
      return res.status(500).json({ error: 'Invalid PayPal response' });
    }
    
    const capture = captureResponse.purchase_units[0]?.payments?.captures?.[0];
    const capturedAmount = capture?.amount?.value;
    const capturedCurrency = capture?.amount?.currency_code;
    
    if (!capturedAmount || !capturedCurrency) {
      await db.update(pendingOrders)
        .set({ status: 'failed' })
        .where(eq(pendingOrders.id, pendingOrder.id));
      res.status = originalStatusHandler;
      res.json = originalBodyHandler;
      return res.status(500).json({ error: 'Invalid PayPal capture response' });
    }
    
    if (parseFloat(capturedAmount) !== parseFloat(pendingOrder.amount) || 
        capturedCurrency !== pendingOrder.currency) {
      await db.update(pendingOrders)
        .set({ status: 'failed' })
        .where(eq(pendingOrders.id, pendingOrder.id));
      res.status = originalStatusHandler;
      res.json = originalBodyHandler;
      return res.status(400).json({ error: 'Payment amount/currency mismatch' });
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
        if (process.env.NODE_ENV !== 'production') {
          console.error('Email send failed:', emailError.message);
        }
      }
    }
    
    res.status = originalStatusHandler;
    res.json = originalBodyHandler;
    return res.status(responseStatus).json(captureResponse);
    
  } catch (error: any) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Order capture error:', error);
    }
    if (db && pendingOrderId) {
      await db.update(pendingOrders)
        .set({ status: 'failed' })
        .where(eq(pendingOrders.id, pendingOrderId))
        .catch((cleanupError) => {
          if (process.env.NODE_ENV !== 'production') {
            console.error('Failed to mark order as failed:', cleanupError);
          }
        });
    }
    if (!res.headersSent) {
      if (typeof res.json === 'function' && res.json.toString().includes('captureResponse')) {
        res.status = originalStatusHandler;
        res.json = originalBodyHandler;
      }
      res.status(500).json({ error: 'Payment capture failed' });
    }
  }
});

app.post('/api/contact', contactLimiter, async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const sanitizedName = xss(name.trim());
    const sanitizedEmail = xss(email.trim());
    const sanitizedSubject = xss(subject.trim());
    const sanitizedMessage = xss(message.trim());

    if (db) {
      try {
        await db.insert(contacts).values({
          name: sanitizedName,
          email: sanitizedEmail,
          subject: sanitizedSubject,
          message: sanitizedMessage,
          status: 'new',
        });
      } catch (dbError) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Database error (contact will still be logged):', dbError);
        }
      }
    }


    try {
      await sendContactNotification(sanitizedName, sanitizedEmail, sanitizedSubject, sanitizedMessage);
    } catch (emailError) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Email error (contact was logged):', emailError);
      }
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'Thank you for your message. We will get back to you soon!' 
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/campaigns', async (_req, res, next) => {
  try {
    if (!db) {
      return res.json({ campaigns: [] });
    }

    const activeCampaigns = await db.query.campaigns.findMany({
      where: eq(campaigns.isActive, true),
      orderBy: [desc(campaigns.createdAt)],
    });

    res.json({ campaigns: activeCampaigns });
  } catch (error) {
    next(error);
  }
});

app.get('/api/campaigns/:id', async (req, res, next) => {
  try {
    if (!db) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    const campaignId = parseInt(req.params.id);
    const campaign = await db.query.campaigns.findFirst({
      where: eq(campaigns.id, campaignId),
    });

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    res.json({ campaign });
  } catch (error) {
    next(error);
  }
});

app.get('/api/stats', async (_req, res, next) => {
  try {
    if (!db) {
      return res.json({
        totalDonations: 0,
        totalAmount: '0',
        totalDonors: 0,
        totalContacts: 0,
      });
    }

    const allDonations = await db.select().from(donations);
    const totalAmount = allDonations.reduce((sum, d) => sum + parseFloat(d.amount), 0);
    const uniqueDonors = new Set(allDonations.map(d => d.donorEmail || d.donorName)).size;
    const allContacts = await db.select().from(contacts);

    res.json({
      totalDonations: allDonations.length,
      totalAmount: totalAmount.toFixed(2),
      totalDonors: uniqueDonors,
      totalContacts: allContacts.length,
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/recent-donations', async (_req, res, next) => {
  try {
    if (!db) {
      return res.json({ donations: [], total: 0 });
    }

    const recentDonations = await db.query.donations.findMany({
      where: eq(donations.status, 'completed'),
      orderBy: [desc(donations.createdAt)],
      limit: 10,
    });

    const maskedDonations = recentDonations.map(donation => ({
      donorName: donation.donorName,
      amount: donation.amount,
      currency: donation.currency,
      paypalReference: donation.paypalOrderId 
        ? `****${donation.paypalOrderId.slice(-4)}`
        : '****',
      createdAt: donation.createdAt,
    }));

    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(donations)
      .where(eq(donations.status, 'completed'));

    res.json({ 
      donations: maskedDonations,
      total: totalResult[0]?.count || 0
    });
  } catch (error) {
    next(error);
  }
});

const adminAuthLimiter = rateLimit({
  windowMs: 30 * 1000,
  max: 3,
  message: 'Too many login attempts. Please wait 30 seconds and try again.',
  validate: { trustProxy: false },
  standardHeaders: true,
  legacyHeaders: false,
});

const generateToken = (payload: any) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign(payload, secret, { expiresIn: '24h' });
};

const verifyToken = (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
};

app.post('/api/admin/login', adminAuthLimiter, async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!adminPasswordHash) {
      return res.status(500).json({ success: false, message: 'Admin authentication not configured' });
    }
    
    const isValid = await bcrypt.compare(password, adminPasswordHash);
    
    if (isValid) {
      const token = generateToken({ role: 'admin', timestamp: Date.now() });
      
      const isProduction = process.env.NODE_ENV === 'production' && !isReplit;
      
      res.cookie('adminToken', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/'
      });
      
      return res.json({ success: true });
    }
    
    return res.status(401).json({ success: false, message: 'Invalid password' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Login failed' });
  }
});

app.post('/api/admin/logout', (_req, res) => {
  const isProduction = process.env.NODE_ENV === 'production' && !isReplit;
  
  res.clearCookie('adminToken', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'strict' : 'lax',
    path: '/'
  });
  return res.json({ success: true });
});

const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.adminToken;
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }
  
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
  
  next();
};

app.post('/api/admin/campaigns', adminAuth, async (req, res, next) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, message: 'Database not configured' });
    }

    const { title, description, goalAmount, endDate, imageUrl } = req.body;

    if (!title || !description || !goalAmount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, description, and goal amount are required' 
      });
    }

    const [newCampaign] = await db.insert(campaigns).values({
      title: title.trim(),
      description: description.trim(),
      goalAmount: goalAmount.toString(),
      endDate: endDate ? new Date(endDate) : null,
      imageUrl: imageUrl?.trim() || null,
      isActive: true,
    }).returning();

    res.status(201).json({ 
      success: true, 
      message: 'Campaign created successfully', 
      campaign: newCampaign 
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/donations', adminAuth, async (_req, res, next) => {
  try {
    if (!db) {
      return res.json([]);
    }

    const latestDonations = await db.select().from(donations).orderBy(desc(donations.createdAt)).limit(10);
    res.json(latestDonations);
  } catch (error) {
    next(error);
  }
});

app.get('/api/admin/contacts', adminAuth, async (_req, res, next) => {
  try {
    if (!db) {
      return res.json([]);
    }

    const allContacts = await db.select().from(contacts).orderBy(desc(contacts.createdAt));
    res.json(allContacts);
  } catch (error) {
    next(error);
  }
});

app.post('/api/data-deletion-request', async (req, res) => {
  try {
    const { email, type } = req.body;
    
    if (!email || !type) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and type are required' 
      });
    }

    const sanitizedEmail = xss(email.trim());
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('\n========== DATA DELETION REQUEST ==========');
      console.log('Email:', sanitizedEmail);
      console.log('Type:', type);
      console.log('Timestamp:', new Date().toISOString());
      console.log('==========================================\n');
    }

    res.json({ 
      success: true, 
      message: 'Data deletion request received. We will process it within 30 days as per GDPR requirements.' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process data deletion request' 
    });
  }
});

app.delete('/api/admin/user-data/:email', adminAuth, async (req, res, next) => {
  try {
    if (!db) {
      return res.status(500).json({ success: false, message: 'Database not configured' });
    }

    const { email } = req.params;
    const sanitizedEmail = xss(email.trim());

    const deletedDonations = await db.delete(donations).where(eq(donations.donorEmail, sanitizedEmail)).returning();
    const deletedContacts = await db.delete(contacts).where(eq(contacts.email, sanitizedEmail)).returning();

    res.json({ 
      success: true, 
      message: `Deleted ${deletedDonations.length} donations and ${deletedContacts.length} contacts for ${sanitizedEmail}`,
      deleted: {
        donations: deletedDonations.length,
        contacts: deletedContacts.length
      }
    });
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);


export default app;
