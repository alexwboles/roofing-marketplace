import db from "../utils/db.js";
import { generateQuote } from "../services/pricingEngine.js";

export async function generateQuotes(req, res) {
  const { leadId } = req.body;

  const roof = await db.query(
    "SELECT data FROM roof_analysis WHERE lead_id = $1",
    [leadId]
  );

  const contractors = await db.query(
    "SELECT * FROM contractor_pricing"
  );

  const quotes = contractors.rows.map(c => ({
    contractorId: c.contractor_id,
    bid: generateQuote(roof.rows[0].data, c.data),
  }));

  res.json({ quotes });
}
