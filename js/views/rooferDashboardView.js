// js/views/rooferDashboardView.js
import { getRooferProjects, submitBid } from '../services/projects.js';

export async function renderRooferDashboardView() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <section class="dashboard-hero">
      <h1>Roofer dashboard</h1>
      <p>See available projects and submit bids.</p>
    </section>

    <div class="card">
      <div class="section-header">
        <h2>Available projects</h2>
      </div>
      <div id="projects-list"></div>
    </div>
  `;

  const projects = await getRooferProjects();
  const list = document.getElementById('projects-list');

  if (!projects.length) {
    list.innerHTML = `<p class="muted">No open projects right now.</p>`;
    return;
  }

  list.innerHTML = projects.map(p => `
    <div class="project-row">
      <div>
        <h3>${p.address}</h3>
        <p class="muted">${p.roofType} roof · ${p.insurance === 'yes' ? 'Insurance claim' : 'Cash/financed'}</p>
      </div>
      <div class="project-metrics">
        <div>
          <span class="label">AI sq ft</span>
          <span class="value">${p.aiSqFt || '—'}</span>
        </div>
        <div>
          <span class="label">AI material</span>
          <span class="value">${p.aiMaterial || '—'}</span>
        </div>
      </div>
      <div class="project-cta">
        <button class="btn-secondary small" data-project="${p.id}">Submit bid</button>
      </div>
    </div>
  `).join('');

  list.addEventListener('click', async (e) => {
    const projectId = e.target.getAttribute('data-project');
    if (!projectId) return;

    const price = prompt('Enter your bid price (USD):');
    if (!price) return;

    await submitBid(projectId, {
      price: Number(price),
      rooferName: 'Sample Roofer',
      shingleType: 'Architectural',
      timeline: '1–2 weeks'
    });

    alert('Bid submitted.');
  });
}
