import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const college = searchParams.get("college");

  const events = await prisma.event.findMany({
    where: {
      status: "APPROVED",
      startsAt: { gte: new Date() },
      ...(category ? { category: category as never } : {}),
      ...(college ? { targetColleges: { has: college as never } } : {}),
    },
    orderBy: { startsAt: "asc" },
    include: { _count: { select: { rsvps: true, comments: true } } },
  });

  return NextResponse.json(events);
}
