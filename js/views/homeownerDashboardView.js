// js/views/homeownerDashboardView.js
import {
  getProject,
  getQuotesForProject,
  getRoofHealthForProject,
  getLastProjectForUser,
  acceptQuote,
} from '../services/projects.js';
import { currentUser } from '../app.js';

export async function renderHomeownerDashboardView() {
  const app = document.getElementById('app');

  if (!currentUser) {
    app.innerHTML = `<p>Please log in to view your dashboard.</p>`;
    return;
  }

  const lastProject = await getLastProjectForUser(currentUser.email);
  if (!lastProject) {
    app.innerHTML = `<p>You don't have any roof projects yet. Start by requesting quotes.</p>`;
    return;
  }

  const projectId = lastProject.id;
  const [project, quotes, health] = await Promise.all([
    getProject(projectId),
    getQuotesForProject(projectId),
    getRoofHealthForProject(projectId),
  ]);

  app.innerHTML = `
    <section class="dashboard-hero">
      <h1>Roof quotes for ${project.address}</h1>
      <p>We’ve matched you with roofers who want your business.</p>
    </section>

    <div class="dashboard-grid">
      <div class="dashboard-main">
        <section class="card">
          <div class="section-header">
            <h2>Competing roof quotes</h2>
            <select id="quote-sort">
              <option value="price">Sort by: Lowest price</option>
              <option value="warranty">Sort by: Longest warranty</option>
            </select>
          </div>
          <div id="quotes-list"></div>
        </section>
      </div>

      <aside class="dashboard-side">
        <section class="card">
          <h3>Upload roof photos</h3>
          <p class="muted">We’ll detect roof material and estimate square footage automatically.</p>
          <input type="file" id="roof-photo-input" accept="image/*" />
          <button id="upload-photo-btn" class="btn-secondary small">Upload & analyze</button>
          <div id="photo-ai-result" class="muted small" style="margin-top:6px;"></div>
        </section>

        <section class="card">
          <h3>Roof health check</h3>
          <p id="roof-health-summary" class="muted">
            ${
              health
                ? renderHealthSummary(health)
                : 'Run a quick check to see if you may qualify for a new roof through insurance.'
            }
          </p>
          <button id="run-health-check-btn" class="btn-secondary small">
            Run roof health check
          </button>
        </section>
      </aside>
    </div>
  `;

  renderQuotesList(quotes);

  document.getElementById('quote-sort').addEventListener('change', (e) => {
    const sorted = sortQuotes(quotes, e.target.value);
    renderQuotesList(sorted);
  });

  document.getElementById('upload-photo-btn').addEventListener('click', () => {
    const fileInput = document.getElementById('roof-photo-input');
    const file = fileInput.files[0];
    if (!file) return;
    handleRoofPhotoUpload(projectId, file);
  });

  document.getElementById('run-health-check-btn').addEventListener('click', () => {
    handleRoofHealthCheck(projectId, project);
  });
}

function renderQuotesList(quotes) {
  const container = document.getElementById('quotes-list');
  if (!quotes.length) {
    container.innerHTML = `<p class="muted">Quotes will appear here as roofers respond.</p>`;
    return;
  }

  const html = quotes
    .map(
      (q) => `
    <article class="quote-row">
      <div class="quote-main">
        <h3>${q.rooferName || 'Roofing Partner'}</h3>
        <p class="muted">${q.shingleType} · ${q.warrantyYears || '—'} year warranty</p>
      </div>
      <div class="quote-metrics">
        <div>
          <span class="label">Total price</span>
          <span class="value">$${Number(q.priceTotal).toLocaleString()}</span>
        </div>
        <div>
          <span class="label">Timeline</span>
          <span class="value">${q.timelineEstimate || '—'}</span>
        </div>
        <div>
          <span class="label">Rating</span>
          <span class="value">${q.rooferRating || '—'}</span>
        </div>
      </div>
      <div class="quote-cta">
        <button class="btn-primary small" data-quote-id="${q.id}">Select this quote</button>
      </div>
    </article>
  `
    )
    .join('');

  container.innerHTML = html;

  container.querySelectorAll('.btn-primary').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const quoteId = btn.getAttribute('data-quote-id');
      await acceptQuote(quoteId);
      btn.textContent = 'Selected';
      btn.disabled = true;
    });
  });
}

function sortQuotes(quotes, mode) {
  const copy = [...quotes];
  if (mode === 'price') {
    copy.sort((a, b) => Number(a.priceTotal) - Number(b.priceTotal));
  } else if (mode === 'warranty') {
    copy.sort((a, b) => Number(b.warrantyYears || 0) - Number(a.warrantyYears || 0));
  }
  return copy;
}

function renderHealthSummary(health) {
  return `Hail risk: <strong>${health.eligibilityLabel.toUpperCase()}</strong> · Score ${health.hailRiskScore}/100`;
}

async function handleRoofPhotoUpload(projectId, file) {
  const resultEl = document.getElementById('photo-ai-result');
  resultEl.textContent = 'Analyzing photo...';

  const base64 = await fileToBase64(file);

  try {
    const res = await fetch('/functions/analyze-roof-photo', {
      method: 'POST',
      body: JSON.stringify({ projectId, imageBase64: base64 }),
    });
    if (!res.ok) throw new Error('Failed');
    const { materialType, sqFt, pitch } = await res.json();
    resultEl.textContent = `Detected: ${materialType}, ~${sqFt} sq ft, pitch ${pitch}`;
  } catch {
    resultEl.textContent = 'Could not analyze photo. Please try another angle.';
  }
}

async function handleRoofHealthCheck(projectId, project) {
  const summaryEl = document.getElementById('roof-health-summary');
  summaryEl.textContent = 'Checking hail history and roof records...';

  const res = await fetch('/functions/roof-health-check', {
    method: 'POST',
    body: JSON.stringify({
      projectId,
      address: `${project.address}, ${project.city}, ${project.state} ${project.zip}`,
    }),
  });

  const data = await res.json();
  summaryEl.innerHTML = renderHealthSummary({
    hailRiskScore: data.score,
    eligibilityLabel: data.label,
  });
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

