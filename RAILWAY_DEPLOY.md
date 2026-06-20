# Travel Planner V12 - Railway Deploy

## 1. Create Railway project

1. Open Railway.
2. Create a new project.
3. Choose **Deploy from GitHub repo**.
4. Select this repository.

Railway should detect this as a Next.js app using Nixpacks.

## 2. Add environment variables

In Railway → Project → Service → Variables, add:

```env
NODE_ENV=production
NEXTAUTH_URL=https://YOUR-RAILWAY-DOMAIN.up.railway.app
NEXTAUTH_SECRET=YOUR_LONG_RANDOM_SECRET
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
```

Generate `NEXTAUTH_SECRET` locally:

```bash
openssl rand -base64 32
```

## 3. Google OAuth setup

In Google Cloud Console:

1. Create or select a project.
2. Go to **APIs & Services → Credentials**.
3. Create **OAuth client ID**.
4. Application type: **Web application**.
5. Add Authorized JavaScript origin:

```text
https://YOUR-RAILWAY-DOMAIN.up.railway.app
```

6. Add Authorized redirect URI:

```text
https://YOUR-RAILWAY-DOMAIN.up.railway.app/api/auth/callback/google
```

7. Copy Client ID and Client Secret into Railway variables.

## 4. Optional database

For real SaaS usage, add Railway PostgreSQL.

Recommended next step:
- Save each trip by user email/user id.
- Store questionnaire answers.
- Store generated itinerary JSON.
- Store uploaded document metadata.

Suggested tables:
- users
- trips
- trip_documents
- trip_versions

## 5. Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open:

```text
http://localhost:3000
```

For local Google OAuth, add this redirect URI too:

```text
http://localhost:3000/api/auth/callback/google
```

## 6. Production behavior

The app is designed so the user fills only the required trip inputs:
- destination
- dates
- traveler profile
- flights
- hotels
- pace/style
- remote work need
- special notes

The site should generate and render:
- itinerary
- attractions
- daily pages
- hotel/flights sections
- documents
- remote work guide

Do not hard-code personal data into the app. Humanity has suffered enough from demo data leaking into production.
