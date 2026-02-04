import { analyzeRoof } from "../services/aiClient.js";
import db from "../utils/db.js";

export async function requestRoofAnalysis(req, res) {
  try {
    const { address, leadId } = req.body;

    const analysis = await analyzeRoof(address);

    await db.query(
      `INSERT INTO roof_analysis (lead_id, data)
       VALUES ($1, $2)
       ON CONFLICT (lead_id) DO UPDATE SET data = $2`,
      [leadId, analysis]
    );

    res.json({ success: true, analysis });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Roof analysis failed" });
  }
}
