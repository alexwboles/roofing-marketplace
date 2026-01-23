export async function onRequestPost(context) {
  // Parse incoming lead
  const body = await context.request.json().catch(() => null);

  if (!body || !body.address || !body.roofModel) {
    return new Response(
      JSON.stringify({ error: "Invalid lead payload" }),
      { status: 400 }
    );
  }

  const { address, roofModel, quote } = body;

  // -----------------------------------------
  // 1. Mock Roofer Database (replace later)
  // -----------------------------------------
  const mockRoofers = [
    {
      id: "roofer-1",
      companyName: "Sunshine Roofing",
      serviceArea: ["32084", "32080", "32086"],
      rating: 4.8,
      responsiveness: 0.9,
      availability: 1.0,
      licenseVerified: true
    },
    {
      id: "roofer-2",
      companyName: "St. Augustine Roof Pros",
      serviceArea: ["32084", "32095"],
      rating: 4.6,
      responsiveness: 0.7,
      availability: 0.8,
      licenseVerified: true
    },
    {
      id: "roofer-3",
      companyName: "Atlantic Coast Roofing",
      serviceArea: ["32080", "32081", "32082"],
      rating: 4.2,
      responsiveness: 0.6,
      availability: 0.9,
      licenseVerified: false
    },
    {
      id: "roofer-4",
      companyName: "Palm Coast Roofing",
      serviceArea: ["32137", "32164"],
      rating: 4.9,
      responsiveness: 0.95,
      availability: 1.0,
      licenseVerified: true
    }
  ];

  // -----------------------------------------
  // 2. Extract ZIP from address (simple mock)
  // -----------------------------------------
  const zipMatch = address.match(/\b\d{5}\b/);
  const zip = zipMatch ? zipMatch[0] : null;

  // -----------------------------------------
  // 3. Scoring Algorithm
  // -----------------------------------------
  function scoreRoofer(roofer) {
    const serviceAreaMatch = roofer.serviceArea.includes(zip) ? 1 : 0;

    return (
      serviceAreaMatch * 0.5 +
      roofer.rating * 0.2 +
      roofer.responsiveness * 0.2 +
      roofer.availability * 0.1
    );
  }

  // Score all roofers
  const scored = mockRoofers.map((roofer) => ({
    ...roofer,
    score: scoreRoofer(roofer)
  }));

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Pick top 3–5
  const matchedRoofers = scored.slice(0, 4);

  // -----------------------------------------
  // 4. Prepare Lead Distribution Payload
  // -----------------------------------------
  const distribution = {
    lead: {
      address,
      roofModel,
      quote,
      createdAt: Date.now()
    },
    matchedRoofers,
    message: "Lead successfully distributed to top roofers"
  };

  return new Response(JSON.stringify(distribution), {
    headers: { "Content-Type": "application/json" }
  });
}
