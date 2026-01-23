import { getState, setAnalysis } from "../state.js";
import { navigateTo } from "../router.js";

export async function handleIntakeSubmit() {
  const state = getState();
  const statusEl = document.getElementById("intake-status");

  if (!state.intake.address) {
    statusEl.innerHTML = `<span class="status-dot"></span><span>Please enter an address.</span>`;
    return;
  }

  statusEl.innerHTML = `<span class="status-dot"></span><span>Analyzing your roof…</span>`;

  // Simulate async analysis
  await new Promise((r) => setTimeout(r, 1200));

  const mock = {
    roofScore: 87,
    materials: ["Architectural shingles", "Aluminum drip edge"],
    findings: ["Granule loss", "Minor lifting on south slope"],
    summary: "Moderate wear with localized damage. Ideal for targeted repair or near-term replacement planning.",
  };

  setAnalysis(mock);

  statusEl.innerHTML = `<span class="status-dot"></span><span>Report ready! Redirecting…</span>`;

  setTimeout(() => {
    navigateTo(state.role === "roofer" ? "rooferDashboard" : "homeownerDashboard");
  }, 700);
}
