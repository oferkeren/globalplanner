# Lazy Auth ENV Fix

This version fixes the build crash caused by reading auth environment variables during module initialization.

Previous problem:
- `getRequiredEnv("NEXTAUTH_SECRET")` was called at top-level in auth modules.
- Next.js 14 loads route modules during build while collecting page data.
- Railway build did not expose runtime-only variables at that stage.
- Build crashed before deploy.

Fix:
- `getAuthOptions()` is now a function.
- `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET` are read only when a request hits auth/session-protected routes.
- `app/api/auth/[...nextauth]/route.ts` creates NextAuth inside the request handler.
- `/api/trips` is marked `dynamic = "force-dynamic"`.

Required Railway app service variables:
```env
NEXTAUTH_URL=https://globalplanner-production.up.railway.app
NEXTAUTH_SECRET=<long random value>
GOOGLE_CLIENT_ID=<google oauth client id>
GOOGLE_CLIENT_SECRET=<google oauth secret>
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

After deploy:
1. Clear build cache.
2. Redeploy.
3. Open `/api/auth/signin`.
4. Test Google login.
