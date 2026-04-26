import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// GET /api/me — return the current user's full profile
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      username: true,
      displayName: true,
      bio: true,
      twitterUrl: true,
      websiteUrl: true,
      verified: true,
      createdAt: true,
      _count: { select: { events: true } },
    },
  });

  return NextResponse.json(user);
}

// PATCH /api/me — update creator profile
export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { username, displayName, bio, twitterUrl, websiteUrl } = body;

  // Check username uniqueness if changing it
  if (username) {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing && existing.id !== session.user.id) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(username !== undefined && { username }),
      ...(displayName !== undefined && { displayName }),
      ...(bio !== undefined && { bio }),
      ...(twitterUrl !== undefined && { twitterUrl }),
      ...(websiteUrl !== undefined && { websiteUrl }),
    },
  });

  return NextResponse.json(user);
}
