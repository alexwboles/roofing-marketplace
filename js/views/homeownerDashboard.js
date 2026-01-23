import { getState } from "../state.js";

export function renderHomeownerDashboardView(root) {
  const state = getState();
  const analysis = state.analysis;

  root.innerHTML = `
    <section class="dashboard">
      <div>
        <h2>Homeowner Dashboard</h2>

        <div class="card">
          <h3>Your Roof Health Report</h3>
          ${
            analysis
              ? `
            <p><strong>Score:</strong> ${analysis.roofScore}/100</p>
            <p><strong>Condition:</strong> ${analysis.conditionLabel}</p>
            <p><strong>Estimated age:</strong> ${analysis.estimatedAge} years</p>
            <p><strong>Estimated size:</strong> ${analysis.estimatedSqFt} sq ft</p>
            <p><strong>Complexity:</strong> ${analysis.complexity}</p>
            <p><strong>Estimated replacement range:</strong> $${analysis.estimatedLow.toLocaleString()} – $${analysis.estimatedHigh.toLocaleString()}</p>
            <p><strong>Summary:</strong> ${analysis.summary}</p>
            <p><strong>Materials:</strong> ${analysis.materials.join(", ")}</p>
            <p><strong>Findings:</strong> ${analysis.findings.join(", ")}</p>
          `
              : `
            <p>No report available yet. Complete the intake to generate one.</p>
          `
          }
        </div>
      </div>

      <div>
        <div class="card">
          <h3>Recent Activity</h3>
          <ul>
            <li>Report ${
              analysis ? "generated" : "not generated yet"
            } for ${state.intake.address || "your property"}.</li>
            <li>Next step: Compare quotes from verified roofers.</li>
          </ul>
        </div>
      </div>
    </section>
  `;
}
