export async function onRequestPost(context) {
  const body = await context.request.json().catch(() => ({}));

  const roofAge = Number(body.roofAge || 18);
  const sqFt = Number(body.squareFootage || 2200);
  const valleys = Number(body.valleys || 2);
  const layers = Number(body.layers || 1);

  let baseScore = 92;
  baseScore -= Math.max(0, roofAge - 10) * 1.2;
  baseScore -= valleys * 1.5;
  baseScore -= (layers - 1) * 4;
  baseScore = Math.max(40, Math.min(98, Math.round(baseScore)));

  const conditionLabel =
    baseScore >= 85 ? "Good" : baseScore >= 70 ? "Fair" : "Needs attention";

  const complexity =
    valleys >= 4 ? "High" : valleys >= 2 ? "Medium" : "Low";

  const pricePerSq =
    complexity === "High" ? 7.0 : complexity === "Medium" ? 5.75 : 4.9;

  const estimatedLow = Math.round(sqFt * pricePerSq * 0.9);
  const estimatedHigh = Math.round(sqFt * pricePerSq * 1.15);

  const result = {
    roofScore: baseScore,
    conditionLabel,
    estimatedAge: roofAge,
    estimatedSqFt: sqFt,
    complexity,
    estimatedLow,
    estimatedHigh,
    summary:
      "Moderate wear with localized damage. Ideal for targeted repair or near-term replacement planning.",
    materials: [body.material || "Architectural shingles", "Aluminum drip edge"],
    findings: [
      "Granule loss visible on south-facing slope",
      "Minor lifting near valleys"
    ],
    input: body || null
  };

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" }
  });
}
