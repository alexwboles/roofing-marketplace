export async function onRequestPost(context) {
  const body = await context.request.json().catch(() => ({}));

  const result = {
    roofScore: 87,
    materials: ["Architectural shingles", "Aluminum drip edge"],
    findings: ["Granule loss", "Minor lifting on south slope"],
    summary: "Moderate wear with localized damage. Ideal for targeted repair or near-term replacement planning.",
    input: body || null,
  };

  return new Response(JSON.stringify(result), {
    headers: { "Content-Type": "application/json" },
  });
}
