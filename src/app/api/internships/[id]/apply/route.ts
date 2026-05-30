import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.redirect(new URL("/login", _request.url));
  }

  const { id: internshipId } = await params;

  const internship = await prisma.internship.findUnique({
    where: { id: internshipId },
  });
  if (!internship) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.application.upsert({
    where: {
      userId_internshipId: { userId: session.user.id, internshipId },
    },
    update: {},
    create: {
      userId: session.user.id,
      internshipId,
      status: "SAVED",
    },
  });

  return NextResponse.redirect(new URL("/internships", _request.url));
}
