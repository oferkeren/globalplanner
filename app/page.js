import { auth, signIn, signOut } from "../lib/auth";
import Planner from "./components/Planner";

export default async function Home() {
  const session = await auth();
  if (!session) {
    return (
      <main className="shell hero">
        <section>
          <h1>Global Travel Planner</h1>
          <p className="lead">אתר לבניית מסלול טיול אישי: המשתמש מתחבר עם Google, עונה על שאלון קצר, והמערכת מרנדרת לו דף טיול מלא עם ימים, מלונות, טיסות, אטרקציות, מסמכים והסבר עבודה מרחוק, ושומרת את הטיולים ב-PostgreSQL.</p>
          <form action={async()=>{"use server"; await signIn("google");}}>
            <button className="btn">התחברות עם Google</button>
          </form>
        </section>
        <aside className="card">
          <h2>מה האתר מייצר?</h2>
          <div className="list">
            <div className="item">מסלול יומי לפי יעד, תאריכים וסגנון טיול</div>
            <div className="item">אטרקציות מומלצות שהאתר יוצר, לא המשתמש</div>
            <div className="item">כרטיסי טיסות, מלונות, מסמכים ועבודה מרחוק</div>
            <div className="item">שמירה ב-PostgreSQL לפי המשתמש המחובר</div>
          </div>
        </aside>
      </main>
    );
  }
  return (
    <main className="shell">
      <div className="topbar">
        <div className="user">
          {session.user?.image && <img className="avatar" src={session.user.image} alt=""/>}
          <div><b>{session.user?.name}</b><div className="muted">{session.user?.email}</div></div>
        </div>
        <form action={async()=>{"use server"; await signOut();}}><button className="btn secondary">יציאה</button></form>
      </div>
      <Planner userEmail={session.user?.email || ""} />
    </main>
  );
}
