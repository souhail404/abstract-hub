import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/events — list approved events (public) or all events (admin)
export async function GET(req: NextRequest) {
  const session = await auth();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const creatorId = searchParams.get("creatorId");

  const isAdmin = session?.user?.role === "admin";

  const where: Record<string, unknown> = {};

  if (isAdmin && status) {
    where.status = status;
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

// POST /api/events — submit a new event (requires auth)
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
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

  if (!title || !description || !eventType || !startTime || !endTime) {
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

  // Ensure the user exists as a creator (promote role)
  await prisma.user.update({
    where: { id: session.user.id },
    data: { role: session.user.role === "admin" ? "admin" : "creator" },
  });

  const event = await prisma.event.create({
    data: {
      slug,
      title,
      description,
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
      status: "pending",
      creatorId: session.user.id,
    },
    include: {
      creator: true,
    },
  });

  return NextResponse.json(event, { status: 201 });
}
