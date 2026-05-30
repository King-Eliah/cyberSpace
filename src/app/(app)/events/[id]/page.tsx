import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, formatTime, CATEGORY_LABELS } from "@/lib/utils";
import { googleCalendarUrl } from "@/lib/google-calendar";
import { RsvpButton } from "@/components/events/RsvpButton";
import { CommentSection } from "@/components/comments/CommentSection";
import { PreEventBriefComponent } from "@/components/ai/PreEventBrief";
import { LinkedInGenerator } from "@/components/ai/LinkedInGenerator";
import type { RsvpStatus } from "@/types";

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      comments: {
        where: { isHidden: false },
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
      },
    },
  });

  if (!event || event.status === "ARCHIVED") notFound();

  const [goingCount, userRsvp] = await Promise.all([
    prisma.rsvp.count({ where: { eventId: id, status: "GOING" } }),
    session
      ? prisma.rsvp.findUnique({
          where: { userId_eventId: { userId: session.user.id, eventId: id } },
        })
      : null,
  ]);

  const attended = userRsvp?.status === "ATTENDED";
  const isPast = new Date(event.startsAt) < new Date();

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs font-semibold border border-[#E8E8E3] px-3 py-1 uppercase tracking-wide">
            {CATEGORY_LABELS[event.category]}
          </span>
          {event.isOnline && (
            <span className="text-xs font-semibold border border-[#E8E8E3] px-3 py-1 uppercase tracking-wide">
              Online
            </span>
          )}
          {isPast && (
            <span className="text-xs font-semibold border border-[#E8E8E3] px-3 py-1 uppercase tracking-wide text-[#6B6B63]">
              Past event
            </span>
          )}
        </div>

        <h1 className="text-4xl font-bold text-[#0F0F0E] leading-tight mb-3">
          {event.title}
        </h1>

        <div className="flex flex-col gap-1 text-[#6B6B63] text-sm mb-6">
          <p>
            <span className="font-medium text-[#0F0F0E]">Organizer:</span>{" "}
            {event.organizer}
          </p>
          <p>
            <span className="font-medium text-[#0F0F0E]">When:</span>{" "}
            {formatDate(event.startsAt)} at {formatTime(event.startsAt)}
            {event.endsAt && ` — ${formatTime(event.endsAt)}`}
          </p>
          {event.location && (
            <p>
              <span className="font-medium text-[#0F0F0E]">Where:</span>{" "}
              {event.location}
            </p>
          )}
        </div>

        {/* RSVP + Calendar */}
        <div className="border-t border-[#E8E8E3] pt-6 flex flex-wrap items-start justify-between gap-4">
          <RsvpButton
            eventId={id}
            currentStatus={userRsvp?.status as RsvpStatus | null}
            goingCount={goingCount}
          />
          {!isPast && (
            <Link
              href={googleCalendarUrl(event as never)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-semibold border border-[#E8E8E3] px-4 py-2 text-[#6B6B63] hover:border-[#C84B31] hover:text-[#C84B31] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Add to Google Calendar
            </Link>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Description */}
        <section>
          <h2 className="text-lg font-bold mb-4">About this event</h2>
          <div className="prose prose-sm max-w-none text-[#0F0F0E] leading-relaxed whitespace-pre-wrap border border-[#E8E8E3] bg-white p-6">
            {event.description}
          </div>
        </section>

        {/* Tags */}
        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {event.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs border border-[#E8E8E3] px-3 py-1 text-[#6B6B63]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Application */}
        {event.requiresApplication && event.applicationUrl && (
          <section className="border border-[#E8E8E3] bg-white p-6">
            <h2 className="text-lg font-bold mb-2">Application required</h2>
            {event.applicationDeadline && (
              <p className="text-sm text-[#6B6B63] mb-4">
                Deadline: {formatDate(event.applicationDeadline)}
              </p>
            )}
            <a
              href={event.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#0F0F0E] text-white px-6 py-3 text-sm font-semibold hover:bg-[#C84B31] transition-colors"
            >
              Apply now
            </a>
          </section>
        )}

        {/* Pre-event brief */}
        {!isPast && session && (
          <section>
            <PreEventBriefComponent eventId={id} />
          </section>
        )}

        {/* LinkedIn generator */}
        {isPast && session && (
          <section>
            <LinkedInGenerator eventId={id} attended={attended} />
          </section>
        )}

        {/* Community tips */}
        <section>
          <CommentSection
            eventId={id}
            comments={event.comments}
            isAuthenticated={!!session}
          />
        </section>
      </div>
    </div>
  );
}
