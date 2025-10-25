# Gift of Hope - Donation Platform

**Last Updated:** October 25, 2025

## Overview
Gift of Hope is a modern, full-featured nonprofit donation platform built with React, TypeScript, Node.js, and PostgreSQL. The application enables secure online donations through PayPal integration and features comprehensive donor management, campaigns, multilingual support (English, Spanish, French, Arabic), and more.

**Mission:** *Together, we bring hope to every heart.*

## Project Status
✅ **Fully operational and running**
- Frontend: React 19 + TypeScript + Vite (Port 5000)
- Backend: Express 5 + TypeScript (Port 3001)
- Database: PostgreSQL (Connected via DATABASE_URL)
- Email: Resend API (Configured)

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
- PostgreSQL database
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

## Project Structure
```
gift-of-hope/
├── client/           # Frontend React application
├── server/           # Backend Express application
├── shared/           # Shared code (DB schema)
├── api/              # API routes (for Vercel deployment)
└── package.json      # Dependencies
```

## Environment Variables
The following environment variables are configured:
- `DATABASE_URL` - PostgreSQL connection (✅ Connected)
- `PAYPAL_CLIENT_ID` - PayPal client ID
- `PAYPAL_CLIENT_SECRET` - PayPal secret
- `RESEND_API_KEY` - Email service API key (✅ Configured)
- `NODE_ENV` - Environment mode

## Database Schema
### Donations Table
Stores donation records with donor info, amounts, PayPal transaction IDs, and campaign associations.

### Contacts Table
Stores contact form submissions from the website.

### Campaigns Table
Stores fundraising campaigns with goals, progress, and dates.

## Available Scripts
- `npm run dev` - Start Vite development server
- `npm run server` - Start Express backend server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Workflow Configuration
**Server Workflow:**
- Command: `npx tsx server/index.ts & npx vite`
- Runs both backend and frontend concurrently
- Port: 5000 (frontend with proxy to backend at 3001)
- Status: ✅ Running

## Recent Changes
- October 25, 2025: Extracted and deployed from tar.gz archive
- October 25, 2025: Installed all dependencies
- October 25, 2025: Configured and started workflow
- October 25, 2025: Verified database and email connectivity

## Notes
- Database auto-cleanup runs hourly for expired campaigns
- Vite proxies API calls from frontend to backend
- The app supports both development and production modes
- Can be deployed to Vercel with serverless functions
