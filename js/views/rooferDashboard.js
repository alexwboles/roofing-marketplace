// js/views/rooferDashboard.js

import { createButton, createCard } from "../uiComponents.js";

export async function renderRooferDashboardView({ root }) {
  root.innerHTML = "";

  const container = document.createElement("section");
  container.className = "intake-wizard";

  const title = document.createElement("h1");
  title.textContent = "Roofer Dashboard";

  const leads = [
    {
      id: "lead123",
      homeowner: "John Smith",
      address: "123 Main St, St Augustine, FL",
      analysis: {
        areaSqFt: 2450,
        pitchLabel: "6/12",
        complexity: "Gable",
        conditionScore: 82,
        estimateLow: 13500,
        estimateHigh: 17200
      }
    }
  ];

  const list = document.createElement("div");
  list.className = "project-list";

  leads.forEach((lead) => {
    const card = createCard({
      title: lead.homeowner,
      subtext: lead.address,
      variant: "light",
      content: [
        metric("Roof area", `${lead.analysis.areaSqFt} sq ft`),
        metric("Pitch", lead.analysis.pitchLabel),
        metric("Complexity", lead.analysis.complexity),
        metric("Condition score", `${lead.analysis.conditionScore}/100`),
        metric(
          "AI estimated range",
          `$${lead.analysis.estimateLow} – $${lead.analysis.estimateHigh}`
        ),
        createButton({
          label: "Create Quote",
          variant: "primary",
          onClick: () => {
            sessionStorage.setItem("activeLead", JSON.stringify(lead));
            window.location.href = "/quoteSubmission";
          }
        })
      ]
    });

    list.appendChild(card);
  });

  container.append(title, list);
  root.appendChild(container);
}

function metric(label, value) {
  const row = document.createElement("div");
  row.className = "card-row";

  const l = document.createElement("span");
  l.textContent = label;

  const v = document.createElement("strong");
  v.textContent = value;

  row.append(l, v);
  return row;
}

export const renderView = renderRooferDashboardView;
