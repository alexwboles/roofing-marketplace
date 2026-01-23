import { navigateTo } from "../router.js";

export function renderHomeView(root) {
  root.innerHTML = `
    <section class="hero">
      <div class="hero-card">
        <div class="hero-pill">
          <span class="hero-pill-dot"></span>
          AI + Satellite Roof Report in Minutes
        </div>

        <h1 class="hero-title">
          See your roof like a pro—before you call one.
        </h1>

        <p class="hero-subtitle">
          Upload photos, add a few details, and get a roofer-ready report powered by AI and satellite imagery.
        </p>

        <div class="hero-cta-row">
          <button class="btn-primary" id="home-start-btn">Start My Roof Report</button>
          <button class="btn-secondary" id="home-roofer-btn">I’m a Roofer</button>
        </div>
      </div>

      <div class="hero-visual">
        <div class="hero-visual-badge">Live sample</div>
        <div class="hero-visual-card">
          <div class="hero-visual-row">
            <div>
              <div class="hero-visual-title">Roof Health Score</div>
              <div class="hero-visual-sub">123 Maple St</div>
            </div>
            <div class="hero-visual-score">87</div>
          </div>
          <div class="hero-visual-sub">
            Moderate wear, localized shingle damage on south-facing slope. Estimated 18 years old, medium complexity.
          </div>
        </div>
      </div>
    </section>
  `;

  document.getElementById("home-start-btn").addEventListener("click", () => {
    navigateTo("intake");
  });

  document.getElementById("home-roofer-btn").addEventListener("click", () => {
    navigateTo("rooferDashboard");
  });
}
