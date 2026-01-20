export async function onRequestPost() {
  return new Response(JSON.stringify({
    score: 72,
    roofArea: 2100,
    pitch: "6/12",
    material: "Asphalt Shingle",
    roofAge: 12,
    damage: "Granule loss, curling"
  }), { headers: { "Content-Type": "application/json" }});
}
