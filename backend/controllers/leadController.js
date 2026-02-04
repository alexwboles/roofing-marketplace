import { createLead, getLeadById } from "../models/Lead.js";
import { requireFields } from "../utils/validators.js";

export async function createLeadHandler(req, res, next) {
  try {
    requireFields(req.body, ["name", "email", "address"]);
    const { name, email, phone, address, details } = req.body;

    const lead = await createLead({ name, email, phone, address, details });
    res.status(201).json({ lead });
  } catch (err) {
    next(err);
  }
}

export async function getLeadHandler(req, res, next) {
  try {
    const { id } = req.params;
    const lead = await getLeadById(id);
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json({ lead });
  } catch (err) {
    next(err);
  }
}
