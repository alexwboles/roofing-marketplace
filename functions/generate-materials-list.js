export async function onRequestPost(context) {
  const { request } = context;
  const body = await request.json().catch(() => ({}));
  const roofArea = body.roofArea || 2100;

  const bundles = Math.ceil((roofArea / 33) * 1.1);
  const underlaymentRolls = Math.ceil(roofArea / 400);
  const dripEdgeFt = Math.ceil(Math.sqrt(roofArea) * 4);
  const vents = 10;

  const materials = {
    roofArea,
    bundles,
    underlaymentRolls,
    dripEdgeFt,
    vents,
    notes: "Adjust quantities based on local code, manufacturer specs, and roof complexity.",
  };

  return new Response(JSON.stringify(materials), {
    headers: { "Content-Type": "application/json" },
  });
}
