import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

function createPrismaClient() {
  // Runtime uses the POOLED connection (Supabase transaction pooler, port 6543).
  // DIRECT_URL is the unpooled connection and is for migrations only — see
  // prisma.config.ts. Preferring it here exhausts Postgres connections on
  // serverless, where every function instance opens its own pool.
  const raw = process.env.DATABASE_URL ?? process.env.DIRECT_URL ?? "";

  if (!raw) {
    throw new Error(
      "DATABASE_URL is not set. Add it in Vercel → Settings → Environment Variables (and .env.local for local dev)."
    );
  }

  // Parse the URL ourselves so pg never has to — avoids SCRAM password-string bugs
  const clean = raw.replace(/[?&]pgbouncer=true/g, "").trim();

  let pool: Pool;

  const poolOptions = {
    // Each serverless instance gets its own pool; keep them small so a burst of
    // instances doesn't exhaust the database's connection limit.
    max: Number(process.env.PG_POOL_MAX ?? 5),
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
    // Supabase terminates TLS at the pooler with a cert this client doesn't
    // have the CA for. Set DB_SSL_STRICT=true once you've wired up the CA
    // bundle — see README.
    ssl: { rejectUnauthorized: process.env.DB_SSL_STRICT === "true" },
  };

  try {
    const u = new URL(clean);
    pool = new Pool({
      host: u.hostname,
      port: Number(u.port) || 5432,
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      database: u.pathname.replace(/^\//, ""),
      ...poolOptions,
    });
  } catch {
    // Fallback: let pg try the raw string (shouldn't reach here)
    pool = new Pool({ connectionString: clean, ...poolOptions });
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

// Reuse one client across hot reloads in dev. Guarded on VERCEL rather than
// NODE_ENV so a machine with NODE_ENV=production exported still gets the cache.
if (!process.env.VERCEL) globalForPrisma.prisma = prisma;
