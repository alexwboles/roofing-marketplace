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

  // Simulate analysis delay
  await new Promise((r) => setTimeout(r, 1500));

  // Mock analysis result
  const mock = {
    roofScore: 87,
    materials: ["Architectural shingles", "Aluminum drip edge"],
    findings: ["Granule loss", "Minor lifting"],
    summary: "Moderate wear with localized damage.",
  };

  setAnalysis(mock);

  statusEl.innerHTML = `<span class="status-dot"></span><span>Report ready! Redirecting…</span>`;

  setTimeout(() => {
    navigateTo(state.role === "roofer" ? "rooferDashboard" : "homeownerDashboard");
  }, 800);
}
