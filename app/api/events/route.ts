import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/events — list approved events (public) or all events (admin)
export async function GET(req: NextRequest) {
  const session = await auth();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const creatorId = searchParams.get("creatorId");

  // Admin check: DB role OR valid admin-secret header
  const adminSecret = req.headers.get("x-admin-secret");
  const isAdmin =
    session?.user?.role === "admin" ||
    (adminSecret != null && adminSecret === process.env.ADMIN_SECRET);

  const where: Record<string, unknown> = {};

  if (isAdmin && status) {
    where.status = status;
  } else if (isAdmin && !status && !creatorId) {
    // Admin fetching all events with no filter
  } else if (creatorId && session?.user?.id === creatorId) {
    // Creator viewing their own events
    where.creatorId = creatorId;
  } else {
    where.status = "approved";
  }

  const events = await prisma.event.findMany({
    where,
    include: {
      creator: {
        select: {
          id: true,
          username: true,
          displayName: true,
          image: true,
          verified: true,
          twitterUrl: true,
        },
      },
    },
    orderBy: { startTime: "asc" },
  });

  return NextResponse.json(events);
}

// POST /api/events — create a new event (admin only, auto-approved)
export async function POST(req: NextRequest) {
  const adminSecret = req.headers.get("x-admin-secret");
  if (!adminSecret || adminSecret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const {
    title,
    description,
    bannerImage,
    eventType,
    language,
    timezone,
    startTime,
    endTime,
    externalLink,
    twitterLink,
    streamLink,
    abstractPortalLink,
    tags,
    recurrenceType,
    recurrenceDays,
  } = body;

  if (!title || !eventType || !startTime || !endTime) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Generate slug from title + timestamp
  const slug =
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 60) +
    "-" +
    Date.now().toString(36);

  // Use the site owner (first user in DB) as the creator
  const ownerUser = await prisma.user.findFirst({
    select: { id: true },
    orderBy: { createdAt: "asc" },
  });

  if (!ownerUser) {
    return NextResponse.json(
      { error: "No user found in database — please log in once first" },
      { status: 500 }
    );
  }

  const event = await prisma.event.create({
    data: {
      slug,
      title,
      description: description || "",
      bannerImage: bannerImage || null,
      eventType,
      language: language || "English",
      timezone: timezone || "UTC",
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      externalLink: externalLink || null,
      twitterLink: twitterLink || null,
      streamLink: streamLink || null,
      abstractPortalLink: abstractPortalLink || null,
      tags: tags || [],
      recurrenceType: recurrenceType || "none",
      recurrenceDays: recurrenceDays || [],
      status: "approved", // admin-created events are published immediately
      creatorId: ownerUser.id,
    },
    include: {
      creator: true,
    },
  });

  return NextResponse.json(event, { status: 201 });
}
