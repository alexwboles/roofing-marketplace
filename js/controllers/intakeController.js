import { getState } from "../state.js";

export function renderHomeownerDashboardView(root) {
  const state = getState();
  const analysis = state.analysis;

  root.innerHTML = `
    <section class="section">
      <h2 class="section-title">Your roof report</h2>
      <p class="section-subtitle">
        Here’s a homeowner-friendly summary of what we see, plus the details your roofer will care about.
      </p>

      <div class="dashboard-layout">
        <div class="dashboard-card">
          <div class="dashboard-header">
            <div>
              <div class="dashboard-title">Roof Health Score</div>
              <div class="helper-text">
                Higher is better. We look at visible wear, damage, and risk factors.
              </div>
            </div>
            <div class="score-pill">
              <span class="score-pill-value">${analysis.roofScore ?? "—"}</span>
              <span>/ 100</span>
            </div>
          </div>

          <ul class="list">
            <li class="list-item">
              <span class="list-item-label">Overall condition</span>
              <span class="list-item-value">
                ${analysis.summary || "We’ll summarize your roof once analysis is complete."}
              </span>
            </li>
          </ul>

          <div class="chip-row">
            ${(analysis.findings || [])
              .map((f) => `<span class="chip">${f}</span>`)
              .join("")}
          </div>
        </div>

        <div class="dashboard-card">
          <div class="dashboard-header">
            <div class="dashboard-title">What to share with roofers</div>
            <span class="badge">Roofer-ready</span>
          </div>
          <div class="helper-text">
            Copy this into an email or attach it to an online quote request.
          </div>
          <div class="card-body" style="margin-top:0.5rem;font-size:0.85rem;">
            <strong>Address:</strong> ${state.intake.address || "Not provided"}<br />
            <strong>Key details:</strong> ${state.intake.notes || "No extra notes provided."}<br />
            <strong>Materials we detected:</strong>
            ${(analysis.materials || []).join(", ") || "We’ll list materials once analysis is complete."}
          </div>
        </div>
      </div>
    </section>
  `;
}

