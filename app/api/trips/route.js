import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";

function cleanTripPayload(body) {
  const form = body?.form || {};
  const plan = body?.plan || null;
  const docs = Array.isArray(body?.docs) ? body.docs : [];
  return {
    ownerName: form.ownerName || null,
    destination: form.destination || null,
    startDate: form.startDate || null,
    endDate: form.endDate || null,
    form,
    plan,
    docs
  };
}

export async function GET() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const trips = await prisma.trip.findMany({
    where: { userEmail: email },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      ownerName: true,
      destination: true,
      startDate: true,
      endDate: true,
      form: true,
      plan: true,
      docs: true,
      updatedAt: true,
      createdAt: true
    }
  });

  return Response.json({ trips });
}

export async function POST(req) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const payload = cleanTripPayload(body);

  const trip = body?.id
    ? await prisma.trip.update({ where: { id: body.id, userEmail: email }, data: payload })
    : await prisma.trip.create({ data: { userEmail: email, ...payload } });

  return Response.json({ trip });
}
