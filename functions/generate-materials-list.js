export async function onRequestPost(context) {
  const { roofArea } = await context.request.json();

  return new Response(JSON.stringify({
    bundles: Math.ceil((roofArea / 33) * 1.1),
    underlaymentRolls: Math.ceil(roofArea / 400),
    dripEdgeFt: Math.ceil(Math.sqrt(roofArea) * 4),
    vents: 10
  }), { headers: { "Content-Type": "application/json" }});
}
