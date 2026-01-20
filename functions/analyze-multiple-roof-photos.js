export async function onRequestPost(context) {
  // You can read FormData here if needed; for now, return mock.
  return new Response(
    JSON.stringify({
      status: "ok",
      message: "Mock AI analysis complete",
      roofArea: 2100,
      pitch: "6/12",
      material: "Asphalt Shingle",
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
