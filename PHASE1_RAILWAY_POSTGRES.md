# Phase 1: Railway + Google Login + PostgreSQL

This version stores user trips in PostgreSQL instead of only localStorage.

## What works in Phase 1

- Google login with NextAuth/Auth.js
- One logged-in user sees only their own trips
- Create trip from questionnaire
- Generate itinerary using the existing internal generator
- Save trip form + generated plan + document metadata to PostgreSQL
- Load previous trips from the sidebar
- Export JSON

## What is intentionally not in Phase 1

- Real uploaded file storage. The app stores document metadata only.
- AI-generated live attractions. Current generation is rule-based.
- Payments, admin panel, public sharing.

## Railway setup

1. Create a Railway project.
2. Add this app from GitHub.
3. Add a PostgreSQL service in the same Railway project.
4. In the app service, add/reference these variables:

```env
NODE_ENV=production
NEXTAUTH_URL=https://YOUR-RAILWAY-DOMAIN.up.railway.app
NEXTAUTH_SECRET=YOUR_LONG_RANDOM_SECRET
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

If Railway shows a different PostgreSQL variable reference, use the one Railway provides. Naturally, every platform has to invent its own tiny ceremony.

## Google OAuth URLs

Authorized JavaScript origin:

```text
https://YOUR-RAILWAY-DOMAIN.up.railway.app
```

Authorized redirect URI:

```text
https://YOUR-RAILWAY-DOMAIN.up.railway.app/api/auth/callback/google
```

## Database migration

The start command runs:

```bash
prisma migrate deploy && next start -p ${PORT:-3000}
```

So Railway will create/update the table on deploy, assuming `DATABASE_URL` exists.

## Local development

```bash
npm install
cp .env.example .env.local
npx prisma migrate dev --name init
npm run dev
```

For local Google OAuth, add:

```text
http://localhost:3000/api/auth/callback/google
```

## Main table

`Trip` stores:

- userEmail
- ownerName
- destination
- startDate/endDate
- form JSON
- plan JSON
- docs JSON metadata

This keeps Phase 1 simple and useful without building five microservices, because apparently restraint is still legal.
