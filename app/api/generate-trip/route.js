import { auth } from "../../../lib/auth";

const byStyle = {
  family: ["פארק מים או אטרקציה לילדים", "שוק מקומי נעים", "חוף/טיילת עם מסעדה משפחתית"],
  couple: ["תצפית שקיעה", "סיור קולינרי", "ספא או חוף שקט"],
  adventure: ["טיול טבע", "אטרקציית אקסטרים", "סיור עירוני עצמאי"],
  luxury: ["ארוחת ערב מומלצת", "יום בריזורט", "חוויה פרטית או שייט"],
  budget: ["אטרקציה חינמית", "אוכל רחוב", "מסלול הליכה עצמאי"]
};

function daysBetween(start, end, requestedDays) {
  const s = new Date(start); const e = new Date(end);
  const diff = Math.max(1, Math.ceil((e - s) / 86400000) + 1 || Number(requestedDays) || 7);
  return Number(requestedDays) > 0 ? Number(requestedDays) : Math.min(diff, 21);
}

function buildPlan(input) {
  const days = daysBetween(input.startDate, input.endDate, input.days);
  const style = input.tripStyle || "family";
  const base = byStyle[style] || byStyle.family;
  const destination = input.destination || "היעד שבחרת";
  const cities = (input.cities || destination).split(",").map(x=>x.trim()).filter(Boolean);
  const hotels = (input.hotels || "מלון לבחירה").split("\n").map(x=>x.trim()).filter(Boolean);
  const itinerary = Array.from({length: days}).map((_, i) => {
    const city = cities[i % cities.length] || destination;
    const hotel = hotels[i % hotels.length] || "מלון לבחירה";
    return {
      day: i + 1,
      title: `יום ${i + 1} ב${city}`,
      city,
      hotel,
      morning: i === 0 ? "נחיתה, התארגנות וצ׳ק אין" : base[i % base.length],
      noon: `אטרקציה מרכזית ב${city} לפי סגנון ${style}`,
      evening: i === days - 1 ? "סיכום טיול, קניות אחרונות והכנה לטיסה" : "ארוחת ערב וסיבוב רגוע באזור המלון",
      tips: ["להזמין מראש בעונה עמוסה", "לבדוק מרחקי נסיעה", "להשאיר זמן מנוחה"]
    };
  });
  const attractions = cities.flatMap((city, idx) => base.map((name, i) => ({
    name: `${name} - ${city}`,
    city,
    type: ["ילדים", "תרבות", "טבע", "אוכל", "קניות"][i % 5],
    why: `מתאים לסגנון הטיול ולמבנה הימים שהוזן בשאלון.`,
    bookingHint: "להוסיף בהמשך קישור הזמנה מקומי/Viator/Klook/Google Maps"
  })));
  return {
    meta: { owner: input.ownerName, destination, startDate: input.startDate, endDate: input.endDate, travelers: input.travelers, style },
    flights: input.flights || "לא הוזנו טיסות",
    hotels,
    itinerary,
    attractions,
    remoteWork: {
      enabled: Boolean(input.remoteWork),
      title: "עבודה מרחוק",
      instructions: "האתר מציג הסבר כללי בלבד. המשתמש מזין בעצמו כתובת, שם מחשב או כלי חיבור. אין נתונים קשיחים של בעל האתר."
    }
  };
}

export async function POST(req) {
  const session = await auth();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const input = await req.json();
  return Response.json(buildPlan(input));
}
