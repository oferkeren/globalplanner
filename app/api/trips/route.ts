import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

function generateItinerary(input: any) {
  const days = Number(input.days || 7);
  const destination = input.destination || "יעד";
  const style = input.tripType || "משפחתי";
  const pace = input.pace || "מאוזן";

  return Array.from({ length: Math.max(1, days) }).map((_, index) => ({
    day: index + 1,
    title:
      index === 0
        ? `נחיתה והיכרות עם ${destination}`
        : index === days - 1
        ? "יום סיכום, קניות והתארגנות"
        : `יום ${index + 1} באזור ${destination}`,
    morning:
      index === 0
        ? "הגעה, צ'ק אין, התאקלמות והליכה קלה באזור המלון"
        : "אטרקציה מרכזית שמתאימה לסגנון הטיול ולגילאי המשתתפים",
    afternoon:
      pace === "רגוע"
        ? "זמן מנוחה, בריכה או פעילות קצרה"
        : "סיור נוסף, נקודת תצפית, שוק מקומי או פעילות משפחתית",
    evening: "ארוחת ערב באזור מומלץ וחזרה רגועה למלון",
    tips: `נבנה אוטומטית לפי יעד: ${destination}, סוג: ${style}, קצב: ${pace}`,
  }));
}

export async function GET() {
  const session = await getSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return NextResponse.json({ trips: [] });

  const trips = await prisma.trip.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ trips });
}

export async function POST(request: Request) {
  const session = await getSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const input = await request.json();
  const itinerary = generateItinerary(input);

  const user = await prisma.user.upsert({
    where: { email: session.user.email },
    update: {
      name: session.user.name || undefined,
      image: session.user.image || undefined,
    },
    create: {
      email: session.user.email,
      name: session.user.name || undefined,
      image: session.user.image || undefined,
    },
  });

  const title = input.title || `${input.destination || "טיול חדש"} - ${input.startDate || ""}`;

  const trip = await prisma.trip.create({
    data: {
      userId: user.id,
      title,
      destination: input.destination || "",
      startDate: input.startDate ? new Date(input.startDate) : null,
      endDate: input.endDate ? new Date(input.endDate) : null,
      input,
      itinerary,
    },
  });

  return NextResponse.json({ trip });
}
