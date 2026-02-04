import db from "../utils/db.js";

export async function createQuote({
  leadId,
  contractorId,
  amount,
  metadata
}) {
  const { rows } = await db.query(
    `INSERT INTO quotes (lead_id, contractor_id, amount, metadata)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [leadId, contractorId, amount, metadata]
  );
  return rows[0];
}

export async function getQuotesByLeadId(leadId) {
  const { rows } = await db.query(
    "SELECT * FROM quotes WHERE lead_id = $1",
    [leadId]
  );
  return rows;
}
