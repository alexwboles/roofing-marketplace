import db from "../utils/db.js";

export async function upsertRoofAnalysis(leadId, data) {
  const { rows } = await db.query(
    `INSERT INTO roof_analysis (lead_id, data)
     VALUES ($1, $2)
     ON CONFLICT (lead_id)
     DO UPDATE SET data = EXCLUDED.data,
                   updated_at = NOW()
     RETURNING *`,
    [leadId, data]
  );
  return rows[0];
}

export async function getRoofAnalysisByLeadId(leadId) {
  const { rows } = await db.query(
    "SELECT * FROM roof_analysis WHERE lead_id = $1 LIMIT 1",
    [leadId]
  );
  return rows[0] || null;
}
