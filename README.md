# Travel Planner V12 Phase 1 - Railway + PostgreSQL

גרסה זו היא בסיס SaaS לשלב 1:

- התחברות עם Google
- שמירת טיולים ב-PostgreSQL ב-Railway
- שאלון יצירת טיול
- יצירת מסלול ואטרקציות בצורה דינמית מתוך הנתונים שהמשתמש מזין
- טעינת טיולים קודמים לכל משתמש מחובר
- מסמכים: בשלב זה נשמר מטא-דאטה בלבד, לא הקובץ עצמו
- עבודה מרחוק: מודול הסבר כללי בלבד, בלי IP/שם מחשב/מידע אישי

## התקנה מקומית

```bash
npm install
cp .env.example .env.local
npx prisma migrate dev --name init
npm run dev
```

## Railway

ראה `PHASE1_RAILWAY_POSTGRES.md`.

## ENV נדרש

```env
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
DATABASE_URL=
```
