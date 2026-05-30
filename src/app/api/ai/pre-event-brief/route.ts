import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generatePreEventBrief } from "@/lib/ai-features";
import { briefRateLimiter, checkRateLimit } from "@/lib/rate-limit";
import { preEventBriefSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = preEventBriefSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { eventId } = parsed.data;

  // Rate limit
  const { success, remaining } = await checkRateLimit(
    briefRateLimiter,
    `brief:${session.user.id}`
  );

  if (!success) {
    return NextResponse.json(
      { error: "You've used all 10 briefs for today. Come back tomorrow." },
      { status: 429 }
    );
  }

  const [event, user] = await Promise.all([
    prisma.event.findUnique({ where: { id: eventId } }),
    prisma.user.findUnique({ where: { id: session.user.id } }),
  ]);

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const { brief, tokensUsed } = await generatePreEventBrief(
    event,
    user ?? {}
  );

  await prisma.aiGeneration.create({
    data: {
      userId: session.user.id,
      type: "pre_event_brief",
      eventId,
      input: { eventId },
      output: brief as never,
      tokensUsed,
    },
  });

  return NextResponse.json({ brief, remaining });
}
