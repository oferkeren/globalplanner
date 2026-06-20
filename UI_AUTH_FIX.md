# UI + Google Auth Fix

Fixes included:

1. The app no longer shows the trip form before login.
2. If there is no Google session, it shows a real landing page with a **Sign in with Google** button.
3. The **Logout** button appears only after authentication.
4. The UI was rebuilt with a proper landing page, hero section, preview card, dashboard, styled form, saved trips and rendered itinerary.
5. Trips are saved to PostgreSQL only after a valid Google session exists.
6. Prisma remains pinned to 6.x.
7. Node remains pinned to 22.
8. `railway.json` does not force the NIXPACKS builder.

Required Railway variables:

```env
NEXTAUTH_URL=https://globalplanner-production.up.railway.app
NEXTAUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
DATABASE_URL=...
```

Google OAuth redirect URI:

```text
https://globalplanner-production.up.railway.app/api/auth/callback/google
```

After deploying:
- Clear Railway build cache.
- Redeploy.
- Open the app in an incognito/private window to verify the unauthenticated landing page.
