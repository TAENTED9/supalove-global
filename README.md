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
- `DATABASE_URL` - Supabase transaction-pooler URL (typically port `6543`); include `pgbouncer=true` and set `connection_limit` for your deployment.
- `DIRECT_URL` - Supabase direct PostgreSQL URL (typically port `5432`), used by Prisma for schema and migration operations.
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL` - NextAuth.js configuration

The app exports one shared Prisma client from `src/lib/prisma.ts`. Keep the pooler's per-process `connection_limit` low for serverless deployments (typically `1`) and account for the maximum number of instances and other database clients when sizing it. A single local development process can use a higher limit (for example, `5`). Avoid increasing the production limit without checking the database's connection budget. `pool_timeout` only controls how long Prisma waits for an available connection; it does not add database capacity.

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
- `ADMIN_EMAIL`, and either `ADMIN_PASSWORD_HASH` (recommended for production) or `ADMIN_PASSWORD` - Admin dashboard credentials

## Admin Access

Access `/admin/login` using the server environment credentials. The credentials provider compares against `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` (or the legacy plaintext `ADMIN_PASSWORD`); it does not query the Prisma `User` table, so failed sign-ins are not evidence of a database lookup failure. The current in-memory limiter rejects attempts after three failures per IP/email key for 15 minutes on each app instance. Use a shared rate-limit store if that limit must be consistent across production instances.
