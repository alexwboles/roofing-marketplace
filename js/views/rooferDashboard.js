import { getState, setProjects } from "../state.js";

export function renderRooferDashboardView(root) {
  const state = getState();
  const analysis = state.analysis;
  const projects = state.projects || [];

  root.innerHTML = `
    <section class="dashboard">
      <div>
        <h2>Roofer Dashboard</h2>

        <div class="card">
          <h3>Lead Snapshot</h3>
          ${
            analysis
              ? `
            <p><strong>Address:</strong> ${state.intake.address || "Unknown"}</p>
            <p><strong>Roof Score:</strong> ${analysis.roofScore}/100 (${analysis.conditionLabel})</p>
            <p><strong>Size:</strong> ${analysis.estimatedSqFt} sq ft</p>
            <p><strong>Complexity:</strong> ${analysis.complexity}</p>
            <p><strong>Suggested range:</strong> $${analysis.estimatedLow.toLocaleString()} – $${analysis.estimatedHigh.toLocaleString()}</p>
          `
              : `
            <p>No active lead yet. Have a homeowner complete the intake flow.</p>
          `
          }
        </div>

        <div class="card">
          <h3>Project Management</h3>
          <p class="hero-visual-sub">
            Track quotes and job status for this lead.
          </p>
          <div class="project-list" id="project-list"></div>
        </div>
      </div>

      <div>
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

  // Ensure at least one project derived from current intake/analysis
  let updatedProjects = [...projects];
  if (analysis && !updatedProjects.length) {
    updatedProjects.push({
      id: "proj-1",
      address: state.intake.address || "Unknown",
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
}
