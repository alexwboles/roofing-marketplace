export async function onRequestPost() {
  return new Response(JSON.stringify({ verified: true }), {
    headers: { "Content-Type": "application/json" },
  });
}
