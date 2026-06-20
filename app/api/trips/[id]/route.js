import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET(_req, { params }) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const trip = await prisma.trip.findFirst({ where: { id, userEmail: email } });
  if (!trip) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ trip });
}

export async function DELETE(_req, { params }) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const found = await prisma.trip.findFirst({ where: { id, userEmail: email }, select: { id: true } });
  if (!found) return Response.json({ error: "Not found" }, { status: 404 });
  await prisma.trip.delete({ where: { id } });
  return Response.json({ ok: true });
}
