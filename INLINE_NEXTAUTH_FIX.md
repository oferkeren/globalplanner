# Inline NextAuth Fix

This fixes:

```text
TypeError: (0 , p.getAuthOptions) is not a function
```

Cause:
- The auth route imported `getAuthOptions` from `@/lib/auth`.
- The production bundle resolved a stale/empty export.
- NextAuth route crashed before Google OAuth.

Fix:
- `app/api/auth/[...nextauth]/route.ts` is now fully self-contained.
- It does not import `getAuthOptions`.
- Auth env vars are read lazily inside the request handler.
- `lib/auth.ts` is deprecated and intentionally exports nothing.
- `/api/trips` uses a separate self-contained `lib/server-auth.ts`.

Deploy:
1. Push this version.
2. Railway → Clear build cache.
3. Redeploy.
4. Test:
   `/api/auth/signin`
