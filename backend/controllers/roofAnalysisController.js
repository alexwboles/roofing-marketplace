import { analyzeRoof } from "../services/aiClient.js";
import { getLeadById } from "../models/Lead.js";
import {
  upsertRoofAnalysis,
  getRoofAnalysisByLeadId
} from "../models/RoofAnalysis.js";
import { updateRoofGeometry } from "../models/RoofGeometry.js";
import { requireFields } from "../utils/validators.js";

export async function requestRoofAnalysis(req, res, next) {
  try {
    requireFields(req.body, ["leadId"]);
    const { leadId } = req.body;

    const lead = await getLeadById(leadId);
    if (!lead) return res.status(404).json({ error: "Lead not found" });

    // 1) Call AI service
    const analysis = await analyzeRoof(lead.address);

    // 2) Store AI JSON in roof_analysis.data
    const record = await upsertRoofAnalysis(leadId, analysis);

    // 3) If AI returned geometry, store it in roof_analysis.roof_geom
    if (analysis.roofGeometry) {
      await updateRoofGeometry(leadId, analysis.roofGeometry);
    }

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
