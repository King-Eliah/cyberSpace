import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { EventCard } from "@/components/events/EventCard";
import { EventFilters } from "@/components/events/EventFilters";
import type { EventWithRsvp, EventCategory, College } from "@/types";

interface FeedPageProps {
  searchParams: Promise<{
    category?: string;
    college?: string;
    when?: string;
    online?: string;
  }>;
}

async function EventList({
  searchParams,
}: {
  searchParams: Awaited<FeedPageProps["searchParams"]>;
}) {
  const session = await getServerSession(authOptions);

  const now = new Date();
  let dateFilter: Date | undefined;
  if (searchParams.when === "week") {
    dateFilter = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  } else if (searchParams.when === "month") {
    dateFilter = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
  }

  const events = await prisma.event.findMany({
    where: {
      status: "APPROVED",
      startsAt: {
        gte: now,
        ...(dateFilter ? { lte: dateFilter } : {}),
      },
      ...(searchParams.category
        ? { category: searchParams.category as EventCategory }
        : {}),
      ...(searchParams.college
        ? { targetColleges: { has: searchParams.college as College } }
        : {}),
      ...(searchParams.online === "true" ? { isOnline: true } : {}),
    },
    orderBy: { startsAt: "asc" },
    include: {
      _count: { select: { rsvps: true, comments: true } },
    },
  });

  const eventIds = events.map((e) => e.id);

  const userRsvpMap: Record<string, { id: string; status: string } | null> = {};
  if (session && eventIds.length > 0) {
    const allRsvps = await prisma.rsvp.findMany({
      where: { userId: session.user.id, eventId: { in: eventIds } },
    });
    allRsvps.forEach((r) => {
      userRsvpMap[r.eventId] = r;
    });
  }

  const goingCounts: Record<string, number> = {};
  if (eventIds.length > 0) {
    const counts = await prisma.rsvp.groupBy({
      by: ["eventId"],
      where: { eventId: { in: eventIds }, status: "GOING" },
      _count: { eventId: true },
    });
    counts.forEach((c) => {
      goingCounts[c.eventId] = c._count.eventId;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eventsWithRsvp = events.map((event: any) => ({
    ...event,
    userRsvp: userRsvpMap[event.id] ?? null,
    goingCount: goingCounts[event.id] ?? 0,
  })) as EventWithRsvp[];

  if (eventsWithRsvp.length === 0) {
    return (
      <div className="py-16 text-center border border-[#E8E8E3] bg-white">
        <p className="text-[#6B6B63]">No events match your filters.</p>
        <p className="text-sm text-[#6B6B63] mt-1">
          Try broadening your search.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {eventsWithRsvp.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const params = await searchParams;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F0F0E]">Upcoming events</h1>
        <p className="text-[#6B6B63] mt-1">
          On campus, in Kumasi, and remote-friendly.
        </p>
      </div>

      <div className="flex gap-10">
        <Suspense>
          <EventFilters />
        </Suspense>
        <div className="flex-1 min-w-0">
          <Suspense
            fallback={
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="border border-[#E8E8E3] h-24 animate-pulse bg-white"
                  />
                ))}
              </div>
            }
          >
            <EventList searchParams={params} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
