export async function onRequestPost(context) {
  const { request } = context;
  const { address } = await request.json();

  // TODO: replace this mock with a real property/roof data API
  // For now, return static example data so the UI works.
  const mock = {
    roofArea: 2100,
    pitch: "6/12",
    material: "Asphalt Shingle",
    yearBuilt: 1998,
    roofAge: 12,
    lotSize: "0.25 acres",
    estValue: "$420,000"
  };

  return new Response(JSON.stringify(mock), {
    headers: { "Content-Type": "application/json" }
  });
}

