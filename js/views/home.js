// js/views/home.js
// LendingTree-style hero landing page for Roofing Marketplace

import { createButton } from "../uiComponents.js";
import { navigate } from "../router.js";

export async function renderHomeView({ root }) {
  root.innerHTML = "";

  const hero = document.createElement("section");
  hero.className = "hero";

  // LEFT: Text + CTA
  const card = document.createElement("div");
  card.className = "hero-card";

  const pill = document.createElement("div");
  pill.className = "hero-pill";
  pill.innerHTML = `<span class="hero-pill-dot"></span> AI‑Powered Roof Analysis`;

  const title = document.createElement("h1");
  title.className = "hero-title";
  title.textContent = "When roofers compete, homeowners win.";

  const subtitle = document.createElement("p");
  subtitle.className = "hero-subtitle";
  subtitle.textContent =
    "Get instant AI roof measurements, condition scoring, and competing quotes from vetted local roofers — all in minutes.";

  const ctaRow = document.createElement("div");
  ctaRow.className = "hero-cta-row";

  const cta1 = createButton({
    label: "Get My Free Roof Report",
    variant: "primary",
    onClick: () => navigate("/intake")
  });

  const cta2 = createButton({
    label: "How It Works",
    variant: "secondary",
    onClick: () => navigate("/intake")
  });

  ctaRow.append(cta1, cta2);
  card.append(pill, title, subtitle, ctaRow);

  // RIGHT: Visual card
  const visual = document.createElement("div");
  visual.className = "hero-visual";

  const badge = document.createElement("div");
  badge.className = "hero-visual-badge";
  badge.textContent = "AI Roof Scan";

  const vCard = document.createElement("div");
  vCard.className = "hero-visual-card";

  const row1 = document.createElement("div");
  row1.className = "hero-visual-row";
  row1.innerHTML = `
    <span class="hero-visual-title">Estimated Roof Area</span>
    <strong class="hero-visual-score">2,450 sq ft</strong>
  `;

  const row2 = document.createElement("div");
  row2.className = "hero-visual-row";
  row2.innerHTML = `
    <span class="hero-visual-sub">Pitch: 6/12 • Complexity: Gable</span>
  `;

  vCard.append(row1, row2);
  visual.append(badge, vCard);

  hero.append(card, visual);
  root.appendChild(hero);
}

export const renderView = renderHomeView;
