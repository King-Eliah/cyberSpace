import type { Event } from "@/types";

export function googleCalendarUrl(event: Event): string {
  const start = new Date(event.startsAt);
  const end = event.endsAt
    ? new Date(event.endsAt)
    : new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `${event.description.slice(0, 400)}\n\nOrganizer: ${event.organizer}`,
    location: event.location ?? (event.isOnline ? "Online" : "KNUST, Kumasi"),
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
