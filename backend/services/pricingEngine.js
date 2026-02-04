export function generateQuote(roofData, contractorPricing) {
  const totalArea = roofData.totalArea || 0;
  const squares = totalArea / 100;

  const basePricePerSquare = contractorPricing.base_price_per_square || 0;
  const defaultMaterial = contractorPricing.default_material || "standard";
  const materialPricing = contractorPricing.material_pricing || {};
  const pitchMultipliers = contractorPricing.pitch_multipliers || {};

  const maxPitch =
    roofData.sections?.reduce(
      (max, s) => (s.pitch > max ? s.pitch : max),
      0
    ) || 0;

  const pitchMultiplier = pitchMultipliers[maxPitch] || 1;
  const materialCost = materialPricing[defaultMaterial] || 0;

  let total = basePricePerSquare * squares * pitchMultiplier + materialCost;

  total *= 1.1; // 10% reserve

  return Math.round(total);
}
