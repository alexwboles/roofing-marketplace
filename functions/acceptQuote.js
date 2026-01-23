export async function onRequestPost(context) {
  const body = await context.request.json().catch(() => null);

  if (!body || !body.quote || !body.report) {
    return new Response(
      JSON.stringify({ error: "Missing quote or report payload" }),
      { status: 400 }
    );
  }

  const { quote, report } = body;

  const project = {
    id: `project-${Date.now()}`,
    leadId: quote.leadId || "lead-1",
    rooferId: quote.rooferId,
    rooferName: quote.rooferName || "Roofer",
    address: report.address,
    roofModel: report.roofModel,
    aiQuote: report.quote,
    acceptedQuote: {
      id: quote.id,
      price: quote.price,
      timeline: quote.timeline,
      warranty: quote.warranty,
      notes: quote.notes
    },
    status: "Scheduled",
    schedule: {
      startDate: null,
      endDate: null
    },
    materials: [
      { name: "Architectural shingles", quantity: "—" },
      { name: "Underlayment", quantity: "—" },
      { name: "Ridge vent", quantity: "—" },
      { name: "Drip edge", quantity: "—" }
    ],
    messages: [],
    createdAt: Date.now()
  };

  // In production: persist project in DB

  return new Response(JSON.stringify({
    message: "Project created successfully",
    project
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
