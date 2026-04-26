import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// PATCH /api/events/[id] — approve, reject, or feature an event (admin only)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  // Admin check: DB role OR valid admin-secret header
  const adminSecret = req.headers.get("x-admin-secret");
  const isAdmin =
    session?.user?.role === "admin" ||
    (adminSecret != null && adminSecret === process.env.ADMIN_SECRET);

  // Must be either an admin (via secret or role) or a logged-in user
  if (!session?.user?.id && !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status, featured, rejectionReason } = body;

  // Only admins can change status/featured
  if ((status !== undefined || featured !== undefined) && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const data: Record<string, unknown> = {};
  if (status !== undefined) data.status = status;
  if (featured !== undefined) data.featured = featured;
  if (rejectionReason !== undefined) data.rejectionReason = rejectionReason;

  const event = await prisma.event.update({
    where: { id },
    data,
    include: { creator: true },
  });

  return NextResponse.json(event);
}

// DELETE /api/events/[id] — creator deletes own event, admin deletes any
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isAdmin = session.user.role === "admin";
  const isOwner = event.creatorId === session.user.id;

  if (!isAdmin && !isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
