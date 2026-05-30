import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateLinkedInPost } from "@/lib/ai-features";
import { linkedinRateLimiter, checkRateLimit } from "@/lib/rate-limit";
import { linkedinPostSchema } from "@/lib/validators";

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

  const { variants, tokensUsed } = await generateLinkedInPost(
    event,
    user ?? {},
    takeaways
  );

  await prisma.aiGeneration.create({
    data: {
      userId: session.user.id,
      type: "linkedin_post",
      eventId,
      input: { takeaways } as never,
      output: { variants } as never,
      tokensUsed,
    },
  });

  return NextResponse.json({ variants, remaining });
}
