import { getState, setAnalysis } from "../state.js";
import { navigateTo } from "../router.js";

export async function handleIntakeSubmit(files) {
  const state = getState();
  const statusEl = document.getElementById("intake-status");

  if (!state.intake.address) {
    statusEl.innerHTML = `<span class="status-dot"></span><span>Please enter an address.</span>`;
    return;
  }

  statusEl.innerHTML = `<span class="status-dot"></span><span>Uploading photos and analyzing roof…</span>`;

  // In a real app, you'd upload files + address to a backend/AI here.
  // For now, we simulate a call and derive some values from intake.
  await new Promise((r) => setTimeout(r, 1400));

  const photosCount = files ? files.length : state.intake.photosCount || 0;
  const roofAge = Number(state.intake.roofAge || 18);
  const sqFt = Number(state.intake.squareFootage || 2200);
  const valleys = Number(state.intake.valleys || 2);
  const layers = Number(state.intake.layers || 1);

  // Simple heuristic for demo
  let baseScore = 92;
  baseScore -= Math.max(0, roofAge - 10) * 1.2;
  baseScore -= valleys * 1.5;
  baseScore -= (layers - 1) * 4;
  baseScore = Math.max(40, Math.min(98, Math.round(baseScore)));

  const conditionLabel =
    baseScore >= 85 ? "Good" : baseScore >= 70 ? "Fair" : "Needs attention";

  const complexity =
    valleys >= 4 ? "High" : valleys >= 2 ? "Medium" : "Low";

  const pricePerSq =
    complexity === "High" ? 7.0 : complexity === "Medium" ? 5.75 : 4.9;

  const estimatedLow = Math.round(sqFt * pricePerSq * 0.9);
  const estimatedHigh = Math.round(sqFt * pricePerSq * 1.15);

  const analysis = {
    roofScore: baseScore,
    conditionLabel,
    estimatedAge: roofAge,
    estimatedSqFt: sqFt,
    complexity,
    estimatedLow,
    estimatedHigh,
    photosCount,
    materials: [
      state.intake.material || "Architectural shingles",
      "Aluminum drip edge"
    ],
    findings: [
      "Granule loss visible on south-facing slope",
      "Minor lifting near valleys",
      photosCount >= 4
        ? "Multiple angles confirm consistent wear pattern"
        : "Additional photos could improve confidence"
    ],
    summary:
      "Moderate wear with localized damage. Ideal for targeted repair or near-term replacement planning."
  };

  setAnalysis(analysis);

  statusEl.innerHTML = `<span class="status-dot"></span><span>Report ready! Redirecting…</span>`;

  setTimeout(() => {
    navigateTo(state.role === "roofer" ? "rooferDashboard" : "homeownerDashboard");
  }, 700);
}
