import {
  updateRoofGeometry,
  fetchRoofGeometry
} from "../models/RoofGeometry.js";
import { getLeadById } from "../models/Lead.js";
import { requireFields } from "../utils/validators.js";

export async function saveRoofGeometry(req, res, next) {
  try {
    requireFields(req.body, ["leadId", "geojson"]);

    const { leadId, geojson } = req.body;

    const lead = await getLeadById(leadId);
    if (!lead) return res.status(404).json({ error: "Lead not found" });

    const record = await updateRoofGeometry(leadId, geojson);

    res.json({
      success: true,
      message: "Roof geometry saved",
      geometry: record.roof_geom
    });
  } catch (err) {
    next(err);
  }
}

export async function getRoofGeometry(req, res, next) {
  try {
    const { leadId } = req.params;

    const record = await fetchRoofGeometry(leadId);
    if (!record) return res.status(404).json({ error: "No geometry found" });

    res.json({
      leadId,
      geometry: record.geojson
    });
  } catch (err) {
    next(err);
  }
}
