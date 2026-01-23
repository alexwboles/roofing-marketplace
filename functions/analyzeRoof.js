export async function onRequestPost(context) {
  // Parse request
  const formData = await context.request.formData();
  const address = formData.get("address") || "";
  const metadataJSON = formData.get("metadata") || "{}";
  const metadata = JSON.parse(metadataJSON);

  // Photos (File objects)
  const photos = formData.getAll("photos[]") || [];
  const photoCount = photos.length;

  // -----------------------------
  // 1. SATELLITE ANALYSIS (MOCK)
  // -----------------------------
  // In production: call Google Maps Static API or Bing Imagery API
  // For now: simulate geometry based on address hash + metadata

  function hashToRange(str, min, max) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
    const normalized = Math.abs(h % 1000) / 1000;
    return Math.round(min + normalized * (max - min));
  }

  const baseSqFt = hashToRange(address, 1800, 3600);
  const facets = hashToRange(address + "facets", 4, 10);
  const valleys = hashToRange(address + "valleys", 1, 6);
  const ridges = hashToRange(address + "ridges", 1, 5);

  // -----------------------------
  // 2. PHOTO AI ANALYSIS (MOCK)
  // -----------------------------
  // In production: send photos to OpenAI Vision or Anthropic Vision
  // For now: simulate condition scoring based on metadata + photo count

  const roofAge = Number(metadata.roofAge || 18);
  const layers = Number(metadata.layers || 1);

  let conditionScore = 95;
  conditionScore -= Math.max(0, roofAge - 10) * 1.5;
  conditionScore -= valleys * 1.2;
  conditionScore -= (layers - 1) * 5;
  conditionScore -= photoCount < 3 ? 5 : 0;
  conditionScore = Math.max(40, Math.min(98, Math.round(conditionScore)));

  const conditionLabel =
    conditionScore >= 85 ? "Good" :
    conditionScore >= 70 ? "Fair" :
    "Needs Attention";

  // -----------------------------
  // 3. COMPLEXITY + WASTE FACTOR
  // -----------------------------
  const complexity =
    valleys >= 5 ? "High" :
    valleys >= 3 ? "Medium" :
    "Low";

  const wasteFactor =
    complexity === "High" ? 18 :
    complexity === "Medium" ? 14 :
    10;

  // -----------------------------
  // 4. FINAL ROOF GEOMETRY MODEL
  // -----------------------------
  const roofModel = {
    sqFt: baseSqFt,
    pitch: metadata.pitch || "6/12",
    facets,
    valleys,
    ridges,
    layers,
    materialDetected: metadata.material || "Architectural Asphalt",
    wasteFactor,
    conditionScore,
    conditionLabel,
    complexity
  };

  // -----------------------------
  // 5. QUOTE ENGINE
  // -----------------------------
  const regionalRate = 5.25; // national average baseline
  const complexityMultiplier =
    complexity === "High" ? 1.35 :
    complexity === "Medium" ? 1.18 :
    1.0;

  const basePrice = roofModel.sqFt * regionalRate;
  const adjustedPrice = basePrice * complexityMultiplier;

  const estimatedLow = Math.round(adjustedPrice * 0.9);
  const estimatedHigh = Math.round(adjustedPrice * 1.15);

  const quote = {
    estimatedLow,
    estimatedHigh,
    confidence: Math.min(0.95, 0.65 + photoCount * 0.05),
    breakdown: {
      materials: Math.round(adjustedPrice * 0.35),
      labor: Math.round(adjustedPrice * 0.55),
      dumpster: 350,
      misc: 250
    }
  };

  // -----------------------------
  // 6. FINDINGS (AI-LIKE OUTPUT)
  // -----------------------------
  const findings = [
    "Granule loss visible on south-facing slope",
    "Minor lifting near valleys",
    photoCount >= 4
      ? "Multiple angles confirm consistent wear pattern"
      : "Additional photos could improve confidence"
  ];

  // -----------------------------
  // 7. FINAL REPORT OBJECT
  // -----------------------------
  const report = {
    address,
    photosAnalyzed: photoCount,
    roofModel,
    quote,
    findings,
    summary:
      "AI and satellite analysis indicate moderate wear with localized damage. Roof is suitable for targeted repair or near-term replacement planning."
  };

  return new Response(JSON.stringify(report), {
    headers: { "Content-Type": "application/json" }
  });
}
