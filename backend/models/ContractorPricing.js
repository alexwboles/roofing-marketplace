import db from "../utils/db.js";

export async function upsertContractorPricing(contractorId, pricingData) {
  const { rows } = await db.query(
    `INSERT INTO contractor_pricing (contractor_id, data)
     VALUES ($1, $2)
     ON CONFLICT (contractor_id)
     DO UPDATE SET data = EXCLUDED.data
     RETURNING *`,
    [contractorId, pricingData]
  );
  return rows[0];
}

export async function getAllContractorPricing() {
  const { rows } = await db.query("SELECT * FROM contractor_pricing");
  return rows;
}
