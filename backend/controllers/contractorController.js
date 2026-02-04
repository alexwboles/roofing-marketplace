import { upsertContractorPricing } from "../models/ContractorPricing.js";
import { requireFields } from "../utils/validators.js";

export async function updatePricing(req, res, next) {
  try {
    const contractorId = req.user.id; // assuming user.id == contractor_id or mapped later
    requireFields(req.body, ["base_price_per_square"]);

    const pricing = req.body;
    const record = await upsertContractorPricing(contractorId, pricing);

    res.json({ pricing: record.data });
  } catch (err) {
    next(err);
  }
}
