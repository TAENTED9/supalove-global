# Security checklist

## Baseline
- Keep the admin dashboard behind Auth.js session checks and only allow ADMIN role users.
- Never expose secrets in public env files or client-side code. Use server-only variables for database, payment, and service credentials.
- Keep Next.js security headers enabled and avoid returning raw stack traces to the browser.
- Prefer Prisma queries over raw SQL; validate all request payloads with Zod before use.

## Key rotation
1. Rotate `NEXTAUTH_SECRET` with a strong random value (at least 32 bytes) and update all deployments.
2. Rotate `FLW_SECRET_KEY`, `FLW_SECRET_HASH`, `SUPABASE_SERVICE_ROLE_KEY`, and any database credentials if they are suspected to be exposed.
3. Rebuild and redeploy the app after each rotation. Restart all background workers and verify payment/webhook behavior after deployment.
4. Review access logs, audit entries, and failed login throttling after rotation.

## Monitoring
- Watch for repeated failed admin logins and blocked checkout attempts.
- Verify webhook callback signatures before marking orders as paid.
- Keep audit logs for admin actions, payment events, and authentication failures.
