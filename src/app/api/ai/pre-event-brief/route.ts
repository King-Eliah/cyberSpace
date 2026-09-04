import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generatePreEventBrief } from "@/lib/ai-features";
import { AiFormatError, AiUnavailableError } from "@/lib/gemini";
import { briefRateLimiter, checkRateLimit } from "@/lib/rate-limit";
import { preEventBriefSchema } from "@/lib/validators";

// Gemini calls run 5-35s; the platform default cuts them off well before that.
export const maxDuration = 60;

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

  let brief, tokensUsed;
  try {
    ({ brief, tokensUsed } = await generatePreEventBrief(event, user ?? {}));
  } catch (error) {
    console.error("[ai/pre-event-brief] generation failed", error);

    if (error instanceof AiUnavailableError) {
      return NextResponse.json(
        { error: "The brief generator is unreachable right now. Try again in a moment." },
        { status: 503 }
      );
    }
    if (error instanceof AiFormatError) {
      return NextResponse.json(
        { error: "We couldn't put a brief together for this event." },
        { status: 502 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong generating your brief." },
      { status: 500 }
    );
  }

  // Logging the generation must never fail the request the user actually made.
  try {
    await prisma.aiGeneration.create({
      data: {
        userId: session.user.id,
        type: "pre_event_brief",
        eventId,
        input: { eventId },
        output: { ...brief },
        tokensUsed,
      },
    });
  } catch (error) {
    console.error("[ai/pre-event-brief] failed to record generation", error);
  }

  return NextResponse.json({ brief, remaining });
}
