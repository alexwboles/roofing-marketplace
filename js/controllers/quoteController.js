import { getState } from "../state.js";
import { navigateTo } from "../router.js";

export async function submitQuote({ price, timeline, warranty, notes }) {
  const state = getState();
  const statusEl = document.getElementById("quote-status");

  if (!price) {
    statusEl.innerHTML = `<span class="status-dot"></span><span>Please enter a price.</span>`;
    return;
  }

  const payload = {
    leadId: "lead-1",        // placeholder until you wire real leads
    rooferId: "roofer-1",    // placeholder until auth exists
    price,
    timeline,
    warranty,
    notes
  };

  statusEl.innerHTML = `<span class="status-dot"></span><span>Submitting quote…</span>`;

  try {
    const response = await fetch("/submitQuote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error("Failed");

    await response.json();

    statusEl.innerHTML = `<span class="status-dot"></span><span>Quote submitted!</span>`;

    setTimeout(() => {
      navigateTo("rooferDashboard");
    }, 700);
  } catch (err) {
    statusEl.innerHTML = `<span class="status-dot"></span><span>Error submitting quote.</span>`;
  }
}
