// js/views/homeownerDashboardView.js
import { getProjectWithQuotes } from '../services/projects.js';

export async function renderHomeownerDashboardView() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <section class="dashboard-hero">
      <h1>Your roof quotes</h1>
      <p>Compare options side by side and choose the best fit.</p>
    </section>

    <div class="dashboard-grid">
      <div class="dashboard-main">
        <div class="card" id="quotes-card">
          <div class="section-header">
            <h2>Competing bids</h2>
          </div>
          <div id="quotes-list"></div>
        </div>
      </div>

      <div class="dashboard-side">
        <div class="card" id="health-card">
          <h2>Roof health</h2>
          <p class="muted" id="health-summary">Checking hail history and roof age...</p>
        </div>
      </div>
    </div>
  `;

  const data = await getProjectWithQuotes();
  const quotesList = document.getElementById('quotes-list');
  const healthSummary = document.getElementById('health-summary');

  if (!data) {
    quotesList.innerHTML = `<p class="muted">No active project found.</p>`;
    healthSummary.textContent = 'No roof health data yet.';
    return;
  }

  const { quotes = [], roofHealth } = data;

  if (!quotes.length) {
    quotesList.innerHTML = `<p class="muted">Roofers are preparing your quotes. Check back soon.</p>`;
  } else {
    quotesList.innerHTML = quotes.map(q => `
      <div class="quote-row">
        <div class="quote-main">
          <h3>${q.rooferName}</h3>
          <p class="muted">${q.tagline || 'Licensed & insured roofer'}</p>
        </div>
        <div class="quote-metrics">
          <div>
            <span class="label">Price</span>
            <span class="value">$${q.price}</span>
          </div>
          <div>
            <span class="label">Shingle</span>
            <span class="value">${q.shingleType || 'Architectural'}</span>
          </div>
          <div>
            <span class="label">Timeline</span>
            <span class="value">${q.timeline || '1–2 weeks'}</span>
          </div>
        </div>
        <div class="quote-cta">
          <button class="btn-secondary small">View details</button>
        </div>
      </div>
    `).join('');
  }

  if (roofHealth) {
    healthSummary.textContent = `Insurance eligibility: ${roofHealth.eligibilityLabel.toUpperCase()} (${roofHealth.hailRiskScore}/100)`;
  } else {
    healthSummary.textContent = 'Roof health check is still running.';
  }
}
