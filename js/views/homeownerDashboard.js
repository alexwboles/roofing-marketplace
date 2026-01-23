export default function homeownerDashboardView() {
  return `
  <div class="dashboard-wrapper">
    <header class="dash-header">
      <div class="dash-brand">
        <div class="dash-mark">RM</div>
        <div class="dash-brand-text">
          <span class="dash-title">Roofing Marketplace</span>
          <span class="dash-subtitle">Homeowner Dashboard</span>
        </div>
      </div>
    </header>

    <main class="dash-main">

      <section class="dash-card roof-health-card">
        <h2>Your Roof Health</h2>

        <div class="roof-health-score">
          <div class="score-circle">
            <span id="roofScore">--</span>
          </div>
          <div class="score-details">
            <p class="score-label">Overall Condition</p>
            <p id="roofCondition" class="score-value">Loading...</p>
          </div>
        </div>

        <div class="roof-metrics">
          <div class="metric">
            <span class="metric-label">Estimated Age</span>
            <span id="roofAge" class="metric-value">--</span>
          </div>
          <div class="metric">
            <span class="metric-label">Material</span>
            <span id="roofMaterial" class="metric-value">--</span>
          </div>
          <div class="metric">
            <span class="metric-label">Square Footage</span>
            <span id="roofSqft" class="metric-value">--</span>
          </div>
        </div>
      </section>

      <section class="dash-card">
        <h2>Your Uploaded Photos</h2>
        <div id="homeownerPhotoGrid" class="photo-grid"></div>
      </section>

      <section class="dash-card">
        <h2>Available Quotes</h2>
        <div id="quotesList" class="quotes-list"></div>
      </section>

    </main>
  </div>
  `;
}
