/**
 * prisma/seed.ts
 * ─────────────────────────────────────────────────────────────
 * Reads seed-events.json and seed-internships.json and writes
 * them to your database.
 *
 * Run: npx prisma db seed
 * (after running: npx tsx scripts/seed-data.ts first)
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { config } from "dotenv";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

config({ path: ".env.local" });
config({ path: ".env" });

const raw = process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "";
const clean = raw.replace(/[?&]pgbouncer=true/g, "").trim();

let pool: Pool;
try {
  const u = new URL(clean);
  pool = new Pool({
    host: u.hostname, port: Number(u.port) || 5432,
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, ""),
    ssl: { rejectUnauthorized: false },
  });
} catch {
  pool = new Pool({ connectionString: clean, ssl: { rejectUnauthorized: false } });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = new PrismaClient({ adapter: new PrismaPg(pool as any) } as any);

async function main() {
  console.log("🌱 Seeding database...\n");

  const eventsPath = path.join(__dirname, "seed-events.json");
  const internshipsPath = path.join(__dirname, "seed-internships.json");

  if (!fs.existsSync(eventsPath)) {
    console.error(
      "❌ seed-events.json not found.\n   Run first: npx tsx scripts/seed-data.ts"
    );
    process.exit(1);
  }

  const events = JSON.parse(fs.readFileSync(eventsPath, "utf-8")) as Record<string, unknown>[];
  const internships = JSON.parse(fs.readFileSync(internshipsPath, "utf-8")) as Record<string, unknown>[];

  // ── Seed events ──────────────────────────────────────────────────────────────
  console.log(`Seeding ${events.length} events...`);

  for (const event of events) {
    const id = generateDeterministicId(String(event.title) + String(event.startsAt));

    await db.event.upsert({
      where: { id },
      update: {},
      create: {
        id,
        title: String(event.title),
        description: String(event.description),
        startsAt: new Date(String(event.startsAt)),
        endsAt: event.endsAt ? new Date(String(event.endsAt)) : null,
        location: event.location ? String(event.location) : null,
        isOnline: Boolean(event.isOnline),
        category: (event.category as never) ?? "OTHER",
        tags: (event.tags as string[]) ?? [],
        targetColleges: (event.targetColleges as never[]) ?? [],
        organizer: String(event.organizer),
        coverImageUrl: event.coverImageUrl ? String(event.coverImageUrl) : null,
        requiresApplication: Boolean(event.requiresApplication),
        applicationUrl: event.applicationUrl ? String(event.applicationUrl) : null,
        applicationDeadline: event.applicationDeadline
          ? new Date(String(event.applicationDeadline))
          : null,
        status: "APPROVED",
        source: event.source ? String(event.source) : "curated",
        sourceUrl: event.sourceUrl ? String(event.sourceUrl) : null,
      },
    });
  }

  console.log("✅ Events seeded\n");

  // ── Seed internships ─────────────────────────────────────────────────────────
  console.log(`Seeding ${internships.length} internships...`);

  for (const job of internships) {
    const id = generateDeterministicId(String(job.title) + String(job.company));

    await db.internship.upsert({
      where: { id },
      update: {},
      create: {
        id,
        title: String(job.title),
        company: String(job.company),
        description: String(job.description),
        location: job.location ? String(job.location) : null,
        isRemote: Boolean(job.isRemote),
        isPaid: Boolean(job.isPaid),
        stipendRange: job.stipendRange ? String(job.stipendRange) : null,
        applicationUrl: String(job.applicationUrl),
        applicationDeadline: job.applicationDeadline
          ? new Date(String(job.applicationDeadline))
          : null,
        tags: (job.tags as string[]) ?? [],
        experienceLevel: job.experienceLevel ? String(job.experienceLevel) : "Entry-level",
        source: job.source ? String(job.source) : "curated",
        status: "active",
      },
    });
  }

  console.log("✅ Internships seeded\n");

  // ── Past events for demo ─────────────────────────────────────────────────────
  console.log("Seeding past events for demo...");
  const ago = (days: number) => new Date(Date.now() - days * 86400000);

  const pastEvents = [
    {
      id: "past-event-001",
      title: "GDG Kumasi Intro to Flutter Workshop",
      description: "A hands-on 4-hour workshop covering Flutter basics, state management with Provider, and deploying a simple mobile app. 60 students attended. Facilitator Kwame Asante from Google Developer Group walked through building a complete event-listing app from scratch.\n\nParticipants who finished the lab got a Google Developer certificate and Cloud credits.",
      startsAt: ago(35), endsAt: ago(35),
      location: "CS Department Lab 2, KNUST",
      isOnline: false, category: "WORKSHOP" as never,
      tags: ["Flutter", "Dart", "Mobile", "Google", "free"],
      targetColleges: ["COE", "COS"] as never[],
      organizer: "GDG Kumasi",
      requiresApplication: false, status: "APPROVED" as never, source: "curated",
    },
    {
      id: "past-event-002",
      title: "IEEE KNUST: Python for Data Science Bootcamp",
      description: "Two-day bootcamp covering pandas, NumPy, matplotlib, and intro to scikit-learn. Real Ghanaian datasets used — crop yield data from MOFA and MTN subscriber trends. Final project: build a dashboard that visualizes data relevant to Ghana's development goals.\n\nBest projects featured in IEEE KNUST newsletter. Certificate provided.",
      startsAt: ago(21), endsAt: ago(20),
      location: "Mathematics Department, KNUST",
      isOnline: false, category: "WORKSHOP" as never,
      tags: ["Python", "Data Science", "pandas", "IEEE", "certificate"],
      targetColleges: ["COE", "COS", "KSB"] as never[],
      organizer: "IEEE KNUST Student Branch",
      requiresApplication: false, status: "APPROVED" as never, source: "curated",
    },
    {
      id: "past-event-003",
      title: "KNUST Entrepreneurship & Tech Summit 2025",
      description: "Annual summit bringing together student founders, industry mentors, and investors. 12 student teams pitched. Top prize: GHS 8,000 seed grant won by a team building an AgriTech solution for smallholder farmers in Brong-Ahafo.\n\nSpeakers from MEST Africa, Injaro Investments, and Farmerline. 300+ students attended across both days.",
      startsAt: ago(14), endsAt: ago(13),
      location: "KNUST Great Hall, Kumasi",
      isOnline: false, category: "CONFERENCE" as never,
      tags: ["entrepreneurship", "pitch", "startup", "AgriTech", "summit"],
      targetColleges: ["KSB", "COE", "COS", "COAS"] as never[],
      organizer: "KNUST Entrepreneurship Club",
      requiresApplication: false, status: "APPROVED" as never, source: "curated",
    },
  ];

  for (const ev of pastEvents) {
    await db.event.upsert({
      where: { id: ev.id },
      update: {},
      create: ev,
    });
  }

  // ── Demo user ─────────────────────────────────────────────────────────────────
  console.log("Seeding demo user...");
  const demoPassword = await bcrypt.hash("Demo2025!", 12);

  const demoUser = await db.user.upsert({
    where: { email: "demo@st.knust.edu.gh" },
    update: {},
    create: {
      email: "demo@st.knust.edu.gh",
      password: demoPassword,
      name: "Kofi Mensah",
      username: "kofi_mensah",
      college: "COE" as never,
      program: "Computer Engineering",
      yearOfStudy: 3,
      interests: ["AI/ML", "Startups", "Fintech", "Mobile Dev"],
      bio: "Building things that matter. COE Year 3. Open to internships.",
      linkedinUrl: "https://linkedin.com/in/kofi-mensah",
    },
  });

  // ── RSVPs (ATTENDED) for ALL users on past events ────────────────────────────
  const allUsers = await db.user.findMany({ select: { id: true } });
  for (const u of allUsers) {
    for (const eventId of ["past-event-001", "past-event-002", "past-event-003"]) {
      await db.rsvp.upsert({
        where: { userId_eventId: { userId: u.id, eventId } },
        update: {},
        create: { userId: u.id, eventId, status: "ATTENDED" as never },
      });
    }
  }

  // ── Tips/comments on past events ─────────────────────────────────────────────
  const tips = [
    { eventId: "past-event-001", content: "The hands-on session is where the real learning happened. Don't just follow along — break things intentionally so you understand why they work.", tipType: "BEST_PART" as never },
    { eventId: "past-event-001", content: "Your laptop needs at least 8GB RAM for Flutter + emulator to run smoothly. If yours is lower, pair with someone.", tipType: "BRING_THIS" as never },
    { eventId: "past-event-001", content: "Talk to Kwame Asante after — he reviews student projects and has referred people to GDG internships.", tipType: "TALK_TO" as never },
    { eventId: "past-event-002", content: "Day 2 was miles better than Day 1. If you already know Python basics, skip the morning of Day 1 and come for the afternoon.", tipType: "BEST_PART" as never },
    { eventId: "past-event-002", content: "The dataset they use is publicly available on Ghana's open data portal. Download it before the session so you spend less time on setup.", tipType: "BRING_THIS" as never },
    { eventId: "past-event-003", content: "The AgriTech team that won were 2nd years. Don't think your idea isn't polished enough — enter and get the feedback.", tipType: "BEST_PART" as never },
    { eventId: "past-event-003", content: "The Injaro Investments guy (Michael) stays for networking after. He's very approachable and gives honest feedback on ideas.", tipType: "TALK_TO" as never },
    { eventId: "past-event-003", content: "Skip the first hour — it's logistics. Arrive for the 10am keynote. The real value is the afternoon pitch session and networking.", tipType: "SKIP_THIS" as never },
  ];

  for (const tip of tips) {
    const id = generateDeterministicId(`tip-${tip.eventId}-${tip.content.slice(0, 20)}`);
    await db.comment.upsert({
      where: { id },
      update: {},
      create: { id, userId: demoUser.id, ...tip },
    });
  }

  console.log("✅ Demo data seeded (user: demo@st.knust.edu.gh / Demo2025!)\n");
  console.log("🎉 Database seeded successfully!");
}

// Deterministic ID from a string — keeps seeds idempotent across re-runs
function generateDeterministicId(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `seed${Math.abs(hash).toString(36).padStart(20, "0")}`;
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
