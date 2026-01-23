// js/views/quoteSubmission.js
// Roofer quote submission page with AI-prefilled values

import { createButton, createInputGroup, createCard } from "../uiComponents.js";
import { navigate } from "../router.js";

export async function renderQuoteSubmissionView({ root, params }) {
  root.innerHTML = "";

  const lead = params?.lead || getLeadFromSession();
  if (!lead) {
    root.innerHTML = "<h1>No lead selected.</h1>";
    return;
  }

  const container = document.createElement("section");
  container.className = "intake-wizard";

  const title = document.createElement("h1");
  title.textContent = `Submit Quote for ${lead.homeowner}`;

  const card = createCard({
    title: "AI Roof Data",
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
      )
    ]
  });

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
    onClick: () => submitQuote(lead, priceInput, timelineInput, warrantyInput)
  });

  container.append(title, card, form, submitBtn);
  root.appendChild(container);
}

/* ---------------------------------------------
   Helpers
--------------------------------------------- */

function getLeadFromSession() {
  const stored = sessionStorage.getItem("activeLead");
  return stored ? JSON.parse(stored) : null;
}

function submitQuote(lead, priceInput, timelineInput, warrantyInput) {
  const quote = {
    leadId: lead.id,
    roofer: "Your Roofing Company",
    price: Number(priceInput.value || lead.analysis.estimateLow),
    timeline: timelineInput.value || "2 weeks",
    warranty: warrantyInput.value || "25 years"
  };

  const existing = JSON.parse(sessionStorage.getItem("quotes") || "[]");
  existing.push(quote);
  sessionStorage.setItem("quotes", JSON.stringify(existing));

  alert("Quote submitted!");
  navigate("/quotes");
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

export const renderView = renderQuoteSubmissionView;
