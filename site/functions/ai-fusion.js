export async function onRequest(context) {
  const { request } = context;

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const body = await request.json();
    // In future: combine photo + satellite analysis
    return json(
      {
        roof_type: "asphalt",
        pitch: "medium",
        estimated_sqft: 2400,
        final_sqft: 2400,
        confidence: 0.9
      },
      200
    );
  } catch (e) {
    console.error(e);
    return json({ error: "AI fusion failed" }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
