export async function onRequest(context) {
  const { request } = context;

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const body = await request.json();
    const images = body.images || [];
    if (!images.length) {
      return json({ error: "No images provided" }, 400);
    }

    // Stubbed AI result
    return json(
      {
        roof_type: "asphalt",
        pitch: "medium",
        estimated_sqft: 2400,
        confidence: 0.85
      },
      200
    );
  } catch (e) {
    console.error(e);
    return json({ error: "Failed to analyze photos" }, 500);
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
