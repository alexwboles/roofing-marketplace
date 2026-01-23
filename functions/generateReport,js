export async function onRequestPost(context) {
  const body = await context.request.json().catch(() => ({}));

  const report = {
    url: "https://example.com/mock-report.pdf",
    createdAt: new Date().toISOString(),
    meta: body || null
  };

  return new Response(JSON.stringify(report), {
    headers: { "Content-Type": "application/json" }
  });
}
