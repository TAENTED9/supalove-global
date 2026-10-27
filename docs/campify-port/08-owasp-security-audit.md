# OWASP Top 10:2025 Security Audit

## Scope

This review covers the Campify stack as a read-only audit of the live code used for the storefront and API:

- app/main.py
- app/config.py
- app/routers/auth.py
- app/routers/prices.py
- app/routers/uploads.py
- app/services/token_service.py
- price-saver-frontend/proxy.ts
- price-saver-frontend/next.config.ts
- price-saver-frontend/src/app/admin/signin/page.tsx

The goal is to identify production-grade risks and the exact fix pattern to apply in a safer Next.js 14 + Prisma + Auth.js + Flutterwave implementation for a single-store food retail app.

---

## A01 — Broken Access Control

### Finding
The app trusts client-side role information and an admin key header for authorization decisions instead of enforcing server-side verification. This is a classic broken access-control pattern.

### Evidence
- price-saver-frontend/proxy.ts:11-18, 21-36, 46-60 — JWT role is decoded in the browser edge runtime without signature verification and used for route gating.
- app/routers/prices.py:32-48 — `ADMIN_API_KEY` is read from an environment variable and compared directly to an `X-Admin-Key` header in a custom dependency.
- price-saver-frontend/src/app/admin/signin/page.tsx:101-132 — admin sign-in requires a user to type a secret admin key into the browser, then sends it to the backend as a normal form field.

### Exploit scenario
A user alters the JWT payload, changes the role claim from `buyer` to `admin`, and reaches protected pages because the route guard only decodes the token. In a second path, a caller reuses a header value or guesses a weak admin secret to hit admin-only endpoints.

### Fix pattern for Supalove
- Validate JWTs server-side with Auth.js or a proper JWT library and verify the signature, issuer, audience, and expiry before trusting claims.
- Keep the role in a server-issued session or database-backed access token, not in a client-decoded cookie or route guard.
- Move admin authorization to a server-only guard using a long random secret from a secret manager, with constant-time compares and no client-facing secret entry.
- Do not route admin auth through a user-visible browser field; use a secure session flow and role checks on the backend.

---

## A04 — Cryptographic Failures

### Finding
The app depends on environment-driven secrets without hard validation and does not consistently enforce secret rotation and verification paths. This creates an easy path to weak or empty cryptographic material at runtime.

### Evidence
- app/config.py:15-40 — `SECRET_KEY` and `ADMIN_API_KEY` default to empty strings when unset; no startup validation rejects a blank secret.
- app/services/token_service.py:57-78 — access tokens are built with `HS256`, but the application relies on a configuration object whose defaults can be empty if the environment is not set correctly.
- app/main.py:87-97 and 190-210 — cross-origin and security middleware are present, but the defense relies on environment configuration being correct on every deploy.

### Exploit scenario
If the deployment omits a real secret, JWT signing becomes effectively unusable or predictable. Attackers can bypass trust assumptions, forge tokens, or exploit refresh/session flows that assume a valid signing key exists.

### Fix pattern for Supalove
- Fail fast at startup if `AUTH_SECRET`, `NEXTAUTH_SECRET`, or equivalent signing keys are missing or too short.
- Use environment-specific secret management (Vercel/hosting secret store, Kubernetes secret, Azure Key Vault, etc.) and rotate on a schedule.
- Keep access tokens short-lived and refresh tokens server-side with rotation and revocation.
- Reject blank, weak, or default secrets in CI and production deploy checks.

---

## A05 — Security Misconfiguration

### Finding
The app has multiple security controls but also uses permissive development defaults and non-production bypasses, leaving room for insecure deployments when configuration drifts.

### Evidence
- price-saver-frontend/next.config.ts:23-25, 55-76 — `allowedDevOrigins` is set, and the CSP uses development-time `unsafe-eval`/`unsafe-inline` allowances in non-production builds.
- app/main.py:172-204 — CORS and security headers are configured, but the logic depends on environment values and explicit production checks.
- app/config.py:19-52 — environment settings are read lazily with defaults; no app boot-time validation ensures production mode and secret policy are enforced.

### Exploit scenario
A deployment accidentally runs with development CSP rules, broad CORS origins, or permissive headers enabled. Browser policy stops blocking unsafe scripts or mixed origins, which allows cross-site execution and weaker trust boundaries.

### Fix pattern for Supalove
- Enforce strict production CSP, no dev-time `unsafe-eval`, and no wildcard origins.
- Separate dev and prod configuration branches with a startup assert.
- Keep a single allowlist of known origins and explicitly verify headers and cookies.
- Run security config tests in CI so unsafe defaults fail the build.

