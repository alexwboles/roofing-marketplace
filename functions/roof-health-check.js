export async function onRequestPost(context) {
  const { projectId, address } = await context.request.json();

  // 1. Convert address → lat/lng
  const geoRes = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${context.env.GOOGLE_MAPS_KEY}`
  );
  const geo = await geoRes.json();
  const { lat, lng } = geo.results[0].geometry.location;

  // 2. Reverse geocode → county + state
  const revRes = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${context.env.GOOGLE_MAPS_KEY}`
  );
  const rev = await revRes.json();
  const county = rev.results.find(r => r.types.includes("administrative_area_level_2")).address_components[0].long_name;
  const state = rev.results.find(r => r.types.includes("administrative_area_level_1")).short_name;

  // 3. NOAA hail lookup (last 5 years)
  const hailRes = await fetch(
    `https://www.ncdc.noaa.gov/stormevents/csv?eventType=Hail&beginDate=2019-01-01&endDate=2024-12-31&location=${state}`
  );
  const hailCsv = await hailRes.text();

  const hailEvents = hailCsv
    .split("\n")
    .filter(line => line.includes(county));

  const recentSevere = hailEvents.filter(e => e.includes("Hail Size") && parseFloat(e.split(",")[10]) >= 1.0);

  const hailScore = Math.min(100, recentSevere.length * 10);

  const label =
    hailScore > 70 ? "high" :
    hailScore > 40 ? "medium" :
    "low";

  // Save to Firestore
  await saveHail(projectId, hailScore, label, context);

  return new Response(JSON.stringify({ hailScore, label }), {
    headers: { "Content-Type": "application/json" }
  });
}

async function saveHail(projectId, hailScore, label, context) {
  const FIREBASE_PROJECT_ID = "roofing-app-84ecc";
  const FIREBASE_API_KEY = context.env.FIREBASE_API_KEY;

  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/roofHealthChecks/${projectId}?key=${FIREBASE_API_KEY}`;

  const body = {
    fields: {
      hailRiskScore: { integerValue: hailScore },
      eligibilityLabel: { stringValue: label },
      lastCheckedAt: { integerValue: Date.now() }
    }
  };

  await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
}
