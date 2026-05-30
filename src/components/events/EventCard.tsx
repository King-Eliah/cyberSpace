"use client";

import Link from "next/link";
import { formatDateShort, CATEGORY_LABELS, COLLEGE_LABELS } from "@/lib/utils";
import type { EventWithRsvp } from "@/types";

interface EventCardProps {
  event: EventWithRsvp;
}

const RSVP_LABELS = {
  INTERESTED: "Interested",
  GOING: "Going",
  ATTENDED: "Attended",
  MISSED: "Missed",
};

export function EventCard({ event }: EventCardProps) {
  const { month, day } = formatDateShort(event.startsAt);
  const isPast = new Date(event.startsAt) < new Date();

  return (
    <Link href={`/events/${event.id}`}>
      <article className="event-card border border-[#E8E8E3] bg-white p-5 transition-colors cursor-pointer">
        <div className="flex gap-6">
          {/* Date column */}
          <div className="text-center min-w-[52px] flex-shrink-0 pt-0.5">
            <p className="text-xs font-semibold text-[#6B6B63] uppercase tracking-wider leading-none">
              {month}
            </p>
            <p className="text-4xl font-bold leading-none mt-1 text-[#0F0F0E]">
              {day}
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3
                  className={`font-bold text-base leading-snug truncate ${
                    isPast ? "text-[#6B6B63]" : "text-[#0F0F0E]"
                  }`}
                >
                  {event.title}
                </h3>
                <p className="text-sm text-[#6B6B63] mt-0.5">
                  {event.organizer}
                  {event.location && (
                    <> &middot; {event.location}</>
                  )}
                  {event.isOnline && !event.location && (
                    <> &middot; Online</>
                  )}
                </p>
              </div>
              {event.userRsvp && (
                <span className="text-xs font-semibold text-[#C84B31] whitespace-nowrap flex-shrink-0">
                  {RSVP_LABELS[event.userRsvp.status]} ✓
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-xs font-medium border border-[#E8E8E3] px-2 py-0.5 text-[#0F0F0E]">
                {CATEGORY_LABELS[event.category]}
              </span>
              {event.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-[#6B6B63] border border-[#E8E8E3] px-2 py-0.5"
                >
                  {tag}
                </span>
              ))}
              {event.targetColleges.slice(0, 2).map((college) => (
                <span
                  key={college}
                  className="text-xs text-[#6B6B63] border border-[#E8E8E3] px-2 py-0.5"
                >
                  {college}
                </span>
              ))}
              {event.requiresApplication && (
                <span className="text-xs font-medium text-[#C84B31] border border-[#C84B31] px-2 py-0.5">
                  Apply required
                </span>
              )}
              {event.goingCount > 0 && (
                <span className="text-xs text-[#6B6B63] ml-auto">
                  {event.goingCount} going
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
