import db from "../utils/db.js";

export async function createLead({ name, email, phone, address, details }) {
  const { rows } = await db.query(
    `INSERT INTO leads (name, email, phone, address, details)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, email, phone, address, details]
  );
  return rows[0];
}

export async function getLeadById(id) {
  const { rows } = await db.query(
    "SELECT * FROM leads WHERE id = $1 LIMIT 1",
    [id]
  );
  return rows[0] || null;
}
