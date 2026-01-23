import { navigateTo } from "../router.js";

export function renderHomeView(root) {
  root.innerHTML = `
    <section class="hero">
      <div class="hero-card">
        <div class="hero-pill">
          <span class="hero-pill-dot"></span>
          AI Roof Report in Minutes
        </div>
        <h1 class="hero-title">
          See your roof like a pro—<br />before you call one.
        </h1>
        <p class="hero-subtitle">
          Upload a few photos, and we’ll generate a roofer-ready report with materials, damage findings, and next steps.
        </p>
        <div class="hero-cta-row">
          <button class="btn-primary" id="home-start-btn">
            Start My Roof Report
          </button>
          <button class="btn-secondary" id="home-roofer-btn">
            I’m a Roofer
          </button>
        </div>
        <div class="hero-meta">
          <div class="hero-meta-item">
            <span class="hero-meta-label">Turnaround</span>
            <span class="hero-meta-value">Under 5 minutes</span>
          </div>
          <div class="hero-meta-item">
            <span class="hero-meta-label">Output</span>
            <span class="hero-meta-value">Roofer-ready PDF & checklist</span>
          </div>
          <div class="hero-meta-item">
            <span class="hero-meta-label">Works with</span>
            <span class="hero-meta-value">Asphalt, metal, tile & more</span>
          </div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-visual-badge">
          <span>Live sample</span>
        </div>
        <div class="hero-visual-card">
          <div class="hero-visual-row">
            <div>
              <div class="hero-visual-title">Roof Health Score</div>
              <div class="hero-visual-sub">123 Maple St, St. Augustine</div>
            </div>
            <div class="hero-visual-score">87</div>
          </div>
          <div class="hero-visual-sub">
            Moderate wear, localized shingle damage on south-facing slope. Recommend inspection within 30 days.
          </div>
          <div class="hero-visual-tags">
            <span class="hero-tag">Asphalt shingles</span>
            <span class="hero-tag">2-story</span>
            <span class="hero-tag">Hail exposure</span>
          </div>
        </div>
        <div class="card">
          <div class="card-title">What you’ll get</div>
          <div class="card-body">
            A simple, roofer-ready report with materials, damage notes, and photos—so you can compare bids with confidence.
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <h2 class="section-title">How it works</h2>
      <p class="section-subtitle">
        We turn a few photos into a clear, roofer-ready report.
      </p>
      <div class="grid-3">
        <div class="card">
          <div class="card-title">1. Tell us about your roof</div>
          <div class="card-body">
            Enter your address and a few quick details so we can understand your roof type and context.
          </div>
        </div>
        <div class="card">
          <div class="card-title">2. Upload photos</div>
          <div class="card-body">
            Add photos from the ground, a ladder, or a drone. We’ll analyze slopes, edges, and visible damage.
          </div>
        </div>
        <div class="card">
          <div class="card-title">3. Get a roofer-ready report</div>
          <div class="card-body">
            We generate a clear summary, materials list, and notes you can share directly with roofers.
          </div>
        </div>
      </div>
    </section>
  `;

  document.getElementById("home-start-btn")?.addEventListener("click", () => {
    navigateTo("intake");
  });

  document.getElementById("home-roofer-btn")?.addEventListener("click", () => {
    navigateTo("rooferDashboard");
  });
}
