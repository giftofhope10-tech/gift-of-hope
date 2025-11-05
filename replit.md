# Gift of Hope - Donation Platform

**Last Updated:** November 5, 2025

## Overview
Gift of Hope is a modern, full-featured nonprofit donation platform built with React, TypeScript, Node.js, and PostgreSQL. The application enables secure online donations through PayPal integration and features comprehensive donor management, campaigns, multilingual support (English, Spanish, French, Arabic), and more.

**Mission:** *Together, we bring hope to every heart.*

## Project Status
✅ **Production-Ready and Deployed to GitHub**
- Frontend: React 19 + TypeScript + Vite (Port 5000)
- Backend: Express 5 + TypeScript (Port 3001)
- Database: PostgreSQL (Connected via DATABASE_URL)
- Email: Resend API (Configured)
- GitHub Repository: https://github.com/giftofhope10-tech/gift-of-hope

## Deployment Readiness
✅ **Vercel Serverless:** Fully configured and ready to deploy
  - All API routes converted to serverless functions in `/api` folder
  - Neon serverless PostgreSQL database (connection pooling handled automatically)
  - Build process optimized with Brotli/Gzip compression
  - Security headers configured (HSTS, X-Frame-Options, X-Content-Type-Options)
  - Note: CSP and rate limiting available in local dev only (see VERCEL_DEPLOYMENT_GUIDE.md)
✅ **SEO:** Excellent optimization with rich metadata and structured data
✅ **Security:** Production-grade security with input sanitization and parameterized queries
✅ **Performance:** Optimized builds with code splitting and compression

## Tech Stack
### Frontend
- React 19 with TypeScript
- Vite 7 (fast build tool)
- React Router v7
- i18next for internationalization
- Responsive design with accessibility features

### Backend
- Express 5 with TypeScript
- Drizzle ORM for database
- PostgreSQL database (Neon serverless)
- Helmet for security
- Rate limiting & CORS protection

### External Services
- PayPal SDK for payment processing
- Resend for transactional emails
- ExchangeRate API for currency conversion
- IP API for geolocation

## Key Features
- ✅ Secure PayPal Integration
- ✅ Database Storage (donations, contacts, campaigns)
- ✅ Email Notifications
- ✅ Donation Campaigns with progress tracking
- ✅ Multilingual Support (EN, ES, FR, AR)
- ✅ Contact Management
- ✅ Real-time Impact Statistics
- ✅ Auto Currency Detection
- ✅ Responsive Design
- ✅ SEO Optimized
- ✅ Admin Panel with JWT Authentication
- ✅ Dark Mode Support

## Project Structure
```
gift-of-hope/
├── client/           # Frontend React application
│   ├── public/      # Static assets, images, sitemap, robots.txt
│   └── src/         # React components, pages, hooks, contexts
├── server/          # Backend Express application
│   ├── index.ts     # Server entry point
│   ├── app.ts       # Express app with security & routes
│   ├── db.ts        # Database connection (PostgreSQL/Neon)
│   ├── email.ts     # Email service (Resend)
│   └── paypal.ts    # PayPal integration
├── shared/          # Shared code (DB schema)
│   └── schema.ts    # Drizzle ORM schema
├── api/             # Vercel serverless functions
└── package.json     # Dependencies
```

## Environment Variables
Required for production deployment:
- `DATABASE_URL` - PostgreSQL connection string (✅ Connected)
- `PAYPAL_CLIENT_ID` - PayPal client ID
- `PAYPAL_CLIENT_SECRET` - PayPal secret key
- `RESEND_API_KEY` - Email service API key (✅ Configured)
- `JWT_SECRET` - JWT secret for admin authentication (min 32 chars)
- `ADMIN_PASSWORD` - Bcrypt hashed admin password
- `NODE_ENV` - Environment mode (production/development)

## Database Schema
### Donations Table
Stores donation records with donor info, amounts, PayPal transaction IDs, and campaign associations.

### Contacts Table
Stores contact form submissions from the website.

### Campaigns Table
Stores fundraising campaigns with goals, progress, and dates.

### Pending Orders Table
Temporary storage for PayPal orders during checkout flow.

## Available Scripts
- `npm run dev` - Start Vite development server
- `npm run server` - Start Express backend server
- `npm run build` - Build for production
- `npm run vercel-build` - Build for Vercel deployment
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Workflow Configuration
**Server Workflow:**
- Command: `npx tsx server/index.ts & npx vite`
- Runs both backend and frontend concurrently
- Port: 5000 (frontend with proxy to backend at 3001)
- Status: ✅ Running

## Security Features
- ✅ Helmet.js with comprehensive Content Security Policy
- ✅ HSTS (HTTP Strict Transport Security)
- ✅ Rate limiting (100 req/15min general, 5 req/hour contact)
- ✅ Input validation and sanitization
- ✅ SQL injection prevention (Drizzle ORM)
- ✅ XSS protection
- ✅ Bcrypt password hashing
- ✅ JWT authentication for admin panel
- ✅ CORS configuration
- ✅ Security event logging

## SEO Implementation
- ✅ Rich meta tags (title, description, keywords)
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card metadata
- ✅ Schema.org structured data (NGO, FAQ, WebSite, Breadcrumb, DonateAction)
- ✅ Sitemap.xml with all pages
- ✅ Robots.txt for crawlers
- ✅ Security.txt for security researchers
- ✅ Critical CSS inlined
- ✅ Image lazy loading
- ✅ Resource hints (preconnect, dns-prefetch)

## GitHub Repository
- **Repository:** https://github.com/giftofhope10-tech/gift-of-hope
- **Owner:** giftofhope10-tech
- **Status:** Created and ready for push

To push to GitHub:
```bash
git remote add origin https://github.com/giftofhope10-tech/gift-of-hope.git
git add .
git commit -m "Initial commit: Gift of Hope donation platform"
git push -u origin main
```

## Deployment to Vercel
1. Import GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically
4. Optional: Configure custom domain

See `DEPLOYMENT_AUDIT_REPORT.md` for complete audit details.

## Recent Changes
- October 25, 2025: Extracted and deployed from tar.gz archive
- October 25, 2025: Installed all dependencies
- October 25, 2025: Configured and started workflow
- October 25, 2025: Verified database and email connectivity
- October 25, 2025: Completed comprehensive audit (Vercel, SEO, Security)
- October 25, 2025: Created GitHub repository
- October 25, 2025: ✅ **PROJECT PRODUCTION-READY**
- November 5, 2025: Added .vercelignore file for optimized deployment
- November 5, 2025: Created comprehensive VERCEL_DEPLOYMENT_GUIDE.md
- November 5, 2025: Updated deployment documentation with accurate security information
- November 5, 2025: Verified Vercel serverless configuration (all API handlers ready)
- November 5, 2025: Tested production build successfully (npm run vercel-build)

## Documentation Files
- `README.md` - Full project documentation
- `PROJECT_SUMMARY.md` - Quick project overview and next steps
- `DEPLOYMENT_AUDIT_REPORT.md` - Comprehensive Vercel/SEO/Security audit
- `VERCEL_DEPLOYMENT_GUIDE.md` - Step-by-step Vercel deployment guide
- `GITHUB_PUSH_INSTRUCTIONS.md` - GitHub deployment guide
- `.env.example` - Environment variable template

## Notes
- Database auto-cleanup runs hourly for expired campaigns
- Vite proxies API calls from frontend to backend
- The app supports both development and production modes
- Fully optimized for Vercel serverless deployment
- All security best practices implemented
- SEO optimized with rich metadata and structured data
