export default function rooferDashboardView() {
  return `
  <div class="dashboard-wrapper">
    <header class="dash-header">
      <div class="dash-brand">
        <div class="dash-mark">RM</div>
        <div class="dash-brand-text">
          <span class="dash-title">Roofing Marketplace</span>
          <span class="dash-subtitle">Roofer Dashboard</span>
        </div>
      </div>
    </header>

    <main class="dash-main">

      <section class="dash-card">
        <h2>Active Leads</h2>
        <div id="rooferLeads" class="lead-list"></div>
      </section>

      <section class="dash-card">
        <h2>Roof Details</h2>
        <div class="roof-details-grid">
          <div class="detail">
            <span class="detail-label">Material</span>
            <span id="rooferMaterial" class="detail-value">--</span>
          </div>
          <div class="detail">
            <span class="detail-label">Square Footage</span>
            <span id="rooferSqft" class="detail-value">--</span>
          </div>
          <div class="detail">
            <span class="detail-label">Valleys</span>
            <span id="rooferValleys" class="detail-value">--</span>
          </div>
          <div class="detail">
            <span class="detail-label">Stacks</span>
            <span id="rooferStacks" class="detail-value">--</span>
          </div>
        </div>
      </section>

      <section class="dash-card">
        <h2>Materials List (AI‑Generated)</h2>
        <ul id="materialsList" class="materials-list"></ul>
      </section>

      <section class="dash-card">
        <h2>Submit Your Quote</h2>
        <textarea id="rooferQuoteNotes" placeholder="Notes for the homeowner"></textarea>
        <input id="rooferQuotePrice" type="number" placeholder="Total price" />
        <button id="submitRooferQuote">Submit Quote</button>
      </section>

    </main>
  </div>
  `;
}
