import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDateShort, CATEGORY_LABELS, COLLEGE_LABELS } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, name: true, college: true, program: true, yearOfStudy: true,
      _count: { select: { rsvps: true, comments: true } },
    },
  });
  if (!user) redirect("/login");

  const [upcomingRsvps, attendedRsvps, aiGenerations] = await Promise.all([
    prisma.rsvp.findMany({
      where: {
        userId: session.user.id,
        status: { in: ["GOING", "INTERESTED"] },
        event: { startsAt: { gte: new Date() } },
      },
      include: { event: true },
      orderBy: { event: { startsAt: "asc" } },
      take: 6,
    }),
    prisma.rsvp.findMany({
      where: {
        userId: session.user.id,
        status: "ATTENDED",
      },
      include: {
        event: {
          include: {
            comments: {
              where: { userId: session.user.id },
              select: { id: true },
            },
          },
        },
      },
      orderBy: { event: { startsAt: "desc" } },
      take: 6,
    }),
    prisma.aiGeneration.count({ where: { userId: session.user.id, type: "linkedin_post" } }),
  ]);

  const firstName = user.name.split(" ")[0];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* Header */}
      <div className="mb-10 pb-8 border-b border-[#E8E8E3]">
        <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#6B6B63] mb-2">
          {greeting}
        </p>
        <h1 className="text-4xl font-black text-[#0F0F0E] mb-2">{firstName}.</h1>
        <p className="text-[#6B6B63] text-sm">
          {COLLEGE_LABELS[user.college]}
          {user.program && ` · ${user.program}`}
          {user.yearOfStudy && ` · Year ${user.yearOfStudy}`}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {[
          { n: upcomingRsvps.length, label: "Upcoming", sub: "events RSVPed" },
          { n: attendedRsvps.length, label: "Attended", sub: "events so far" },
          { n: user._count.comments, label: "Tips", sub: "posted for others" },
          { n: aiGenerations, label: "Posts", sub: "LinkedIn generated" },
        ].map((s) => (
          <div key={s.label} className="border border-[#E8E8E3] bg-white p-5">
            <p className="text-4xl font-black text-[#0F0F0E] leading-none mb-1">{s.n}</p>
            <p className="text-sm font-semibold text-[#0F0F0E]">{s.label}</p>
            <p className="text-xs text-[#6B6B63] mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Upcoming */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-[#6B6B63]">
              Upcoming
            </h2>
            <Link href="/feed" className="text-xs text-[#C84B31] hover:underline font-medium">
              Browse all →
            </Link>
          </div>
          {upcomingRsvps.length === 0 ? (
            <div className="border border-[#E8E8E3] bg-white p-6 text-center">
              <p className="text-sm text-[#6B6B63]">No upcoming events yet.</p>
              <Link href="/feed" className="text-xs text-[#C84B31] font-medium mt-2 inline-block hover:underline">
                Find something to attend →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingRsvps.map((rsvp) => {
                const { month, day } = formatDateShort(rsvp.event.startsAt);
                return (
                  <Link key={rsvp.id} href={`/events/${rsvp.event.id}`}>
                    <div className="event-card flex gap-5 border border-[#E8E8E3] bg-white p-4 transition-colors cursor-pointer">
                      <div className="text-center min-w-[40px] flex-shrink-0">
                        <p className="text-[9px] font-bold text-[#6B6B63] uppercase tracking-wider">{month}</p>
                        <p className="text-2xl font-black leading-none text-[#0F0F0E]">{day}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[#0F0F0E] truncate">{rsvp.event.title}</p>
                        <p className="text-xs text-[#6B6B63] mt-0.5">{rsvp.event.organizer}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] font-bold border border-[#E8E8E3] px-2 py-0.5 text-[#6B6B63] uppercase">
                            {CATEGORY_LABELS[rsvp.event.category]}
                          </span>
                          <span className={`text-[10px] font-bold uppercase ${rsvp.status === "GOING" ? "text-[#C84B31]" : "text-[#6B6B63]"}`}>
                            {rsvp.status === "GOING" ? "Going ✓" : "Interested"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Attended */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-[#6B6B63]">
              Attended
            </h2>
            <span className="text-xs text-[#6B6B63]">Click to write a LinkedIn post</span>
          </div>
          {attendedRsvps.length === 0 ? (
            <div className="border border-[#E8E8E3] bg-white p-6 text-center">
              <p className="text-sm text-[#6B6B63]">No attended events yet.</p>
              <p className="text-xs text-[#6B6B63] mt-1">After an event, mark it as Attended to unlock the LinkedIn generator.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {attendedRsvps.map((rsvp) => {
                const { month, day } = formatDateShort(rsvp.event.startsAt);
                const hasTips = rsvp.event.comments.length > 0;
                return (
                  <Link key={rsvp.id} href={`/events/${rsvp.event.id}`}>
                    <div className="event-card flex gap-5 border border-[#E8E8E3] bg-white p-4 transition-colors cursor-pointer group">
                      <div className="text-center min-w-[40px] flex-shrink-0">
                        <p className="text-[9px] font-bold text-[#6B6B63] uppercase tracking-wider">{month}</p>
                        <p className="text-2xl font-black leading-none text-[#6B6B63]">{day}</p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[#0F0F0E] truncate">{rsvp.event.title}</p>
                        <p className="text-xs text-[#6B6B63] mt-0.5">{rsvp.event.organizer}</p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className="text-[10px] font-bold text-green-600 uppercase">Attended ✓</span>
                          {hasTips && (
                            <span className="text-[10px] text-[#6B6B63]">You left a tip</span>
                          )}
                          <span className="text-[10px] font-semibold text-[#C84B31] ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            Write LinkedIn post →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* LinkedIn CTA if attended events exist */}
      {attendedRsvps.length > 0 && (
        <div className="mt-8 border border-[#C84B31] bg-white p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="font-bold text-[#0F0F0E]">
              You&apos;ve attended {attendedRsvps.length} {attendedRsvps.length === 1 ? "event" : "events"}.
            </p>
            <p className="text-sm text-[#6B6B63] mt-0.5">
              Turn each one into a LinkedIn post. Click any attended event above, scroll down, and hit &ldquo;Generate 3 variants&rdquo;.
            </p>
          </div>
          <Link
            href={`/events/${attendedRsvps[0].event.id}`}
            className="flex-shrink-0 bg-[#C84B31] text-white px-6 py-3 text-sm font-bold hover:bg-[#0F0F0E] transition-colors whitespace-nowrap"
          >
            Start with {attendedRsvps[0].event.title.split(" ").slice(0, 3).join(" ")}... →
          </Link>
        </div>
      )}

      {/* Quick actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { href: "/feed", label: "Browse events", sub: "See what's coming up" },
          { href: "/internships", label: "Internships", sub: "Ghana & remote roles" },
          { href: "/profile", label: "Your profile", sub: "Update your info" },
        ].map((a) => (
          <Link key={a.href} href={a.href}>
            <div className="event-card border border-[#E8E8E3] bg-white p-5 transition-colors cursor-pointer">
              <p className="font-bold text-sm text-[#0F0F0E]">{a.label}</p>
              <p className="text-xs text-[#6B6B63] mt-1">{a.sub}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
