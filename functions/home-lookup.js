export async function onRequestPost(context) {
  const { address } = await context.request.json();

  return new Response(JSON.stringify({
    roofArea: 2100,
    pitch: "6/12",
    material: "Asphalt Shingle",
    yearBuilt: 1998,
    roofAge: 12
  }), { headers: { "Content-Type": "application/json" }});
}
