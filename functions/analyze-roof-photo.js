export async function onRequestPost(context) {
  const { projectId, imageBase64 } = await context.request.json();

  // ---- AI CALL (replace with your provider) ----
  // For now, return mock values so deployment succeeds.
  const aiResult = {
    materialType: "architectural_shingle",
    sqFt: 2400,
    pitch: "6/12"
  };

  // ---- WRITE TO FIRESTORE (REST API) ----
  const FIREBASE_PROJECT_ID = "roofing-app-84ecc";
  const FIREBASE_API_KEY = "<YOUR_FIREBASE_API_KEY>";

  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/projects/${projectId}?key=${FIREBASE_API_KEY}`;

  const body = {
    fields: {
      aiMaterialGuess: { stringValue: aiResult.materialType },
      aiGeometry: {
        mapValue: {
          fields: {
            sqFt: { integerValue: aiResult.sqFt },
            pitch: { stringValue: aiResult.pitch }
          }
        }
      }
    }
  };

  await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  return new Response(JSON.stringify(aiResult), {
    headers: { "Content-Type": "application/json" }
  });
}
