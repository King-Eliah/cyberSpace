import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import type { ApplicationStatus } from "@/types";

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  SAVED: "Saved",
  APPLIED: "Applied",
  INTERVIEWING: "Interviewing",
  OFFER: "Offer",
  REJECTED: "Rejected",
};

const KANBAN_COLUMNS: ApplicationStatus[] = [
  "SAVED",
  "APPLIED",
  "INTERVIEWING",
  "OFFER",
  "REJECTED",
];

async function SaveButton({
  internshipId,
  userId,
}: {
  internshipId: string;
  userId?: string;
}) {
  if (!userId) {
    return (
      <a
        href="/login"
        className="text-xs border border-[#E8E8E3] px-3 py-1.5 text-[#6B6B63] hover:border-[#0F0F0E] hover:text-[#0F0F0E] transition-colors"
      >
        Save
      </a>
    );
  }

  const app = await prisma.application.findUnique({
    where: { userId_internshipId: { userId, internshipId } },
  });

  return (
    <form
      action={`/api/internships/${internshipId}/apply`}
      method="POST"
      className="flex gap-2"
    >
      {app ? (
        <span className="text-xs font-medium text-[#C84B31] border border-[#C84B31] px-3 py-1.5">
          {STATUS_LABELS[app.status as ApplicationStatus]}
        </span>
      ) : (
        <button
          type="submit"
          className="text-xs border border-[#E8E8E3] px-3 py-1.5 text-[#6B6B63] hover:border-[#0F0F0E] hover:text-[#0F0F0E] transition-colors"
        >
          Save
        </button>
      )}
    </form>
  );
}

export default async function InternshipsPage() {
  const session = await getServerSession(authOptions);

  const internships = await prisma.internship.findMany({
    where: { status: "active" },
    orderBy: { createdAt: "desc" },
  });

  const userApplications = session
    ? await prisma.application.findMany({
        where: { userId: session.user.id },
        include: { internship: true },
      })
    : [];

  const appsByStatus = KANBAN_COLUMNS.reduce(
    (acc, col) => {
      acc[col] = userApplications.filter((a) => a.status === col);
      return acc;
    },
    {} as Record<ApplicationStatus, typeof userApplications>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F0F0E]">Internships</h1>
        <p className="text-[#6B6B63] mt-1">
          Ghana-based and remote-friendly roles for KNUST students.
        </p>
      </div>

      {/* Kanban tracker */}
      {session && userApplications.length > 0 && (
        <section className="mb-12">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-[#6B6B63] mb-4">
            Your applications
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {KANBAN_COLUMNS.map((col) => (
              <div key={col} className="border border-[#E8E8E3] bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#6B6B63] mb-3">
                  {STATUS_LABELS[col]}{" "}
                  <span className="font-normal">({appsByStatus[col].length})</span>
                </p>
                <div className="space-y-2">
                  {appsByStatus[col].map((app) => (
                    <div
                      key={app.id}
                      className="text-xs border border-[#E8E8E3] p-2"
                    >
                      <p className="font-medium text-[#0F0F0E] leading-snug">
                        {app.internship.title}
                      </p>
                      <p className="text-[#6B6B63] mt-0.5">
                        {app.internship.company}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Listings */}
      <div className="space-y-2">
        {internships.map((internship) => (
          <div
            key={internship.id}
            className="event-card border border-[#E8E8E3] bg-white p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h3 className="font-bold text-base text-[#0F0F0E]">
                    {internship.company}
                  </h3>
                  {internship.isRemote && (
                    <span className="text-xs font-medium border border-[#E8E8E3] px-2 py-0.5 text-[#6B6B63]">
                      Remote OK
                    </span>
                  )}
                  {internship.isPaid && (
                    <span className="text-xs font-medium border border-[#E8E8E3] px-2 py-0.5 text-[#6B6B63]">
                      Paid
                    </span>
                  )}
                </div>
                <p className="text-[#0F0F0E] font-medium text-sm mb-1">
                  {internship.title}
                </p>
                <p className="text-sm text-[#6B6B63] mb-2">
                  {internship.location && (
                    <span>{internship.location} &middot; </span>
                  )}
                  {internship.experienceLevel}
                  {internship.stipendRange && (
                    <span> &middot; {internship.stipendRange}</span>
                  )}
                  {internship.applicationDeadline && (
                    <span>
                      {" "}
                      &middot; Deadline:{" "}
                      {formatDate(internship.applicationDeadline)}
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {internship.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs border border-[#E8E8E3] px-2 py-0.5 text-[#6B6B63]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <a
                  href={internship.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-[#0F0F0E] text-white px-4 py-2 font-medium hover:bg-[#C84B31] transition-colors text-center"
                >
                  Apply
                </a>
                <SaveButton
                  internshipId={internship.id}
                  userId={session?.user.id}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
