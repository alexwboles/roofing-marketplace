export async function onRequestPost(context) {
  try {
    const data = await context.request.json();

    // TODO: wire to your AI / image analysis pipeline.
    // For now, return a mocked response similar to the client-side mock.

    const result = {
      roofScore: 87,
      materials: ["Architectural asphalt shingles", "Aluminum drip edge"],
      findings: ["Granule loss on south slope", "Minor edge lifting near eaves"],
      summary:
        "Moderate wear with localized shingle damage on the south-facing slope. Recommend inspection within 30 days.",
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to analyze roof" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
