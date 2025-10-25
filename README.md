# Gift of Hope - Donation Platform

## Overview

Gift of Hope is a modern, full-featured nonprofit donation platform built with React, TypeScript, Node.js, and PostgreSQL. The application enables secure online donations through PayPal integration and features comprehensive donor management, campaigns, multilingual support, and more.

**Mission:** *Together, we bring hope to every heart.*

## Features

### Core Features
- ✅ **Secure PayPal Integration** - Accept donations globally with automatic currency detection
- ✅ **Database Storage** - PostgreSQL database for donations, contacts, and campaigns
- ✅ **Email Notifications** - Automatic donation receipts and contact form notifications
- ✅ **Donation Campaigns** - Create and track specific fundraising campaigns with progress bars
- ✅ **Multilingual Support** - English, Spanish, French, and Arabic translations
- ✅ **Contact Management** - Store and manage contact form submissions
- ✅ **Impact Tracking** - Real-time statistics dashboard

### Security Features
- 🔒 **Helmet.js** - Security headers for production
- 🔒 **Rate Limiting** - Prevent spam and abuse
- 🔒 **CORS Configuration** - Secure cross-origin requests
- 🔒 **Input Validation** - Comprehensive form validation
- 🔒 **Error Handling** - Graceful error management and logging

### User Experience
- 🌍 **Auto Currency Detection** - Shows amounts in user's local currency
- 📱 **Responsive Design** - Works perfectly on all devices
- ♿ **Accessibility** - ARIA labels, keyboard navigation, screen reader support
- 🎨 **Modern UI** - Beautiful gradient design with purple/pink branding
- 🌐 **SEO Optimized** - Meta tags, structured data, sitemap

## Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router v7** - Client-side routing
- **i18next** - Internationalization
- **React i18next** - React bindings for i18n

### Backend
- **Express 5** - Web server framework
- **TypeScript** - Type-safe backend code
- **Drizzle ORM** - Type-safe database operations
- **PostgreSQL** - Relational database (via Neon)
- **Helmet** - Security middleware
- **Express Rate Limit** - API rate limiting
- **CORS** - Cross-origin resource sharing

### External Services
- **PayPal SDK** - Payment processing
- **Resend** - Transactional emails
- **ExchangeRate API** - Currency conversion
- **IP API** - Geolocation for currency detection

## Installation

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (optional but recommended)
- PayPal Developer Account
- Resend API key (optional for emails)

