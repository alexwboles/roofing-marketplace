// functions/roof-health-check.js
// Cloudflare Pages Function: POST /functions/roof-health-check
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  // your Firebase config
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function onRequestPost(context) {
  const body = await context.request.json();
  const { projectId, address } = body;

  const hailData = await fetchHailHistory(address);
  const propertyData = await fetchPropertyRecords(address);

  const score = computeEligibility(hailData, propertyData);
  const label = score > 70 ? 'high' : score > 40 ? 'medium' : 'low';

  await setDoc(
    doc(db, 'roofHealthChecks', projectId),
    {
      hailRiskScore: score,
      eligibilityLabel: label,
      lastCheckedAt: Date.now(),
    },
    { merge: true }
  );

  return new Response(JSON.stringify({ score, label }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function fetchHailHistory(address) {
  // TODO: integrate real hail API
  return { recentSevereHail: true, multipleEvents: true };
}

async function fetchPropertyRecords(address) {
  // TODO: integrate property data provider
  return { roofAge: 14 };
}

function computeEligibility(hail, property) {
  let score = 0;
  if (hail.recentSevereHail) score += 40;
  if (hail.multipleEvents) score += 20;
  if (property.roofAge <= 10) score -= 20;
  if (property.roofAge >= 15) score += 20;
  return Math.max(0, Math.min(100, score));
}
