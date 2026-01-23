// js/views/analysis.js

import { createButton, createCard, createMetricRow } from "../uiComponents.js";
import { navigate } from "../router.js";

export async function renderAnalysisView({ root }) {
  root.innerHTML = "";

  const stored = sessionStorage.getItem("roofAnalysis");
  if (!stored) {
    navigate("/intake");
    return;
  }

  const { address, analysis } = JSON.parse(stored);

  const container = document.createElement("section");
  container.className = "intake-wizard";

  const title = document.createElement("h1");
  title.textContent = "We analyzed your roof";

  const summaryCard = createCard({
    title: "AI Roof Snapshot",
    subtext: address,
    variant: "light",
    content: [
      createMetricRow("Estimated roof area", `${analysis.areaSqFt} sq ft`),
      createMetricRow("Pitch", analysis.pitchLabel),
      createMetricRow("Complexity", analysis.complexity),
      createMetricRow("Condition score", `${analysis.conditionScore}/100`),
      createMetricRow(
        "Estimated replacement range",
        `$${analysis.estimateLow} – $${analysis.estimateHigh}`
      )
    ]
  });

  const cta = createButton({
    label: "Get competing quotes from local roofers",
    variant: "primary",
    onClick: () => navigate("/quotes")
  });

  container.append(title, summaryCard, cta);
  root.appendChild(container);
}

export const renderView = renderAnalysisView;
