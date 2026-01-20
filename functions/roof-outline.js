export async function onRequestPost(context) {
  return new Response(JSON.stringify({
    imageUrl: "https://via.placeholder.com/600x600?text=Satellite+Roof",
    areaSqFt: 2150,
    pitch: "6/12",
    complexity: "Moderate"
  }), { headers: { "Content-Type": "application/json" }});
}
