import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateLinkedInPost } from "@/lib/ai-features";
import { AiFormatError, AiUnavailableError } from "@/lib/gemini";
import { linkedinRateLimiter, checkRateLimit } from "@/lib/rate-limit";
import { linkedinPostSchema } from "@/lib/validators";

// Gemini calls run 5-35s; the platform default cuts them off well before that.
export const maxDuration = 60;

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = linkedinPostSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { eventId, takeaways } = parsed.data;

  // Rate limit
  const { success, remaining } = await checkRateLimit(
    linkedinRateLimiter,
    `linkedin:${session.user.id}`
  );

  if (!success) {
    return NextResponse.json(
      { error: "You've used all 5 LinkedIn posts for today. Come back tomorrow." },
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

  let variants, tokensUsed;
  try {
    ({ variants, tokensUsed } = await generateLinkedInPost(
      event,
      user ?? {},
      takeaways
    ));
  } catch (error) {
    console.error("[ai/linkedin-post] generation failed", error);

    if (error instanceof AiUnavailableError) {
      return NextResponse.json(
        { error: "The writing assistant is unreachable right now. Try again in a moment." },
        { status: 503 }
      );
    }
    if (error instanceof AiFormatError) {
      return NextResponse.json(
        { error: "We couldn't shape that into a post. Try rewording your takeaways." },
        { status: 502 }
      );
    }
    return NextResponse.json(
      { error: "Something went wrong generating your post." },
      { status: 500 }
    );
  }

  // Logging the generation must never fail the request the user actually made.
  try {
    await prisma.aiGeneration.create({
      data: {
        userId: session.user.id,
        type: "linkedin_post",
        eventId,
        input: { takeaways },
        output: { variants: variants as object[] },
        tokensUsed,
      },
    });
  } catch (error) {
    console.error("[ai/linkedin-post] failed to record generation", error);
  }

  return NextResponse.json({ variants, remaining });
}
