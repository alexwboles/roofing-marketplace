// js/views/rooferDashboardView.js

import { getRooferProjects, submitBid } from "../services/projects.js";

export async function renderRooferDashboardView() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <section class="dashboard-hero">
      <h1>Roofer dashboard</h1>
      <p>See available projects and submit bids.</p>
    </section>

    <div class="hero-image">
      <img src="https://images.unsplash.com/photo-1600585154154-3d26f4f8b9a6" alt="Professional roofer installing shingles">
    </div>

    <div class="card">
      <div class="section-header">
        <h2>Available projects</h2>
        <p class="muted">AI measurements and materials lists included.</p>
      </div>
      <div id="projects-list"></div>
    </div>
  `;

  const projects = await getRooferProjects();
  const list = document.getElementById("projects-list");

  if (!projects.length) {
    list.innerHTML = `<p class="muted">No open projects right now.</p>`;
    return;
  }

  list.innerHTML = projects
    .map(
      (p) => `
    <div class="project-row">
      <div>
        <h3>${p.address}</h3>
        <p class="muted">${p.roofType} roof · ${
        p.insurance === "yes" ? "Insurance claim" : "Cash/financed"
      }</p>
      </div>

      <div class="project-metrics">
        <div>
          <span class="label">AI sq ft</span>
          <span class="value">${p.aiGeometry?.sqFt || "—"}</span>
        </div>
        <div>
          <span class="label">AI pitch</span>
          <span class="value">${p.aiGeometry?.pitch || "—"}</span>
        </div>
      </div>

      <div class="project-cta">
        <button class="btn-secondary small" data-project="${p.id}">Submit bid</button>
      </div>
    </div>

    <div class="card" style="margin-top:8px;">
      <h3>Materials & Cost Calculator</h3>
      <div id="materials-${p.id}">
        ${
          p.materialsList
            ? renderMaterialsCalculator(p.id, p.materialsList)
            : '<p class="muted">AI materials list not available yet.</p>'
        }
      </div>
    </div>
  `
    )
    .join("");

  list.addEventListener("click", async (e) => {
    const projectId = e.target.getAttribute("data-project");
    if (projectId) {
      const price = prompt("Enter your bid price (USD):");
      if (!price) return;

      await submitBid(projectId, {
        price: Number(price),
        rooferName: "Sample Roofer",
        shingleType: "Architectural",
        timeline: "1–2 weeks",
      });

      alert("Bid submitted.");
      return;
    }

    const calcId = e.target.getAttribute("data-calc");
    if (calcId) {
      const rows = document.querySelectorAll(`#materials-${calcId} .material-row`);
      let total = 0;

      rows.forEach((row) => {
        const qty = parseFloat(row.querySelector(".qty").value);
        const cost = parseFloat(row.querySelector(".cost").value);
        if (!isNaN(qty) && !isNaN(cost)) total += qty * cost;
      });

      document.getElementById(`total-${calcId}`).textContent =
        `Estimated materials cost: $${total.toFixed(2)}`;
    }
  });
}

function renderMaterialsCalculator(id, materialsList) {
  const rows = Object.entries(materialsList)
    .map(
      ([k, v]) => `
      <div class="material-row">
        <span class="material-name">${k}</span>
        <input type="number" class="qty" data-key="${k}" value="${parseInt(v) || 0}" />
        <input type="number" class="cost" data-key="${k}" placeholder="Unit cost" />
      </div>
    `
    )
    .join("");

  return `
    ${rows}
    <button class="btn-secondary small" data-calc="${id}">Calculate Total</button>
    <p id="total-${id}" class="muted" style="margin-top:6px;"></p>
  `;
}
