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
            <p class="muted">When roofers compete, you win.</p>
          </div>
          <div id="quotes-list"></div>
        </div>

        <div class="card">
          <h2>AI Materials List</h2>
          <ul id="materials-list"></ul>
        </div>

        <div class="card" id="geometry-card">
          <h2>AI Roof Geometry</h2>
          <p class="muted" id="geometry-summary">Analyzing roof facets, pitch, and square footage...</p>
        </div>
      </div>

      <div class="dashboard-side">
        <div class="card" id="health-card">
          <h2>Roof health & damage</h2>
          <p class="muted" id="health-summary">Checking hail history, roof age, and damage...</p>
          <div id="damage-details" class="muted" style="margin-top:8px;font-size:12px;"></div>
        </div>

        <div class="card dashboard-image">
          <img src="https://images.unsplash.com/photo-1597004891283-5e1e7b3b18a4" alt="Roof inspection">
          <p class="muted" style="font-size:12px;">Licensed, insured roofers reviewing your project details.</p>
        </div>
      </div>
    </div>
  `;

  const data = await getProjectWithQuotes();
  const quotesList = document.getElementById('quotes-list');
  const healthSummary = document.getElementById('health-summary');
  const damageDetails = document.getElementById('damage-details');
  const geometrySummary = document.getElementById('geometry-summary');
  const materialsListEl = document.getElementById('materials-list');

  if (!data) {
    quotesList.innerHTML = `<p class="muted">No active project found.</p>`;
    healthSummary.textContent = 'No roof health data yet.';
    geometrySummary.textContent = 'No AI geometry data yet.';
    return;
  }

  const { project, quotes = [], roofHealth } = data;

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
    const { hailScore, roofAge, eligibility, damageReport } = roofHealth;

    healthSummary.textContent =
      `Insurance eligibility: ${eligibility.toUpperCase()} · Hail risk: ${hailScore}/100 · Estimated roof age: ${roofAge} years`;

    if (damageReport) {
      const entries = Object.entries(damageReport)
        .map(([k, v]) => {
          if (!v || typeof v !== 'object') return null;
          const label = k.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());
          return `${label}: ${v.present ? v.severity : 'none'}`;
        })
        .filter(Boolean);

      damageDetails.innerHTML = entries.length
        ? entries.join('<br/>')
        : 'No significant damage indicators detected.';
    } else {
      damageDetails.textContent = 'Damage classification still processing.';
    }
  } else {
    healthSummary.textContent = 'Roof health check is still running.';
    damageDetails.textContent = '';
  }

  if (project.materialsList) {
    const list = project.materialsList;
    materialsListEl.innerHTML = Object.entries(list)
      .map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`)
      .join('');
  } else {
    materialsListEl.innerHTML = `<li class="muted">AI materials list will appear here once analysis completes.</li>`;
  }

  if (project.aiGeometry) {
    const g = project.aiGeometry;
    geometrySummary.innerHTML = `
      Square footage: <strong>${g.sqFt || '—'}</strong><br/>
      Pitch: <strong>${g.pitch || '—'}</strong><br/>
      Valleys: <strong>${g.valleys || '—'}</strong><br/>
      Ridges: <strong>${g.ridges || '—'}</strong><br/>
      Facets: <strong>${g.facets || '—'}</strong>
    `;
  } else {
    geometrySummary.textContent = 'AI roof geometry is still processing.';
  }
}
