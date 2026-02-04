import db from "../utils/db.js";

export async function findUserByEmail(email) {
  const { rows } = await db.query(
    "SELECT * FROM users WHERE email = $1 LIMIT 1",
    [email]
  );
  return rows[0] || null;
}

export async function createUser({ email, password_hash, role }) {
  const { rows } = await db.query(
    `INSERT INTO users (email, password_hash, role)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [email, password_hash, role]
  );
  return rows[0];
}
