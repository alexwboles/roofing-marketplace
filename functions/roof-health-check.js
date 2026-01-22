export async function onRequestPost(context) {
  const { projectId, address, photos } = await context.request.json();

  // 1. Geocode
  const geoRes = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${context.env.GOOGLE_MAPS_KEY}`
  );
  const geo = await geoRes.json();
  const { lat, lng } = geo.results[0].geometry.location;

  // 2. Reverse geocode → county/state
  const revRes = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${context.env.GOOGLE_MAPS_KEY}`
  );
  const rev = await revRes.json();
  const county = rev.results.find((r) =>
    r.types.includes("administrative_area_level_2")
  ).address_components[0].long_name;
  const state = rev.results.find((r) =>
    r.types.includes("administrative_area_level_1")
  ).short_name;

  // 3. NOAA hail lookup
  const hailRes = await fetch(
    `https://www.ncdc.noaa.gov/stormevents/csv?eventType=Hail&beginDate=2019-01-01&endDate=2024-12-31&location=${state}`
  );
  const hailCsv = await hailRes.text();
  const hailEvents = hailCsv.split("\n").filter((line) => line.includes(county));
  const severe = hailEvents.filter((e) => parseFloat(e.split(",")[10] || "0") >= 1.0);
  const hailScore = Math.min(100, severe.length * 10);

  // 4. County property lookup (fallback)
  let roofAgeCounty = 20;
  try {
    const countyRes = await fetch(
      `https://apps2.coj.net/PAO_PropertySearch/ParcelSearch?address=${encodeURIComponent(
        address
      )}`
    );
    const countyData = await countyRes.json();
    const yearBuilt = countyData[0]?.YearBuilt || 2000;
    const effectiveYear = countyData[0]?.EffectiveYear || yearBuilt;
    roofAgeCounty = new Date().getFullYear() - effectiveYear;
  } catch {}

  // 5. AI roof age
  let roofAgeAI = roofAgeCounty;
  try {
    const ages = [];
    for (const base64 of photos || []) {
      const aiRes = await context.env.AI.run("@cf/llava-hf/llava-1.5-7b-hf", {
        prompt:
          "Estimate roof age in years based on wear, granule loss, cracking, curling. Return only a number.",
        image: base64,
      });
      const parsed = parseInt(aiRes);
      if (!isNaN(parsed)) ages.push(parsed);
    }
    if (ages.length) roofAgeAI = Math.round(ages.reduce((a, b) => a + b, 0) / ages.length);
  } catch {}

  const roofAge = Math.round(roofAgeCounty * 0.6 + roofAgeAI * 0.4);

  // 6. AI damage classification
  let damageReport = {};
  try {
    const prompt = `
      Analyze all uploaded roof photos and classify:
      hailBruising, granuleLoss, liftedShingles, cracking, curling, softSpots, missingShingles.
      For each return: { present: boolean, severity: "low"|"medium"|"high" }.
      Return JSON only.
    `;
    const ai = await context.env.AI.run("@cf/meta/llama-3-8b-instruct", { prompt });
    damageReport = JSON.parse(ai);
  } catch {}

  // 7. Eligibility
  const eligibility =
    hailScore > 60 || damageReport.hailBruising?.severity === "high"
      ? "high"
      : hailScore > 30
      ? "medium"
      : "low";

  // 8. Save to Firestore
  await saveToFirestore(
    projectId,
    { hailScore, roofAge, damageReport, eligibility },
    context
  );

  return new Response(
    JSON.stringify({ hailScore, roofAge, damageReport, eligibility }),
    { headers: { "Content-Type": "application/json" } }
  );
}

async function saveToFirestore(projectId, data, context) {
  const FIREBASE_PROJECT_ID = "roofing-app-84ecc";
  const API_KEY = context.env.FIREBASE_API_KEY;

  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/roofHealthChecks/${projectId}?key=${API_KEY}`;

  const fields = {};
  for (const [k, v] of Object.entries(data)) {
    fields[k] =
      typeof v === "number"
        ? { integerValue: v }
        : typeof v === "string"
        ? { stringValue: v }
        : { mapValue: { fields: convert(v) } };
  }

  await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fields }),
  });
}

function convert(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] =
      typeof v === "number"
        ? { integerValue: v }
        : typeof v === "string"
        ? { stringValue: v }
        : typeof v === "boolean"
        ? { booleanValue: v }
        : { mapValue: { fields: convert(v) } };
  }
  return out;
}
