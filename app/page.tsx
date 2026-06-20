"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

type TripInput = {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  days: number;
  tripType: string;
  travelers: string;
  flights: string;
  hotels: string;
  pace: string;
  notes: string;
  remoteWork: boolean;
};

const defaultInput: TripInput = {
  title: "",
  destination: "",
  startDate: "",
  endDate: "",
  days: 7,
  tripType: "משפחתי",
  travelers: "2 מבוגרים + 2 ילדים",
  flights: "",
  hotels: "",
  pace: "מאוזן",
  notes: "",
  remoteWork: false,
};

const examples = [
  "טיול משפחתי לצפון איטליה",
  "שבוע זוגי ביוון",
  "טיול בר מצווה ללונדון",
  "חופשת קיץ בתאילנד",
];

export default function Page() {
  const { data: session, status } = useSession();
  const [input, setInput] = useState<TripInput>(defaultInput);
  const [generatedTrip, setGeneratedTrip] = useState<any>(null);
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const signedIn = status === "authenticated" && !!session?.user?.email;

  useEffect(() => {
    if (signedIn) {
      fetch("/api/trips")
        .then((r) => r.json())
        .then((d) => setTrips(d.trips || []))
        .catch(() => setTrips([]));
    }
  }, [signedIn]);

  const completion = useMemo(() => {
    const fields = [input.title, input.destination, input.startDate, input.endDate, input.travelers, input.flights, input.hotels];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [input]);

  function update<K extends keyof TripInput>(key: K, value: TripInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  async function createTrip() {
    setLoading(true);
    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setGeneratedTrip(data.trip);
      const list = await fetch("/api/trips").then((r) => r.json());
      setTrips(list.trips || []);
    } catch (e) {
      alert("לא הצלחתי לשמור את הטיול. בדוק DATABASE_URL ו-Google session.");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return <main className="loading">טוען...</main>;
  }

  if (!signedIn) {
    return (
      <main className="landing" dir="rtl">
        <section className="hero">
          <div className="heroText">
            <div className="pill">GlobalPlanner · SaaS Travel Builder</div>
            <h1>בונים מסלול טיול מלא בכמה דקות</h1>
            <p>
              המשתמש ממלא יעד, תאריכים, טיסות, מלונות וסגנון טיול. האתר מייצר דף מסלול מסודר,
              ימים, אטרקציות, מסמכים וצ׳ק ליסטים. לא עוד קובץ וורד שמתחפש לחופשה.
            </p>
            <div className="actions">
              <button className="googleBtn" onClick={() => signIn("google")}>
                <span>G</span>
                כניסה עם Google
              </button>
              <a className="ghostBtn" href="#preview">צפייה בדוגמה</a>
            </div>
            <div className="trust">
              <span>🔐 התחברות אישית</span>
              <span>🗄️ שמירה ב-PostgreSQL</span>
              <span>🧭 יצירת מסלול דינמי</span>
            </div>
          </div>

          <div className="heroCard" id="preview">
            <div className="browserDots"><i></i><i></i><i></i></div>
            <h3>Trip Preview</h3>
            <div className="mapBlob">✈️</div>
            <div className="miniDay">
              <b>יום 1</b>
              <span>נחיתה, צ׳ק אין, סיור קל וארוחת ערב</span>
            </div>
            <div className="miniDay">
              <b>יום 2</b>
              <span>אטרקציה מרכזית, שוק מקומי וזמן מנוחה</span>
            </div>
            <div className="miniGrid">
              <div>🏨 מלונות</div>
              <div>🎟️ אטרקציות</div>
              <div>📄 מסמכים</div>
              <div>💻 עבודה מרחוק</div>
            </div>
          </div>
        </section>

        <section className="features">
          <article>
            <span>01</span>
            <h3>התחברות</h3>
            <p>כל משתמש נכנס עם Google, והטיולים שלו נשמרים אליו.</p>
          </article>
          <article>
            <span>02</span>
            <h3>שאלון</h3>
            <p>המשתמש ממלא רק את הפרטים שצריך. השאר נבנה אוטומטית.</p>
          </article>
          <article>
            <span>03</span>
            <h3>דף טיול</h3>
            <p>מסלול, ימים, מלונות, טיסות, מסמכים וצ׳ק ליסטים במקום אחד.</p>
          </article>
        </section>
      </main>
    );
  }

  return (
    <main className="app" dir="rtl">
      <header className="topbar">
        <div>
          <b>GlobalPlanner</b>
          <span>מחובר כ־{session?.user?.name || session?.user?.email}</span>
        </div>
        <button className="logout" onClick={() => signOut()}>יציאה</button>
      </header>

      <section className="dashboardHero">
        <div>
          <div className="pill">שלב 1 · Google + PostgreSQL</div>
          <h1>שאלון יצירת טיול</h1>
          <p>מלא את הפרטים הבסיסיים, והמערכת תייצר ותשמור דף טיול ראשוני.</p>
        </div>
        <div className="progressCard">
          <span>{completion}%</span>
          <small>השלמת שאלון</small>
        </div>
      </section>

      <section className="layout">
        <aside className="formPanel">
          <label>שם לתצוגה</label>
          <input value={input.title} onChange={(e) => update("title", e.target.value)} placeholder="לדוגמה: משפחת כהן בצפון איטליה" />

          <label>יעד ראשי</label>
          <input value={input.destination} onChange={(e) => update("destination", e.target.value)} placeholder="תאילנד / איטליה / יפן" />

          <div className="row">
            <div>
              <label>מתאריך</label>
              <input type="date" value={input.startDate} onChange={(e) => update("startDate", e.target.value)} />
            </div>
            <div>
              <label>עד תאריך</label>
              <input type="date" value={input.endDate} onChange={(e) => update("endDate", e.target.value)} />
            </div>
          </div>

          <div className="row">
            <div>
              <label>מספר ימים</label>
              <input type="number" value={input.days} onChange={(e) => update("days", Number(e.target.value))} />
            </div>
            <div>
              <label>סוג טיול</label>
              <select value={input.tripType} onChange={(e) => update("tripType", e.target.value)}>
                <option>משפחתי</option>
                <option>זוגי</option>
                <option>חברים</option>
                <option>עסקי</option>
                <option>בר מצווה / בת מצווה</option>
              </select>
            </div>
          </div>

          <label>הרכב נוסעים</label>
          <input value={input.travelers} onChange={(e) => update("travelers", e.target.value)} />

          <label>טיסות</label>
          <textarea value={input.flights} onChange={(e) => update("flights", e.target.value)} placeholder="מספרי טיסות, שעות, קונקשנים" />

          <label>מלונות</label>
          <textarea value={input.hotels} onChange={(e) => update("hotels", e.target.value)} placeholder="שם מלון + עיר + תאריכים" />

          <label>קצב טיול</label>
          <select value={input.pace} onChange={(e) => update("pace", e.target.value)}>
            <option>רגוע</option>
            <option>מאוזן</option>
            <option>אינטנסיבי</option>
          </select>

          <label>הערות / תקציב / העדפות</label>
          <textarea value={input.notes} onChange={(e) => update("notes", e.target.value)} placeholder="ילדים, נגישות, אוכל, רכב, קניות..." />

          <label className="check">
            <input type="checkbox" checked={input.remoteWork} onChange={(e) => update("remoteWork", e.target.checked)} />
            צריך מודול עבודה מרחוק
          </label>

          <button className="primary" disabled={loading || !input.destination} onClick={createTrip}>
            {loading ? "יוצר ושומר..." : "צור ושמור מסלול"}
          </button>
        </aside>

        <section className="previewPanel">
          {!generatedTrip ? (
            <div className="emptyState">
              <div className="bigIcon">🧭</div>
              <h2>כאן יופיע דף הטיול</h2>
              <p>ברגע שתלחץ על יצירת מסלול, האתר ירנדר ימים, טיסות, מלונות, מסמכים ועבודה מרחוק.</p>
              <div className="chips">
                {examples.map((x) => <span key={x}>{x}</span>)}
              </div>
            </div>
          ) : (
            <TripPreview trip={generatedTrip} />
          )}
        </section>
      </section>

      <section className="savedTrips">
        <h2>טיולים שמורים</h2>
        {trips.length === 0 ? (
          <p>אין עדיין טיולים שמורים. כן, צריך ליצור אחד, המחשב לא ינחש לבד. עדיין.</p>
        ) : (
          <div className="tripGrid">
            {trips.map((trip) => (
              <button key={trip.id} onClick={() => setGeneratedTrip(trip)}>
                <b>{trip.title}</b>
                <span>{trip.destination}</span>
              </button>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function TripPreview({ trip }: { trip: any }) {
  const itinerary = Array.isArray(trip.itinerary) ? trip.itinerary : [];
  return (
    <article className="tripPage">
      <div className="tripCover">
        <div>
          <span>מסלול אישי</span>
          <h2>{trip.title}</h2>
          <p>{trip.destination}</p>
        </div>
        <div className="coverIcon">🌍</div>
      </div>

      <div className="tripSections">
        <section>
          <h3>✈️ טיסות</h3>
          <p>{trip.input?.flights || "לא הוזנו טיסות"}</p>
        </section>
        <section>
          <h3>🏨 מלונות</h3>
          <p>{trip.input?.hotels || "לא הוזנו מלונות"}</p>
        </section>
        <section>
          <h3>📄 מסמכים</h3>
          <p>בשלב 1 נשמרת מטא־דאטה בלבד. העלאת קבצים מלאה תיכנס בשלב הבא.</p>
        </section>
        <section>
          <h3>💻 עבודה מרחוק</h3>
          <p>{trip.input?.remoteWork ? "נדרש מודול עבודה מרחוק וצ׳ק ליסט חיבור." : "לא נדרש."}</p>
        </section>
      </div>

      <h3 className="daysTitle">מסלול לפי ימים</h3>
      <div className="days">
        {itinerary.map((day: any) => (
          <div className="dayCard" key={day.day}>
            <b>יום {day.day}</b>
            <h4>{day.title}</h4>
            <p><strong>בוקר:</strong> {day.morning}</p>
            <p><strong>צהריים:</strong> {day.afternoon}</p>
            <p><strong>ערב:</strong> {day.evening}</p>
            <small>{day.tips}</small>
          </div>
        ))}
      </div>
    </article>
  );
}
