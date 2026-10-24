# Supalovefoods

Premium Nigerian foodstuffs export, wholesale, and retail platform.

## Getting Started

```bash
npm install
cp .env.example .env  # Add your environment variables
npx prisma db push
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- Next.js 14.2, React 18, TypeScript
- Tailwind CSS, Radix UI
- PostgreSQL (Supabase), Prisma 6.19.3
- NextAuth.js v5, Flutterwave payments

## Environment Variables

### Database & Auth
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` - Supabase connection
- `DATABASE_URL`, `DIRECT_URL` - PostgreSQL connection strings
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL` - NextAuth.js configuration

### Payments
- `FLW_PUBLIC_KEY`, `FLW_SECRET_KEY`, `FLW_SECRET_HASH`, `NEXT_PUBLIC_FLW_PUBLIC_KEY` - Flutterwave

### Site Configuration
- `NEXT_PUBLIC_APP_URL` - Base URL of the site (e.g., https://supalovefoods.com)
- `NEXT_PUBLIC_SITE_NAME` - Business name (default: Supalovefoods)
- `NEXT_PUBLIC_TAGLINE` - Tagline displayed in logo (default: Export · Wholesale · Retail)
- `NEXT_PUBLIC_CONTACT_EMAIL` - Primary contact email
- `NEXT_PUBLIC_CONTACT_PHONE` - Primary phone number
- `NEXT_PUBLIC_WHATSAPP` - WhatsApp number (optional)
- `NEXT_PUBLIC_ADDRESS` - Business address
- `NEXT_PUBLIC_SOCIAL_INSTAGRAM` - Instagram URL (optional)
- `NEXT_PUBLIC_SOCIAL_FACEBOOK` - Facebook URL (optional)
- `NEXT_PUBLIC_SOCIAL_X` - X/Twitter URL (optional)

### Email
- `RESEND_API_KEY` - Resend API key for transactional emails

### Admin Access
- `ADMIN_EMAIL`, `ADMIN_PASSWORD` - Admin dashboard credentials

## Admin Access

Access `/admin/login` using credentials in `.env` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`).
