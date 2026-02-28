import pg from "pg";

const { Pool } = pg;

function getPool() {
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    return new Pool({
      connectionString: databaseUrl,
      ssl: databaseUrl.includes("localhost") ? false : { rejectUnauthorized: false },
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
