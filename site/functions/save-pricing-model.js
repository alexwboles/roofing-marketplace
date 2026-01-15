export async function onRequest(context) {
  const { request } = context;

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    const body = await request.json();
    // TODO: get roofer_id from auth in future
    console.log("Received pricing model:", body);
    return json({ ok: true }, 200);
  } catch (e) {
    console.error(e);
    return json({ error: "Failed to save pricing" }, 500);
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
