// functions/analyze-roof-photo.js
// Cloudflare Pages Function: POST /functions/analyze-roof-photo
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  // your Firebase config
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function onRequestPost(context) {
  const body = await context.request.json();
  const { projectId, imageBase64 } = body;

  // Call your AI provider here (OpenAI Vision / Workers AI)
  const aiResult = await detectRoofFeatures(imageBase64);

  await setDoc(
    doc(db, 'projects', projectId),
    {
      aiMaterialGuess: aiResult.materialType,
      aiGeometry: {
        sqFt: aiResult.sqFt,
        pitch: aiResult.pitch,
      },
    },
    { merge: true }
  );

  return new Response(JSON.stringify(aiResult), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function detectRoofFeatures(imageBase64) {
  // Placeholder: wire to your actual AI call
  // Return a consistent shape
  return {
    materialType: 'architectural_shingle',
    sqFt: 2400,
    pitch: '6/12',
  };
}
