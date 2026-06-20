# NextAuth `Cannot read properties of undefined (reading 'secret')` Fix

This version fixes the crash by defining the NextAuth configuration directly inside:

`app/api/auth/[...nextauth]/route.ts`

Why:
- The previous build could import an undefined `authOptions` object in the production route bundle.
- NextAuth then tried to read `options.secret`, causing:
  `TypeError: Cannot read properties of undefined (reading 'secret')`

Required Railway variables on the APP service:

```env
NEXTAUTH_URL=https://globalplanner-production.up.railway.app
NEXTAUTH_SECRET=<long random string>
GOOGLE_CLIENT_ID=<google client id>
GOOGLE_CLIENT_SECRET=<google client secret>
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

Google OAuth redirect URI:

```text
https://globalplanner-production.up.railway.app/api/auth/callback/google
```

After deploying:
1. Clear build cache.
2. Redeploy.
3. Test `/api/auth/signin`.
4. Then test the homepage login button.
