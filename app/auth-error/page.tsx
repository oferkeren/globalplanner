export default function AuthErrorPage() {
  return (
    <main dir="rtl" style={{
      minHeight: "100vh",
      display: "grid",
      placeItems: "center",
      padding: 24,
      background: "linear-gradient(135deg,#f8fbff,#eaf3ff)",
      fontFamily: "Arial, Helvetica, sans-serif"
    }}>
      <section style={{
        maxWidth: 720,
        background: "white",
        borderRadius: 28,
        padding: 32,
        boxShadow: "0 24px 80px rgba(15,23,42,.14)",
        border: "1px solid rgba(148,163,184,.25)"
      }}>
        <div style={{fontSize: 54}}>🔐</div>
        <h1 style={{fontSize: 34, margin: "12px 0"}}>הכניסה עם Google נכשלה</h1>
        <p style={{lineHeight: 1.8, color: "#64748b"}}>
          בדרך כלל זה קורה בגלל Redirect URI לא מדויק, NEXTAUTH_URL לא נכון,
          או משתני Google OAuth חסרים ב־Railway.
        </p>
        <pre style={{
          background: "#0f172a",
          color: "#e2e8f0",
          padding: 18,
          borderRadius: 18,
          overflowX: "auto",
          direction: "ltr",
          textAlign: "left"
        }}>{`NEXTAUTH_URL=https://your-domain.up.railway.app
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXTAUTH_SECRET=...
DATABASE_URL=...`}</pre>
        <a href="/" style={{
          display: "inline-block",
          marginTop: 14,
          background: "#2563eb",
          color: "white",
          padding: "12px 18px",
          borderRadius: 14,
          textDecoration: "none",
          fontWeight: 800
        }}>חזרה לדף הבית</a>
      </section>
    </main>
  );
}
