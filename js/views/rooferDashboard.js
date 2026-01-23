import { getState, setProjects } from "../state.js";
import { navigateTo } from "../router.js";

export function renderRooferDashboardView(root) {
  const state = getState();
  const report = state.analysis;
  const projects = state.projects || [];

  root.innerHTML = `
    <section class="dashboard">
      <div>
        <h2>Roofer Dashboard</h2>

        <div class="card">
          <h3>Lead Snapshot</h3>
          ${
            report
              ? `
            <p><strong>Address:</strong> ${report.address}</p>
            <p><strong>Square footage:</strong> ${report.roofModel.sqFt} sq ft</p>
            <p><strong>Pitch:</strong> ${report.roofModel.pitch}</p>
            <p><strong>Complexity:</strong> ${report.roofModel.complexity}</p>
            <p><strong>Condition:</strong> ${report.roofModel.conditionLabel} (${report.roofModel.conditionScore}/100)</p>
            <p><strong>AI Estimated Range:</strong> $${report.quote.estimatedLow.toLocaleString()} – $${report.quote.estimatedHigh.toLocaleString()}</p>
            <button class="btn-primary" id="submit-quote-btn">Submit Quote</button>
          `
              : `
            <p>No active lead yet. Have a homeowner complete the intake flow.</p>
          `
          }
        </div>

        <div class="card">
          <h3>Project Management</h3>
          <p class="hero-visual-sub">Track quotes and job status for this lead.</p>
          <div class="project-list" id="project-list"></div>
        </div>
      </div>

      <div>
        <div class="card">
          <h3>AI Findings</h3>
          ${
            report
              ? `
            <ul>
              ${report.findings.map(f => `<li>${f}</li>`).join("")}
            </ul>
          `
              : `<p>No findings available.</p>`
          }
        </div>

        <div class="card">
          <h3>Recent Activity</h3>
          <ul>
            <li>${projects.length ? "Project created from latest lead." : "No projects yet."}</li>
            <li>Suggested: Upload license & insurance to boost trust.</li>
          </ul>
        </div>
      </div>
    </section>
  `;

  const listEl = document.getElementById("project-list");
  let updatedProjects = [...projects];

  if (report && !updatedProjects.length) {
    updatedProjects.push({
      id: "proj-1",
      address: report.address,
      status: "New",
      quote: "",
      notes: ""
    });
    setProjects(updatedProjects);
  }

  listEl.innerHTML = updatedProjects
    .map(
      (p, idx) => `
      <div class="project-item" data-id="${p.id}">
        <div class="project-item-header">
          <strong>Project #${idx + 1}</strong>
          <span class="hero-visual-sub">${p.address}</span>
        </div>
        <div class="project-meta">
          <span>Status: ${p.status}</span>
          <span>Quote: ${p.quote ? `$${p.quote}` : "Not set"}</span>
        </div>
        <div class="project-controls">
          <select class="project-status">
            <option value="New" ${p.status === "New" ? "selected" : ""}>New</option>
            <option value="Quoted" ${p.status === "Quoted" ? "selected" : ""}>Quoted</option>
            <option value="Won" ${p.status === "Won" ? "selected" : ""}>Won</option>
            <option value="Lost" ${p.status === "Lost" ? "selected" : ""}>Lost</option>
          </select>
          <input
            type="number"
            min="0"
            placeholder="Quote $"
            class="project-quote"
            value="${p.quote || ""}"
          />
        </div>
      </div>
    `
    )
    .join("");

  Array.from(listEl.querySelectorAll(".project-item")).forEach((itemEl, index) => {
    const statusSelect = itemEl.querySelector(".project-status");
    const quoteInput = itemEl.querySelector(".project-quote");

    statusSelect.addEventListener("change", () => {
      updatedProjects[index].status = statusSelect.value;
      setProjects(updatedProjects);
    });

    quoteInput.addEventListener("input", () => {
      updatedProjects[index].quote = quoteInput.value;
      setProjects(updatedProjects);
    });
  });

  if (report) {
    const btn = document.getElementById("submit-quote-btn");
    btn.addEventListener("click", () => {
      navigateTo("quoteSubmission");
    });
  }
}
