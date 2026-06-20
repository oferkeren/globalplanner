# Railway Prisma 6 Build Fix

This build fix does two things:

1. Pins Prisma to version 6.x:
   - `prisma`: `^6.19.0`
   - `@prisma/client`: `^6.19.0`

2. Removes the explicit `NIXPACKS` builder setting from `railway.json`.

Why:
- `prisma: latest` resolved to Prisma 7.8.0.
- Prisma 7 removed support for the legacy `url` property inside the `datasource` block in `schema.prisma`.
- Railway/Railpack should now detect the app normally and use the Node version from `.node-version`.

Recommended Railway redeploy steps:

```bash
git add package.json railway.json .node-version RAILWAY_PRISMA6_FIX.md
git commit -m "fix: pin prisma 6 and let railway detect builder"
git push
```

Then in Railway:
1. Open the service.
2. Trigger a new deployment.
3. Use clear build cache if the old Prisma 7 build is still cached.

Expected:
- Node.js 22 is used.
- Prisma 6.x is installed.
- Existing `schema.prisma` datasource with `url = env("DATABASE_URL")` works.
