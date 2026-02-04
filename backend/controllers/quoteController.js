import { getRoofAnalysisByLeadId } from "../models/RoofAnalysis.js";
import { getAllContractorPricing } from "../models/ContractorPricing.js";
import { createQuote, getQuotesByLeadId } from "../models/Quote.js";
import { generateQuote } from "../services/pricingEngine.js";
import { requireFields } from "../utils/validators.js";

export async function generateQuotes(req, res, next) {
  try {
    requireFields(req.body, ["leadId"]);
    const { leadId } = req.body;

    const roofRecord = await getRoofAnalysisByLeadId(leadId);
    if (!roofRecord) return res.status(404).json({ error: "No roof analysis found" });

    const roofData = roofRecord.data;
    const contractorPricingRows = await getAllContractorPricing();

    const quotes = [];
    for (const row of contractorPricingRows) {
      const contractorId = row.contractor_id;
      const pricingData = row.data;

      const amount = generateQuote(roofData, pricingData);
      const quote = await createQuote({
        leadId,
        contractorId,
        amount,
        metadata: { pricingData }
      });

      quotes.push(quote);
    }

    res.json({ quotes });
  } catch (err) {
    next(err);
  }
}

export async function listQuotes(req, res, next) {
  try {
    const { leadId } = req.params;
    const quotes = await getQuotesByLeadId(leadId);
    res.json({ quotes });
  } catch (err) {
    next(err);
  }
}
