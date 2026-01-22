// js/views/homeView.js

import { navigate } from "../app.js";

export function renderHomeView() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <section class="hero">
      <div class="hero-copy">
        <div class="hero-kicker">
          <span>AI‑powered</span> roof analysis
        </div>

        <h1 class="hero-title">
          Get competing roof quotes.<br/>
          <span>AI analyzes your roof instantly.</span>
        </h1>

        <p class="hero-subtitle">
          Upload photos or enter your address. Roofers compete for your business.
          No spam. No pressure. Just real quotes.
        </p>

        <div class="hero-metrics">
          <div class="hero-metric">
            <strong>3–5 bids</strong>
            <span>Average per project</span>
          </div>
          <div class="hero-metric">
            <strong>AI geometry</strong>
            <span>SqFt · pitch · facets</span>
          </div>
          <div class="hero-metric">
            <strong>Roof health</strong>
            <span>Hail · age · damage</span>
          </div>
        </div>

        <div class="hero-actions">
          <button class="btn-primary" data-route="/intake">
            Get started
          </button>
          <button class="btn-secondary" data-route="/roofer">
            Roofer dashboard
          </button>
        </div>
      </div>

      <div class="hero-image">
        <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
             alt="Modern home roof">
      </div>
    </section>
  `;

  // Enable SPA navigation for CTA buttons
  document.querySelectorAll("[data-route]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      navigate(btn.getAttribute("data-route"));
    });
  });
}
