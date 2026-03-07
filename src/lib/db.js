import pg from "pg";

const { Pool } = pg;

function getPool() {
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    const isLocalhost = databaseUrl.includes("localhost") || databaseUrl.includes("127.0.0.1");
    return new Pool({
      connectionString: databaseUrl,
      ssl: isLocalhost ? false : { rejectUnauthorized: false },
      // Serverless: limit connections to avoid exhausting pool
      max: process.env.VERCEL ? 2 : 10,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 10000,
    });
  }
  return new Pool({
    host: process.env.PGHOST || "localhost",
    port: parseInt(process.env.PGPORT || "5432", 10),
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "",
    database: process.env.PGDATABASE || "phasematrix_blog",
  });
}

let pool = null;

export function getDb() {
  if (!pool) pool = getPool();
  return pool;
}
