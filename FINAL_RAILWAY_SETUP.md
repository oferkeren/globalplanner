# Travel Planner V12 Phase 1 - Final Railway Setup

This version includes:

- Google OAuth login
- Railway PostgreSQL support
- Prisma pinned to 6.x
- Node pinned to 22
- No explicit `NIXPACKS` builder setting in `railway.json`
- Prisma 6-compatible `schema.prisma` with `url = env("DATABASE_URL")`

## Required Railway Variables

Set these in Railway → Service → Variables:

```env
NODE_ENV=production
NEXTAUTH_URL=https://YOUR-RAILWAY-DOMAIN.up.railway.app
NEXTAUTH_SECRET=YOUR_LONG_RANDOM_SECRET
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
DATABASE_URL=YOUR_RAILWAY_POSTGRES_URL
```

## Google OAuth Redirects

In Google Cloud Console, configure:

Authorized JavaScript origin:

```text
https://YOUR-RAILWAY-DOMAIN.up.railway.app
```

Authorized redirect URI:

```text
https://YOUR-RAILWAY-DOMAIN.up.railway.app/api/auth/callback/google
```

## Deploy Steps

```bash
git add .
git commit -m "release: v12 phase1 railway postgres google oauth"
git push
```

Then in Railway:

1. Redeploy.
2. Clear build cache if an older build still uses Prisma 7 or Node 20.
3. Check build logs for Node 22 and Prisma 6.x.

## Database Migration

Run once after DATABASE_URL is configured:

```bash
npx prisma migrate deploy
```

If there are no migrations yet and this is the first DB setup:

```bash
npx prisma migrate dev --name init
```

For production, commit the created migration folder and redeploy.

## Notes

Do not use `prisma: latest`.
Do not hard-code personal trip data.
Do not store uploaded document binaries in PostgreSQL in Phase 1. Store metadata only.
