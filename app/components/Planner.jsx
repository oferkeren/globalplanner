"use client";
import { useEffect, useState } from "react";

const emptyForm = {
  ownerName: "",
  destination: "",
  cities: "",
  startDate: "",
  endDate: "",
  days: "7",
  travelers: "2 מבוגרים + 2 ילדים",
  tripStyle: "family",
  flights: "",
  hotels: "",
  budget: "",
  specialNotes: "",
  remoteWork: false
};

export default function Planner({ userEmail }) {
  const [form, setForm] = useState(emptyForm);
  const [plan, setPlan] = useState(null);
  const [tab, setTab] = useState("overview");
  const [docs, setDocs] = useState([]);
  const [trips, setTrips] = useState([]);
  const [tripId, setTripId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => { loadTrips(); }, []);

  async function loadTrips() {
    const res = await fetch("/api/trips", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    setTrips(data.trips || []);
    const first = data.trips?.[0];
    if (first) loadTrip(first);
  }

  function loadTrip(trip) {
    setTripId(trip.id);
    setForm(trip.form || emptyForm);
    setPlan(trip.plan || null);
    setDocs(Array.isArray(trip.docs) ? trip.docs : []);
    setStatus(`נטען: ${trip.destination || "טיול"}`);
  }

  const update = (key, value) => setForm(f => ({ ...f, [key]: value }));

  async function saveTrip(nextPlan = plan, nextDocs = docs) {
    setSaving(true);
    setStatus("שומר...");
    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: tripId, form, plan: nextPlan, docs: nextDocs })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setTripId(data.trip.id);
      setStatus("נשמר ב-PostgreSQL");
      await loadTrips();
      return data.trip;
    } catch (e) {
      setStatus("שמירה נכשלה: " + e.message);
    } finally {
      setSaving(false);
    }
  }

  async function generate() {
    setBusy(true);
    setStatus("מייצר מסלול...");
    try {
      const res = await fetch("/api/generate-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generate failed");
      setPlan(data);
      setTab("overview");
      await saveTrip(data, docs);
    } catch (e) {
      setStatus("יצירה נכשלה: " + e.message);
    } finally {
      setBusy(false);
    }
  }

  async function onDocs(e) {
    const files = Array.from(e.target.files || []).map(f => ({
      name: f.name,
      type: f.type || "file",
      size: f.size,
      addedAt: new Date().toISOString(),
      note: "Phase 1 שומר מטא-דאטה בלבד. הקובץ עצמו יישמר בשלב האחסון החיצוני."
    }));
    const nextDocs = [...docs, ...files];
    setDocs(nextDocs);
    await saveTrip(plan, nextDocs);
  }

  function newTrip() {
    setTripId(null);
    setForm(emptyForm);
    setPlan(null);
    setDocs([]);
    setTab("overview");
    setStatus("טיול חדש");
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify({ id: tripId, form, plan, docs }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "travel-plan.json"; a.click(); URL.revokeObjectURL(url);
  }

  const tabs = [["overview", "סיכום"], ["days", "מסלול"], ["attractions", "אטרקציות"], ["docs", "מסמכים"], ["remote", "עבודה מרחוק"]];

  return <div className="grid">
    <aside className="card">
      <div className="sideHead">
        <h2>שאלון יצירת טיול</h2>
        <button className="btn light" onClick={newTrip}>טיול חדש</button>
      </div>

      {trips.length > 0 && <div className="field">
        <label>הטיולים שלי</label>
        <select value={tripId || ""} onChange={e => loadTrip(trips.find(t => t.id === e.target.value))}>
          {trips.map(t => <option key={t.id} value={t.id}>{t.destination || "טיול ללא שם"} · {new Date(t.updatedAt).toLocaleDateString("he-IL")}</option>)}
        </select>
      </div>}

      <div className="form">
        <div className="field"><label>שם לתצוגה</label><input value={form.ownerName} onChange={e=>update("ownerName",e.target.value)} placeholder="לדוגמה: משפחת כהן"/></div>
        <div className="field"><label>יעד ראשי</label><input value={form.destination} onChange={e=>update("destination",e.target.value)} placeholder="לדוגמה: תאילנד / איטליה / יפן"/></div>
        <div className="field"><label>ערים / אזורים, מופרדים בפסיק</label><input value={form.cities} onChange={e=>update("cities",e.target.value)} placeholder="פוקט, קוסמוי, קראבי"/></div>
        <div className="row"><div className="field"><label>מתאריך</label><input type="date" value={form.startDate} onChange={e=>update("startDate",e.target.value)}/></div><div className="field"><label>עד תאריך</label><input type="date" value={form.endDate} onChange={e=>update("endDate",e.target.value)}/></div></div>
        <div className="row"><div className="field"><label>מספר ימים</label><input value={form.days} onChange={e=>update("days",e.target.value)}/></div><div className="field"><label>סוג טיול</label><select value={form.tripStyle} onChange={e=>update("tripStyle",e.target.value)}><option value="family">משפחתי</option><option value="couple">זוגי</option><option value="adventure">אקשן וטבע</option><option value="luxury">יוקרתי</option><option value="budget">חסכוני</option></select></div></div>
        <div className="field"><label>הרכב נוסעים</label><input value={form.travelers} onChange={e=>update("travelers",e.target.value)}/></div>
        <div className="field"><label>טיסות</label><textarea value={form.flights} onChange={e=>update("flights",e.target.value)} placeholder="מספרי טיסות, שעות, קונקשנים"/></div>
        <div className="field"><label>מלונות, כל מלון בשורה</label><textarea value={form.hotels} onChange={e=>update("hotels",e.target.value)} placeholder="שם מלון + תאריכים"/></div>
        <div className="field"><label>תקציב / הערות</label><textarea value={form.specialNotes} onChange={e=>update("specialNotes",e.target.value)} placeholder="קצב טיול, ילדים, נגישות, אוכל, רכב"/></div>
        <label><input type="checkbox" checked={form.remoteWork} onChange={e=>update("remoteWork",e.target.checked)}/> לכלול מודול עבודה מרחוק</label>
        <button className="btn" onClick={generate} disabled={busy}>{busy ? "מייצר..." : "צור ושמור מסלול"}</button>
        <button className="btn light" onClick={() => saveTrip()} disabled={saving}>{saving ? "שומר..." : "שמור בלי לייצר מחדש"}</button>
        <button className="btn light" onClick={exportJson}>ייצוא JSON</button>
        {status && <div className="status">{status}</div>}
      </div>
    </aside>

    <section className="card">
      <div className="tabs">{tabs.map(([id,label])=><button key={id} className={`tab ${tab===id?"active":""}`} onClick={()=>setTab(id)}>{label}</button>)}</div>
      {!plan && <div className="empty">מלא שאלון ולחץ “צור ושמור מסלול”. האתר ייצר את המסלול וישמור אותו ב-PostgreSQL, כי localStorage זה נחמד עד שהדפדפן מחליט לעשות לך סדנת פרידה.</div>}
      {plan && <>
        <Panel active={tab==="overview"}><h2>{plan.meta.owner || "טיול חדש"} - {plan.meta.destination}</h2><p className="muted">{plan.meta.startDate} עד {plan.meta.endDate} · {plan.meta.travelers}</p><div className="item"><b>טיסות</b><p>{plan.flights}</p></div><div className="item"><b>מלונות</b>{plan.hotels.map((h,i)=><span className="pill" key={i}>{h}</span>)}</div></Panel>
        <Panel active={tab==="days"}>{plan.itinerary.map(d=><div className="day" key={d.day}><h3>{d.title}</h3><p><b>בוקר:</b> {d.morning}</p><p><b>צהריים:</b> {d.noon}</p><p><b>ערב:</b> {d.evening}</p>{d.tips.map(t=><span className="pill" key={t}>{t}</span>)}</div>)}</Panel>
        <Panel active={tab==="attractions"}><div className="list">{plan.attractions.map((a,i)=><div className="item" key={i}><b>{a.name}</b><p>{a.why}</p><span className="pill">{a.city}</span><span className="pill">{a.type}</span><p className="muted">{a.bookingHint}</p></div>)}</div></Panel>
        <Panel active={tab==="docs"}><div className="field"><label>העלאת מסמכים</label><input type="file" multiple onChange={onDocs}/><p className="muted">שלב 1: נשמרים שמות/סוג/גודל בלבד. בשלב הבא נחבר Cloudflare R2 או S3 לשמירת הקבצים עצמם.</p></div><div className="list">{docs.map((d,i)=><div className="item doc" key={i}><span>{d.name}</span><span className="muted">{Math.round((d.size || 0)/1024)}KB</span></div>)}</div></Panel>
        <Panel active={tab==="remote"}><h2>{plan.remoteWork.title}</h2><p>{plan.remoteWork.instructions}</p><div className="item"><b>פרטים שהמשתמש ממלא בעצמו</b><p>כלי חיבור, כתובת/שם מחשב, שם משתמש והוראות ארגוניות. אין IP או מחשב קשיח בקוד.</p></div></Panel>
      </>}
    </section>
  </div>;
}
function Panel({active, children}) { return <div className={`section ${active?"active":""}`}>{children}</div>; }
