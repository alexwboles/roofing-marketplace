import db from "../utils/db.js";

export async function findContractorByUserId(userId) {
  const { rows } = await db.query(
    "SELECT * FROM contractors WHERE user_id = $1 LIMIT 1",
    [userId]
  );
  return rows[0] || null;
}

export async function getAllContractors() {
  const { rows } = await db.query("SELECT * FROM contractors");
  return rows;
}
