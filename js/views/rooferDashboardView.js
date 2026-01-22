// js/views/rooferDashboardView.js
import {
  getOpenProjectsForRoofer,
  getQuotesForRoofer,
  createQuote,
} from '../services/projects.js';

export async function renderRooferDashboardView() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <section class="dashboard-hero">
      <h1>Roofer portal</h1>
      <p>Bid on new projects and manage your active quotes.</p>
    </section>

    <div class="tabs">
      <button class="tab active" data-tab="opportunities">Opportunities</button>
      <button class="tab" data-tab="my-quotes">My quotes</button>
    </div>

    <div id="tab-opportunities" class="tab-panel active"></div>
    <div id="tab-my-quotes" class="tab-panel"></div>
  `;

  const [openProjects, myQuotes] = await Promise.all([
    getOpenProjectsForRoofer(),
    getQuotesForRoofer('demo-roofer'), // replace with real rooferId from auth
  ]);

  renderOpportunities(openProjects);
  renderMyQuotes(myQuotes);

  document.querySelectorAll('.tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
    });
  });
}

function renderOpportunities(projects) {
  const container = document.getElementById('tab-opportunities');
  if (!projects.length) {
    container.innerHTML = `<p class="muted">No open projects right now.</p>`;
    return;
  }

  container.innerHTML = projects
    .map(
      (p) => `
    <article class="project-row">
      <div>
        <h3>${p.address}</h3>
        <p class="muted">${p.city}, ${p.state} ${p.zip}</p>
        <p class="muted">Desired: ${p.desiredRoofType} · Insurance: ${
          p.isInsuranceClaim ? 'Yes' : 'No'
        }</p>
      </div>
      <div class="project-metrics">
        <div>
          <span class="label">Est. sq ft</span>
          <span class="value">${p.aiGeometry?.sqFt || '—'}</span>
        </div>
        <div>
          <span class="label">Pitch</span>
          <span class="value">${p.aiGeometry?.pitch || '—'}</span>
        </div>
      </div>
      <div class="project-cta">
        <button class="btn-secondary small" data-project-id="${p.id}">Create quote</button>
      </div>
    </article>
  `
    )
    .join('');

  container.querySelectorAll('.btn-secondary').forEach((btn) => {
    btn.addEventListener('click', () => openQuoteModal(btn.dataset.projectId));
  });
}

function renderMyQuotes(quotes) {
  const container = document.getElementById('tab-my-quotes');
  if (!quotes.length) {
    container.innerHTML = `<p class="muted">You haven’t submitted any quotes yet.</p>`;
    return;
  }

  container.innerHTML = quotes
    .map(
      (q) => `
    <article class="quote-row">
      <div>
        <h3>${q.projectAddress || 'Roof project'}</h3>
        <p class="muted">Status: ${q.status}</p>
      </div>
      <div class="quote-metrics">
        <div>
          <span class="label">Total</span>
          <span class="value">$${Number(q.priceTotal).toLocaleString()}</span>
        </div>
        <div>
          <span class="label">Shingle</span>
          <span class="value">${q.shingleType}</span>
        </div>
        <div>
          <span class="label">Warranty</span>
          <span class="value">${q.warrantyYears} yrs</span>
        </div>
      </div>
    </article>
  `
    )
    .join('');
}

function openQuoteModal(projectId) {
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.innerHTML = `
    <div class="modal">
      <h2>Create quote</h2>
      <form id="quote-form">
        <label>Total price</label>
        <input type="number" id="quote-price" required />

        <label>Shingle type</label>
        <input type="text" id="quote-shingle" required />

        <label>Labor cost</label>
        <input type="number" id="quote-labor" required />

        <label>Material cost</label>
        <input type="number" id="quote-material" required />

        <label>Other costs</label>
        <input type="number" id="quote-other" value="0" />

        <label>Timeline estimate</label>
        <input type="text" id="quote-timeline" placeholder="e.g., 2–3 days" required />

        <label>Warranty (years)</label>
        <input type="number" id="quote-warranty" required />

        <div class="modal-actions">
          <button type="button" class="btn-secondary" id="quote-cancel">Cancel</button>
          <button type="submit" class="btn-primary">Submit quote</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('quote-cancel').onclick = () => modal.remove();

  document.getElementById('quote-form').onsubmit = async (e) => {
    e.preventDefault();
    await createQuote({
      projectId,
      rooferId: 'demo-roofer', // replace with real rooferId from auth
      priceTotal: Number(document.getElementById('quote-price').value),
      shingleType: document.getElementById('quote-shingle').value,
      laborCost: Number(document.getElementById('quote-labor').value),
      materialCost: Number(document.getElementById('quote-material').value),
      otherCosts: Number(document.getElementById('quote-other').value || 0),
      timelineEstimate: document.getElementById('quote-timeline').value,
      warrantyYears: Number(document.getElementById('quote-warranty').value),
    });
    modal.remove();
    renderRooferDashboardView();
  };
}

