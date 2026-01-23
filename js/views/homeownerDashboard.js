// js/views/homeownerDashboard.js
// Homeowner dashboard showing AI roof data + quotes

import { createCard, createButton, createMetricRow } from "../uiComponents.js";
import { navigate } from "../router.js";

export async function renderHomeownerDashboardView({ root }) {
  root.innerHTML = "";

  const container = document.createElement("section");
  container.className = "dashboard";

  /* ---------------------------------------------
     LEFT SIDE — AI Roof Report Summary
  --------------------------------------------- */
  const left = document.createElement("div");

  const stored = sessionStorage.getItem("roofAnalysis");
  let analysis = null;

  if (stored) {
    const parsed = JSON.parse(stored);
    analysis = parsed.analysis;
  }

  const roofCard = createCard({
    title: "Your AI Roof Report",
    subtext: analysis ? parsed.address : "No report available",
    variant: "light",
    content: analysis
      ? [
          createMetricRow("Roof area", `${analysis.areaSqFt} sq ft`),
          createMetricRow("Pitch", analysis.pitchLabel),
          createMetricRow("Complexity", analysis.complexity),
          createMetricRow("Condition score", `${analysis.conditionScore}/100`),
          createMetricRow(
            "Estimated replacement range",
            `$${analysis.estimateLow} – $${analysis.estimateHigh}`
          ),
          createButton({
            label: "View Quotes",
            variant: "primary",
            onClick: () => navigate("/quotes")
          })
        ]
      : [
          createButton({
            label: "Get My Free Roof Report",
            variant: "primary",
            onClick: () => navigate("/intake")
          })
        ]
  });

  left.appendChild(roofCard);

  /* ---------------------------------------------
     RIGHT SIDE — Quotes Overview
  --------------------------------------------- */
  const right = document.createElement("div");

  const quotesCard = createCard({
    title: "Your Quotes",
    variant: "light",
    content: [
      quoteRow("Sunshine Roofing", "$14,800", "25 yrs • 2 weeks"),
      quoteRow("Atlantic Coast Roofers", "$13,950", "20 yrs • 3 weeks"),
      createButton({
        label: "Compare Quotes",
        variant: "primary",
        onClick: () => navigate("/quotes")
      })
    ]
  });

  right.appendChild(quotesCard);

  container.append(left, right);
  root.appendChild(container);
}

function quoteRow(name, price, meta) {
  const row = document.createElement("div");
  row.className = "card-row";

  const left = document.createElement("span");
  left.textContent = name;

  const right = document.createElement("strong");
  right.textContent = `${price} • ${meta}`;

  row.append(left, right);
  return row;
}

export const renderView = renderHomeownerDashboardView;
