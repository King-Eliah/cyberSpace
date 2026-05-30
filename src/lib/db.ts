import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

function createPrismaClient() {
  // Parse the URL ourselves so pg never has to — avoids SCRAM password-string bugs
  const raw =
    process.env.DIRECT_URL ??
    process.env.DATABASE_URL ??
    "";

  const clean = raw.replace(/[?&]pgbouncer=true/g, "").trim();

  let pool: Pool;

  try {
    const u = new URL(clean);
    pool = new Pool({
      host:     u.hostname,
      port:     Number(u.port) || 5432,
      user:     decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      database: u.pathname.replace(/^\//, ""),
      ssl:      { rejectUnauthorized: false },
    });
  } catch {
    // Fallback: let pg try the raw string (shouldn't reach here)
    pool = new Pool({ connectionString: clean, ssl: { rejectUnauthorized: false } });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapter = new PrismaPg(pool as any);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter } as any);
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
