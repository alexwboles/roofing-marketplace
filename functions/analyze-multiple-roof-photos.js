export async function onRequestPost() {
  return new Response(
    JSON.stringify({
      score: 72,
      roofArea: 2100,
      pitch: "6/12",
      material: "Asphalt Shingle",
      roofAge: 12,
      damage: "Granule loss, curling, missing shingles on north slope",
      recommendation: "Plan a full replacement within 12–18 months.",
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
