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

## Admin Access

Access `/admin/login` using credentials in `.env` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`).
