// functions/roof-health-check.js
export async function onRequestPost(context) {
  const { projectId, address } = await context.request.json();

  const hailData = { recentSevereHail: true, multipleEvents: true };
  const propertyData = { roofAge: 14 };

  let score = 0;
  if (hailData.recentSevereHail) score += 40;
  if (hailData.multipleEvents) score += 20;
  if (propertyData.roofAge <= 10) score -= 20;
  if (propertyData.roofAge >= 15) score += 20;
  score = Math.max(0, Math.min(100, score));
  const label = score > 70 ? "high" : score > 40 ? "medium" : "low";

  const FIREBASE_PROJECT_ID = "roofing-app-84ecc";
  const FIREBASE_API_KEY = "<YOUR_FIREBASE_API_KEY>";

  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/roofHealthChecks/${projectId}?key=${FIREBASE_API_KEY}`;

  const body = {
    fields: {
      hailRiskScore: { integerValue: score },
      eligibilityLabel: { stringValue: label },
      lastCheckedAt: { integerValue: Date.now() }
    }
  };

  await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  return new Response(JSON.stringify({ score, label }), {
    headers: { "Content-Type": "application/json" }
  });
}
