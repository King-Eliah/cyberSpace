import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { COLLEGE_LABELS, formatDate } from "@/lib/utils";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      rsvps: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { event: { select: { id: true, title: true, startsAt: true, category: true } } },
      },
      _count: { select: { rsvps: true, comments: true } },
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#0F0F0E]">Your profile</h1>
      </div>

      <div className="space-y-6">
        {/* Profile card */}
        <div className="border border-[#E8E8E3] bg-white p-6">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-[#0F0F0E] flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-[#6B6B63] text-sm">@{user.username}</p>
              <p className="text-[#6B6B63] text-sm mt-1">
                {COLLEGE_LABELS[user.college]}
                {user.program && ` · ${user.program}`}
                {user.yearOfStudy && ` · Year ${user.yearOfStudy}`}
              </p>
              {user.bio && (
                <p className="text-sm text-[#0F0F0E] mt-3 leading-relaxed">
                  {user.bio}
                </p>
              )}
              {user.linkedinUrl && (
                <a
                  href={user.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#C84B31] mt-2 inline-block hover:underline"
                >
                  LinkedIn profile
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="border border-[#E8E8E3] bg-white p-5">
            <p className="text-3xl font-bold">{user._count.rsvps}</p>
            <p className="text-sm text-[#6B6B63] mt-1">Events RSVPed</p>
          </div>
          <div className="border border-[#E8E8E3] bg-white p-5">
            <p className="text-3xl font-bold">{user._count.comments}</p>
            <p className="text-sm text-[#6B6B63] mt-1">Tips posted</p>
          </div>
        </div>

        {/* Interests */}
        {user.interests.length > 0 && (
          <div className="border border-[#E8E8E3] bg-white p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#6B6B63] mb-4">
              Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest) => (
                <span
                  key={interest}
                  className="text-sm border border-[#E8E8E3] px-3 py-1 text-[#0F0F0E]"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recent RSVPs */}
        {user.rsvps.length > 0 && (
          <div className="border border-[#E8E8E3] bg-white p-6">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-[#6B6B63] mb-4">
              Recent events
            </h3>
            <div className="space-y-3">
              {user.rsvps.map((rsvp) => (
                <div
                  key={rsvp.id}
                  className="flex items-center justify-between gap-4 text-sm"
                >
                  <div>
                    <a
                      href={`/events/${rsvp.event.id}`}
                      className="font-medium text-[#0F0F0E] hover:text-[#C84B31] transition-colors"
                    >
                      {rsvp.event.title}
                    </a>
                    <p className="text-xs text-[#6B6B63] mt-0.5">
                      {formatDate(rsvp.event.startsAt)}
                    </p>
                  </div>
                  <span className="text-xs text-[#6B6B63] border border-[#E8E8E3] px-2 py-0.5 flex-shrink-0">
                    {rsvp.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Account info */}
        <div className="border border-[#E8E8E3] bg-white p-6">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-[#6B6B63] mb-4">
            Account
          </h3>
          <p className="text-sm text-[#0F0F0E]">{user.email}</p>
          <p className="text-xs text-[#6B6B63] mt-1">
            Joined {formatDate(user.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