### Setup Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd gift-of-hope
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
DATABASE_URL=your_postgresql_connection_string
RESEND_API_KEY=your_resend_api_key
NODE_ENV=development
```

4. **Set up the database** (if using database features)
```bash
npm run db:push
```

5. **Run the development servers**
```bash
npm run server  # Backend server on port 3000
npm run dev     # Frontend dev server on port 5000
```

Or run both together:
```bash
npm run server & npm run dev
```

6. **Access the application**
Open http://localhost:5000 in your browser

## Available Scripts

- `npm run dev` - Start Vite development server
- `npm run server` - Start Express backend server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Project Structure

```
gift-of-hope/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   │   └── images/        # Image files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── Navigation.tsx
│   │   │   └── Footer.tsx
│   │   ├── pages/         # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Mission.tsx
│   │   │   ├── Donate.tsx
│   │   │   ├── Campaigns.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Privacy.tsx
│   │   │   └── ThankYou.tsx
│   │   ├── i18n/          # Internationalization
│   │   │   ├── config.ts
│   │   │   └── locales/   # Translation files
│   │   ├── config/        # Configuration files
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── index.html
├── server/                 # Backend Express application
│   ├── index.ts           # Main server file
│   ├── db.ts              # Database configuration
│   ├── email.ts           # Email service
│   └── paypal.ts          # PayPal integration
├── shared/                 # Shared code between frontend/backend
│   └── schema.ts          # Database schema (Drizzle ORM)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── drizzle.config.ts
└── README.md
```

## Database Schema

### Donations Table
- `id` - Primary key
- `donorName` - Donor's name
- `donorEmail` - Donor's email (optional)
- `amount` - Donation amount in USD
- `currency` - Payment currency (USD)
- `localAmount` - Amount in donor's local currency
- `localCurrency` - Donor's local currency
- `paypalOrderId` - PayPal transaction ID
- `campaignId` - Associated campaign (optional)
- `status` - Payment status
- `createdAt` - Timestamp

### Contacts Table
- `id` - Primary key
- `name` - Contact name
- `email` - Contact email
- `subject` - Message subject
- `message` - Message content
- `status` - Processing status
- `createdAt` - Timestamp

### Campaigns Table
- `id` - Primary key
- `title` - Campaign title
- `description` - Campaign description
- `goalAmount` - Fundraising goal
- `currentAmount` - Amount raised so far
- `startDate` - Campaign start date
- `endDate` - Campaign end date (optional)
- `isActive` - Active status
- `imageUrl` - Campaign image
- `createdAt` - Timestamp

## API Endpoints

### PayPal Endpoints
- `GET /setup` - Initialize PayPal configuration
- `GET /paypal-client-id` - Get PayPal client ID
- `POST /order` - Create PayPal order
- `POST /order/:orderID/capture` - Capture payment

### Application Endpoints
- `POST /api/contact` - Submit contact form
- `GET /api/campaigns` - Get all active campaigns
- `GET /api/campaigns/:id` - Get specific campaign
- `GET /api/stats` - Get donation statistics
- `GET /health` - Health check endpoint

## Internationalization

The application supports 4 languages out of the box:
- 🇬🇧 English (default)
- 🇪🇸 Spanish (Español)
- 🇫🇷 French (Français)
- 🇸🇦 Arabic (العربية)

To add a new language:
1. Create a new translation file in `client/src/i18n/locales/{language-code}.json`
2. Add the language to `client/src/i18n/config.ts`
3. Add the language option to the Navigation component

## Environment Variables

### Required
- `PAYPAL_CLIENT_ID` - Your PayPal application client ID
- `PAYPAL_CLIENT_SECRET` - Your PayPal application secret

### Optional
- `DATABASE_URL` - PostgreSQL connection string (enables database features)
- `RESEND_API_KEY` - Resend API key (enables email features)
- `NODE_ENV` - Environment mode (development/production)

## Deployment

### Deploy to Vercel (Recommended) 🚀

This project is optimized for Vercel with serverless functions!

**Quick Deploy:**
1. Push your code to GitHub/GitLab/Bitbucket
2. Import to Vercel: https://vercel.com/new
3. Add environment variables (see `.env.example`)
4. Deploy!

**Full Guide:** See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for complete instructions.

### Local Production Build
```bash
npm run build
```

This creates optimized production files in `dist/`.

### Environment Configuration
For production:
1. Set `NODE_ENV=production`
2. Configure production PayPal credentials
3. Set up production database (Neon, Supabase recommended for serverless)
4. Set `ALLOWED_ORIGINS` environment variable
5. Set up HTTPS/SSL certificates (automatic on Vercel)

### Hosting Options
- **Vercel** (Recommended): Full-stack serverless deployment
- **Frontend**: Netlify, Cloudflare Pages
- **Backend**: Railway, Render, Heroku
- **Database**: Neon, Supabase, PlanetScale (serverless-friendly)

## Security Considerations

- Never commit `.env` file or secrets to version control
- Use production PayPal credentials in production only
- Enable HTTPS in production
- Configure appropriate CORS origins
- Review rate limits for your traffic patterns
- Regularly update dependencies
- Monitor error logs for security issues

## Support & Contact

- **Email**: support@giftofhope.online
- **Website**: www.giftofhope.online

## License

ISC License - See package.json for details

## Contributing

This is a nonprofit project. Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

**Gift of Hope** - Together, we bring hope to every heart. 💜
