// functions/analyze-roof-photo.js
export async function onRequestPost(context) {
  const { projectId, photos } = await context.request.json();

  const results = [];

  for (const base64 of photos) {
    const aiRes = await context.env.AI.run(
      "@cf/llava-hf/llava-1.5-7b-hf",
      {
        prompt: "Analyze this roof photo. Return JSON with: materialType, sqFtEstimate, pitchEstimate, valleys, ridges, facets, damageIndicators (array of strings).",
        image: base64
      }
    );

    results.push(JSON.parse(aiRes));
  }

  const combined = {
    materialType: mostCommon(results.map(r => r.materialType)),
    sqFt: average(results.map(r => r.sqFtEstimate)),
    pitch: mostCommon(results.map(r => r.pitchEstimate)),
    valleys: max(results.map(r => r.valleys)),
    ridges: max(results.map(r => r.ridges)),
    facets: max(results.map(r => r.facets)),
    damageIndicators: [...new Set(results.flatMap(r => r.damageIndicators || []))]
  };

  const materialsPrompt = `
    Based on this roof:
    - Material: ${combined.materialType}
    - SqFt: ${combined.sqFt}
    - Pitch: ${combined.pitch}
    - Valleys: ${combined.valleys}
    - Ridges: ${combined.ridges}
    - Facets: ${combined.facets}

    Return a JSON object with keys:
    shingles, ridgeCap, underlayment, nails, dripEdge, vents.
    Values should be human-readable quantities (e.g. "32 bundles").
  `;

  const materialsAI = await context.env.AI.run(
    "@cf/meta/llama-3-8b-instruct",
    { prompt: materialsPrompt }
  );

  const materialsList = JSON.parse(materialsAI);

  await saveToFirestore(projectId, combined, materialsList, context);

  return new Response(JSON.stringify({ combined, materialsList }), {
    headers: { "Content-Type": "application/json" }
  });
}

function mostCommon(arr) {
  if (!arr.length) return null;
  return arr.sort((a, b) =>
    arr.filter(v => v === a).length - arr.filter(v => v === b).length
  ).pop();
}

function average(arr) {
  if (!arr.length) return 0;
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
}

function max(arr) {
  if (!arr.length) return 0;
  return Math.max(...arr);
}

async function saveToFirestore(projectId, geometry, materials, context) {
  const FIREBASE_PROJECT_ID = "roofing-app-84ecc";
  const FIREBASE_API_KEY = context.env.FIREBASE_API_KEY;

  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/projects/${projectId}?key=${FIREBASE_API_KEY}`;

  const body = {
    fields: {
      aiGeometry: {
        mapValue: {
          fields: Object.fromEntries(
            Object.entries(geometry).map(([k, v]) =>
              typeof v === "number"
                ? [k, { integerValue: v }]
                : Array.isArray(v)
                ? [k, { arrayValue: { values: v.map(x => ({ stringValue: x })) } }]
                : [k, { stringValue: v }]
            )
          )
        }
      },
      materialsList: {
        mapValue: {
          fields: Object.fromEntries(
            Object.entries(materials).map(([k, v]) => [k, { stringValue: v }])
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
}
