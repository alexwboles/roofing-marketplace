import { getState } from "../state.js";

export function renderRooferDashboardView(root) {
  const state = getState();
  const analysis = state.analysis;

  root.innerHTML = `
    <section class="dashboard">
      <div>
        <h2>Roofer Dashboard</h2>

        <div class="card">
          <h3>Lead Snapshot</h3>
          ${
            analysis
              ? `
            <p><strong>Address:</strong> ${state.intake.address || "Unknown"}</p>
            <p><strong>Roof Score:</strong> ${analysis.roofScore}</p>
            <p><strong>Summary:</strong> ${analysis.summary}</p>
          `
              : `
            <p>No active lead yet. Have a homeowner complete the intake flow.</p>
          `
          }
        </div>
      </div>

      <div>
        <div class="card">
          <h3>Recent Activity</h3>
          <ul>
            <li>New homeowner lead pending review.</li>
            <li>Suggested: Upload your license & insurance to boost trust.</li>
          </ul>
        </div>
      </div>
    </section>
  `;
}
