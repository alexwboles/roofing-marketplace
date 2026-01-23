export function renderRooferDashboardView(root) {
  root.innerHTML = `
    <section class="dashboard">
      <h2>Roofer Dashboard</h2>

      <div class="card">
        <h3>Incoming Leads</h3>
        <p>No new leads yet.</p>
      </div>

      <div class="card">
        <h3>Recent Activity</h3>
        <ul>
          <li>No recent activity.</li>
        </ul>
      </div>
    </section>
  `;
}