---

## A07 — Authentication Failures

### Finding
Admin authentication relies on a user-visible environment value and default fallback behavior instead of a robust identity and session model. This is a direct authentication failure risk.

### Evidence
- app/routers/prices.py:32-48 — direct header-based admin validation with a fallback default.
- price-saver-frontend/src/app/admin/signin/page.tsx:101-132 — the secret admin key is entered in the browser, displayed as a password field, and explained as a backend env value.
- app/routers/auth.py:39-87 and 292-358 — the system does have stronger password hashing and rate-limit logic, but the admin flow still depends on a separate secret model and not on a single hardened auth flow.

### Exploit scenario
A weak or leaked admin key can be replayed by anyone with access to the browser page or a network proxy. Because the key is not an authenticated session, it becomes a static shared secret instead of a user-bound login success path.

### Fix pattern for Supalove
- Use Auth.js with server-managed sessions and role-based authorization.
- Admin access should require a verified user identity with a privileged role in the database, not a reusable static key.
- If an operational key is unavoidable, restrict it to server-to-server calls only, not browser form input, and never expose it in the client app.
- Add lockout, MFA, and audit logging for privileged sign-ins.

---

## A08 — Software and Data Integrity Failures

### Finding
The app trusts signed claims and browser-decoded data without cryptographic integrity checks. This introduces a direct integrity gap between the client and the server.

### Evidence
- price-saver-frontend/proxy.ts:21-36 — the app uses `atob` and `JSON.parse` to decode the JWT payload without verifying the signature.
- app/main.py:334-417 — token verification occurs in the API, but the route middleware still trusts the client-side token claim for routing decisions.
- app/services/token_service.py:57-78 and 116-205 — the backend does have better refresh-token handling, which is positive, but the frontend route guard does not share that trust model.

### Exploit scenario
A user multiplies a token with tampered payload content and bypasses page-level permissions because the middleware accepts an unsigned or edited token as if it were valid.

### Fix pattern for Supalove
- Never decode or trust user-supplied JWT claims in browser middleware for authorization.
- Use a server-side session check, verified cookie, or Auth.js session object for all route protections.
- Only a server can evaluate authorization and enforce access rules against the database.
- Treat the browser as untrusted; route protection should be an enforcement layer, not a trust signal.

---

## A09 — Security Logging and Monitoring Failures

### Finding
The app logs some error conditions, but the project does not consistently centralize security telemetry for suspicious auth flows, failed admin attempts, and upload abuse.

### Evidence
- app/main.py:280-297 — global exception logging exists, but there is no structured security alerting or correlation trail at the API boundary.
- app/routers/uploads.py:23-57 and 107-193 — file validation logs local errors but does not emit audit or abuse signals when repeated invalid upload attempts or suspicious file types occur.
- app/routers/auth.py:119-214 and 298-358 — lockout and login history exist, but the complete security signal path should be tied to monitoring, rate-limit alerts, and incident review.

### Exploit scenario
A malicious actor repeatedly hits protected admin routes or uploads suspicious files; the system logs local application errors but provides no out-of-band alerting, rate-limit escalation, or investigation pipeline.

### Fix pattern for Supalove
- Emit structured logs with request ID, IP hash, user ID, and operation for auth, payment, and upload events.
- Add alerting for repeated failed logins, secret misuse, privileged endpoint abuse, and webhook signature failures.
- Retain an immutable audit trail for admin and financial actions.
- Ship with a dashboard or integration to alert on suspicious patterns in real time.

---

## Additional Security Notes

The app also includes several positive practices that should be retained in the Supalove implementation:

- app/services/token_service.py uses hashed refresh tokens and rotation instead of storing raw refresh values.
- app/routers/auth.py contains password validation and account state checks for suspended or paused accounts.
- app/routers/uploads.py performs magic-byte validation and size limits for uploads.
- app/main.py enforces CORS and headers in production.

These are good building blocks, but they are not sufficient by themselves to close the main access-control and auth integrity issues above.

---

## Concluding Recommendation

For the single-store Supalove build, keep the security architecture simple and auditable:

1. Use Auth.js sessions for login and role checks; do not trust decoded JWTs in browser middleware.
2. Enforce all authorization on the server from DB-backed user roles.
3. Protect every admin and payment webhook endpoint with signature verification and idempotency.
4. Treat uploads as untrusted inputs and validate by type, size, storage policy, and signed delivery.
5. Keep logs and alerts focused on sign-in abuse, privileged actions, and payment integrity events.

This is the right baseline for a Next.js 14 + Prisma + Auth.js + Flutterwave food retail app that must be production-safe without marketplace-style trust shortcuts.
