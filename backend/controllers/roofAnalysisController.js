import { analyzeRoof } from "../services/aiClient.js";
import { getLeadById } from "../models/Lead.js";
import { upsertRoofAnalysis } from "../models/RoofAnalysis.js";
import { requireFields } from "../utils/validators.js";

export async function requestRoofAnalysis(req, res, next) {
  try {
    requireFields(req.body, ["leadId"]);
    const { leadId } = req.body;

    const lead = await getLeadById(leadId);
    if (!lead) return res.status(404).json({ error: "Lead not found" });

    const analysis = await analyzeRoof(lead.address);

    const record = await upsertRoofAnalysis(leadId, analysis);

    res.json({ analysis: record.data });
  } catch (err) {
    next(err);
  }
}

export async function getRoofAnalysis(req, res, next) {
  try {
    const { leadId } = req.params;
    const record = await getRoofAnalysisByLeadId(leadId);
    if (!record) return res.status(404).json({ error: "No analysis found" });
    res.json({ analysis: record.data });
  } catch (err) {
    next(err);
  }
}
