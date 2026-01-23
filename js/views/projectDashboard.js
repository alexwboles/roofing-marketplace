// js/views/projectDashboard.js
// Project detail dashboard for homeowners or roofers

import { createCard, createButton } from "../uiComponents.js";

export async function renderProjectDashboardView({ root }) {
  root.innerHTML = "";

  const container = document.createElement("section");
  container.className = "intake-wizard";

  const title = document.createElement("h1");
  title.textContent = "Project Dashboard";

  /* ---------------------------------------------
     Placeholder project (replace with backend)
  --------------------------------------------- */
  const project = {
    id: "proj123",
    homeowner: "John Smith",
    address: "123 Main St, St Augustine, FL",
    roofer: "Sunshine Roofing",
    status: "Scheduled",
    startDate: "Feb 12, 2026",
    notes: "Permit approved. Materials ordered."
  };

  const card = createCard({
    title: project.homeowner,
    subtext: project.address,
    variant: "light",
    content: [
      row("Roofer", project.roofer),
      row("Status", project.status),
      row("Start date", project.startDate),
      row("Notes", project.notes),
      createButton({
        label: "Update Status",
        variant: "primary",
        onClick: () => alert("Status update UI coming soon")
      })
    ]
  });

  container.append(title, card);
  root.appendChild(container);
}

function row(label, value) {
  const r = document.createElement("div");
  r.className = "card-row";

  const l = document.createElement("span");
  l.textContent = label;

  const v = document.createElement("strong");
  v.textContent = value;

  r.append(l, v);
  return r;
}

export const renderView = renderProjectDashboardView;
