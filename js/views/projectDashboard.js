import { getState, setCurrentProject } from "../state.js";

export function renderProjectDashboardView(root) {
  const state = getState();
  let project = state.currentProject;

  if (!project && state.projects.length) {
    project = state.projects[state.projects.length - 1];
    setCurrentProject(project);
  }

  if (!project) {
    root.innerHTML = `
      <section class="card">
        <h2>No Active Project</h2>
        <p>Accept a quote to create a project.</p>
      </section>
    `;
    return;
  }

  root.innerHTML = `
    <section class="dashboard">
      <div>
        <h2>Project Dashboard</h2>
        <p class="hero-visual-sub">${project.address}</p>

        <div class="card">
          <h3>Overview</h3>
          <p><strong>Roofer:</strong> ${project.rooferName}</p>
          <p><strong>Status:</strong> ${project.status}</p>
          <p><strong>Accepted Price:</strong> $${project.acceptedQuote.price.toLocaleString()}</p>
          <p><strong>Timeline:</strong> ${project.acceptedQuote.timeline}</p>
          <p><strong>Warranty:</strong> ${project.acceptedQuote.warranty}</p>
        </div>

        <div class="card">
          <h3>Schedule</h3>
          <label>Start Date</label>
          <input type="date" id="project-start-date" value="${project.schedule.startDate || ""}" />
          <label>End Date</label>
          <input type="date" id="project-end-date" value="${project.schedule.endDate || ""}" />
          <button class="btn-primary" id="update-schedule-btn">Update Schedule</button>
        </div>

        <div class="card">
          <h3>Materials</h3>
          <ul id="materials-list">
            ${project.materials
              .map(
                (m, idx) => `
              <li>
                <strong>${m.name}</strong> — 
                <input 
                  type="text" 
                  data-index="${idx}" 
                  class="material-qty" 
                  value="${m.quantity}" 
                  placeholder="Quantity"
                />
              </li>
            `
              )
              .join("")}
          </ul>
          <button class="btn-secondary" id="update-materials-btn">Update Materials</button>
        </div>
      </div>

      <div>
        <div class="card">
          <h3>Messages</h3>
          <div id="messages-thread" class="messages-thread">
            ${
              project.messages.length === 0
                ? `<p class="hero-visual-sub">No messages yet.</p>`
                : project.messages
                    .map(
                      (m) => `
                  <div class="message-item">
                    <strong>${m.sender === "roofer" ? "Roofer" : "You"}:</strong>
                    <span>${m.text}</span>
                  </div>
                `
                    )
                    .join("")
            }
          </div>
          <textarea id="message-input" placeholder="Send a message"></textarea>
          <button class="btn-primary" id="send-message-btn">Send</button>
        </div>
      </div>
    </section>
  `;

  // Schedule update
  document.getElementById("update-schedule-btn").addEventListener("click", () => {
    const start = document.getElementById("project-start-date").value;
    const end = document.getElementById("project-end-date").value;
    project.schedule.startDate = start || null;
    project.schedule.endDate = end || null;
    setCurrentProject(project);
  });

  // Materials update
  document.getElementById("update-materials-btn").addEventListener("click", () => {
    document.querySelectorAll(".material-qty").forEach((input) => {
      const idx = Number(input.getAttribute("data-index"));
      project.materials[idx].quantity = input.value;
    });
    setCurrentProject(project);
  });

  // Messaging
  document.getElementById("send-message-btn").addEventListener("click", () => {
    const input = document.getElementById("message-input");
    const text = input.value.trim();
    if (!text) return;

    project.messages.push({
      sender: "homeowner",
      text,
      timestamp: Date.now()
    });

    setCurrentProject(project);
    renderProjectDashboardView(root);
  });
}
