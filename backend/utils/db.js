import pg from "pg";

const { Pool } = pg;

const db = new Pool({
  connectionString: process.env.DATABASE_URL
});

db.on("error", (err) => {
  console.error("DB error:", err);
});

export default db;
