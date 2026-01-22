// functions/analyze-roof-photo.js
export async function onRequestPost(context) {
  const { projectId, photos } = await context.request.json();

  // ---- AI ANALYSIS (mock for now) ----
  // In production, call your AI provider here with `photos`.
  const materialsList = {
    shingles: "32 bundles architectural",
    ridgeCap: "4 bundles",
    underlayment: "9 rolls synthetic",
    nails: "12 boxes",
    dripEdge: "220 linear ft",
    vents: "3 turtle vents"
  };

  const aiGeometry = {
    sqFt: 2450,
    pitch: "6/12",
    valleys: 3,
    ridges: 2,
    facets: 8
  };

  const FIREBASE_PROJECT_ID = "roofing-app-84ecc";
  const FIREBASE_API_KEY = "<YOUR_FIREBASE_API_KEY>";

  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/projects/${projectId}?key=${FIREBASE_API_KEY}`;

  const body = {
    fields: {
      materialsList: {
        mapValue: {
          fields: Object.fromEntries(
            Object.entries(materialsList).map(([k, v]) => [k, { stringValue: v }])
          )
        }
      },
      aiGeometry: {
        mapValue: {
          fields: Object.fromEntries(
            Object.entries(aiGeometry).map(([k, v]) =>
              typeof v === "number"
                ? [k, { integerValue: v }]
                : [k, { stringValue: v }]
            )
          )
        }
      }
    }
  };

  await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  return new Response(JSON.stringify({ materialsList, aiGeometry }), {
    headers: { "Content-Type": "application/json" }
  });
}
