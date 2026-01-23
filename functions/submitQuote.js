export async function onRequestPost(context) {
  // Parse incoming quote submission
  const body = await context.request.json().catch(() => null);

  if (!body) {
    return new Response(
      JSON.stringify({ error: "Invalid JSON payload" }),
      { status: 400 }
    );
  }

  const {
    leadId,
    rooferId,
    price,
    timeline,
    warranty,
    notes
  } = body;

  // -----------------------------------------
  // 1. Validate required fields
  // -----------------------------------------
  if (!leadId || !rooferId || !price) {
    return new Response(
      JSON.stringify({
        error: "Missing required fields: leadId, rooferId, price"
      }),
      { status: 400 }
    );
  }

  // -----------------------------------------
  // 2. Mock database (replace with D1 later)
  // -----------------------------------------
  const mockQuote = {
    id: `quote-${Date.now()}`,
    leadId,
    rooferId,
    price: Number(price),
    timeline: timeline || "Not specified",
    warranty: warranty || "Standard",
    notes: notes || "",
    status: "submitted",
    createdAt: Date.now()
  };

  // In production:
  // await DB.insert("quotes", mockQuote)

  // -----------------------------------------
  // 3. Return the quote to the frontend
  // -----------------------------------------
  return new Response(JSON.stringify({
    message: "Quote submitted successfully",
    quote: mockQuote
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
