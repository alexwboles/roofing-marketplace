// js/views/rooferDashboard.js
// Roofer dashboard with AI-prefilled quote creation

import { createButton, createCard, createInputGroup } from "../uiComponents.js";

export async function renderRooferDashboardView({ root }) {
  root.innerHTML = "";

  const container = document.createElement("section");
  container.className = "intake-wizard";

  const title = document.createElement("h1");
  title.textContent = "Roofer Dashboard";

  /* ---------------------------------------------
     Placeholder leads (replace with backend fetch)
  --------------------------------------------- */
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
          onClick: () => openQuoteForm(lead, root)
        })
      ]
    });

    list.appendChild(card);
  });

  container.append(title, list);
  root.appendChild(container);
}

/* ---------------------------------------------
   Quote creation form (AI-prefilled)
--------------------------------------------- */

function openQuoteForm(lead, root) {
  root.innerHTML = "";

  const container = document.createElement("section");
  container.className = "intake-wizard";

  const title = document.createElement("h1");
  title.textContent = `Create Quote for ${lead.homeowner}`;

  const form = document.createElement("div");

  const { group: priceGroup, input: priceInput } = createInputGroup({
    label: "Quote price",
    name: "price",
    type: "number",
    placeholder: lead.analysis.estimateLow.toString(),
    variant: "light"
  });

  const { group: timelineGroup, input: timelineInput } = createInputGroup({
    label: "Timeline",
    name: "timeline",
    placeholder: "2 weeks",
    variant: "light"
  });

  const { group: warrantyGroup, input: warrantyInput } = createInputGroup({
    label: "Warranty",
    name: "warranty",
    placeholder: "25 years",
    variant: "light"
  });

  form.append(priceGroup, timelineGroup, warrantyGroup);

  const submitBtn = createButton({
    label: "Submit Quote",
    variant: "primary",
    onClick: async () => {
      const quote = {
        leadId: lead.id,
        price: Number(priceInput.value || lead.analysis.estimateLow),
        timeline: timelineInput.value || "2 weeks",
        warranty: warrantyInput.value || "25 years"
      };

      console.log("Submitting quote:", quote);

      alert("Quote submitted!");
    }
  });

  container.append(title, form, submitBtn);
  root.appendChild(container);
}

/* ---------------------------------------------
   Helper metric row
--------------------------------------------- */

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
