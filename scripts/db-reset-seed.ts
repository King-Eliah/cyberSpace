/**
 * Deletes seeded content (events, internships, and everything cascading from
 * them) so `npx prisma db seed` can rebuild a clean state. Does NOT touch users.
 * Run: npx tsx scripts/db-reset-seed.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const raw = process.env.DIRECT_URL ?? process.env.DATABASE_URL!;
const u = new URL(raw);
const pool = new Pool({
  host: u.hostname,
  port: Number(u.port) || 5432,
  user: decodeURIComponent(u.username),
  password: decodeURIComponent(u.password),
  database: u.pathname.slice(1),
  ssl: { rejectUnauthorized: false },
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = new PrismaClient({ adapter: new PrismaPg(pool as any) } as any);

async function main() {
  console.log("host:", u.hostname);
  console.log("before:", {
    events: await db.event.count(),
    internships: await db.internship.count(),
    users: await db.user.count(),
  });

  // Comments and RSVPs cascade from Event; Applications cascade from Internship.
  const comments = await db.comment.deleteMany({});
  const rsvps = await db.rsvp.deleteMany({});
  const apps = await db.application.deleteMany({});
  const events = await db.event.deleteMany({});
  const internships = await db.internship.deleteMany({});

  console.log("deleted:", {
    comments: comments.count,
    rsvps: rsvps.count,
    applications: apps.count,
    events: events.count,
    internships: internships.count,
  });
  console.log("users left untouched:", await db.user.count());
}

main()
  .catch((e) => {
    console.error("FAILED:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
    await pool.end();
  });
