/**
 * Quick health check against whatever DATABASE_URL points at.
 * Run: npx tsx scripts/db-check.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const u = new URL(process.env.DATABASE_URL!);
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
  const now = new Date();
  console.log("host:", u.hostname);
  console.log("now: ", now.toISOString());
  console.log("events total:      ", await db.event.count());
  console.log("events upcoming:   ", await db.event.count({ where: { startsAt: { gte: now } } }));
  console.log("events APPROVED+up:", await db.event.count({ where: { status: "APPROVED", startsAt: { gte: now } } }));
  console.log("internships:       ", await db.internship.count());
  console.log("users:             ", await db.user.count());
  console.log("rsvps:             ", await db.rsvp.count());

  const rows = await db.event.findMany({
    orderBy: { startsAt: "desc" },
    take: 5,
    select: { title: true, startsAt: true, status: true },
  });
  console.log("\nnewest events:");
  rows.forEach((e) =>
    console.log("  ", e.startsAt.toISOString().slice(0, 10), e.status.padEnd(8), e.title.slice(0, 45))
  );
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
