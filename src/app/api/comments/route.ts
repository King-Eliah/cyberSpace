import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { commentSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = commentSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { eventId, content, tipType } = parsed.data;
  const parentCommentId = parsed.data.parentCommentId ?? null;

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  if (parentCommentId) {
    const parentComment = await prisma.comment.findFirst({
      where: {
        id: parentCommentId,
        eventId,
        isHidden: false,
      },
    });

    if (!parentComment) {
      return NextResponse.json({ error: "Reply target not found" }, { status: 404 });
    }
  }

  const comment = await prisma.comment.create({
    data: {
      userId: session.user.id,
      eventId,
      content,
      tipType: tipType ?? null,
      parentCommentId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
          college: true,
        },
      },
    },
  });

  return NextResponse.json(comment, { status: 201 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("eventId");

  if (!eventId) {
    return NextResponse.json({ error: "eventId required" }, { status: 400 });
  }

  const comments = await prisma.comment.findMany({
    where: { eventId, isHidden: false },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
          college: true,
        },
      },
    },
  });

  return NextResponse.json(comments);
}
