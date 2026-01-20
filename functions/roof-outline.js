export async function onRequestPost(context) {
  const { request } = context;
  const { address } = await request.json();

  const mockOutline = {
    polygon: [
      [29.12345, -81.12345],
      [29.12355, -81.1234],
      [29.1236, -81.1235],
      [29.1235, -81.12355],
    ],
    areaSqFt: 2150,
    pitch: "6/12",
    complexity: "Moderate",
    imageUrl: "https://via.placeholder.com/600x600?text=Satellite+Roof",
  };

  return new Response(JSON.stringify(mockOutline), {
    headers: { "Content-Type": "application/json" },
  });
}
