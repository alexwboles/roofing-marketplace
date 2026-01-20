/* =========================================================
   Roofing Marketplace SPA
   - Clean SaaS + Light/Dark Adaptive Theme
   - All pages: Home, Features, Lookup, Intake, Health,
     Quotes, Login, Dashboard, Leaderboard, Billing,
     Admin, Insights
========================================================= */

/* -------------------------------
   THEME TOGGLE
--------------------------------*/

const THEME_KEY = "roofing_theme";

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");
  applyTheme(theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  applyTheme(current === "light" ? "dark" : "light");
}

/* -------------------------------
   ROUTER
--------------------------------*/

const routes = {
  "/home": renderHome,
  "/features": renderFeatures,
  "/lookup": renderHomeLookup,
  "/intake": renderIntake,
  "/health": renderRoofHealth,
  "/quotes": renderQuotes,
  "/login": renderLogin,
  "/dashboard": renderDashboard,
  "/leaderboard": renderLeaderboard,
  "/billing": renderBilling,
  "/admin": renderAdmin,
  "/insights": renderInsights,
};

function getRoute() {
  const hash = window.location.hash || "#/home";
  const path = hash.replace("#", "");
  return routes[path] ? path : "/home";
}

function navigate(path) {
  window.location.hash = path;
}

function mount(content) {
  const app = document.getElementById("app");
  if (!app) return;
  app.innerHTML = `
    <div class="app-shell">
      ${renderTopNav()}
      <div class="app-body">
        ${content}
      </div>
    </div>
  `;
}

/* -------------------------------
   TOP NAVIGATION
--------------------------------*/

function renderTopNav() {
  const current = getRoute();
  const theme = document.documentElement.getAttribute("data-theme") || "light";

  const link = (path, label) => `
    <a href="#${path}" class="nav-link ${current === path ? "nav-link-active" : ""}">
      ${label}
    </a>
  `;

  return `
    <header class="topbar">
      <div class="topbar-left">
        <a href="#/home" class="logo">Roofing Marketplace</a>
        <nav class="nav-links">
          ${link("/home", "Home")}
          ${link("/features", "Features")}
          ${link("/lookup", "Home Lookup")}
          ${link("/intake", "Upload Photos")}
          ${link("/health", "Roof Health")}
          ${link("/quotes", "Quotes")}
        </nav>
      </div>
      <div class="topbar-right">
        <nav class="nav-links">
          ${link("/dashboard", "Dashboard")}
          ${link("/login", "Roofer Login")}
        </nav>
        <button class="theme-toggle" onclick="toggleTheme()">
          ${theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </header>
  `;
}

/* -------------------------------
   HOME PAGE
--------------------------------*/

function renderHome() {
  mount(`
    <section class="hero fade-in-up">
      <img
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
        class="hero-img"
        loading="lazy"
        alt="Modern home roof"
      />
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>AI‑Powered Roof Health & Contractor Quotes</h1>
        <p>Instant roof scoring, satellite outlines, and verified contractor quotes — all in one clean dashboard.</p>
        <div class="hero-actions">
          <a href="#/lookup" class="btn-primary">Look Up My Home</a>
          <a href="#/intake" class="btn-secondary">Upload Roof Photos</a>
        </div>
        <div class="hero-meta">
          <span>⚡ Results in under 60 seconds</span>
          <span>✅ No sales pressure</span>
          <span>🔒 Your data stays private</span>
        </div>
      </div>
    </section>

    <section class="features-grid fade-in-up">
      <article class="feature-card">
        <img
          src="https://images.unsplash.com/photo-1597004891283-5e4c2c8e85b2?auto=format&fit=crop&w=900&q=80"
          class="feature-img"
          alt="Roofing materials"
        />
        <h3>Smart Material Recognition</h3>
        <p>AI identifies shingles, tiles, metal, and more with high accuracy, so estimates start from reality.</p>
      </article>

      <article class="feature-card">
        <img
          src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80"
          class="feature-img"
          alt="Roof inspection"
        />
        <h3>Damage Detection</h3>
        <p>Detect hail, wind, and age‑related wear from photos and satellite imagery — no ladder required.</p>
      </article>

      <article class="feature-card">
        <img
          src="https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=900&q=80"
          class="feature-img"
          alt="Contractor meeting"
        />
        <h3>Verified Contractors</h3>
        <p>Homeowners see clear options. Contractors get pre‑qualified leads with expectations already set.</p>
      </article>
    </section>
  `);
}

/* -------------------------------
   FEATURES PAGE
--------------------------------*/

function renderFeatures() {
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Platform Features</h1>
        <p>Everything you need to move from “I think” to “I know” about a roof.</p>
      </header>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">For Homeowners</h3>
            <p class="card-subtitle">Clarity without the sales pitch.</p>
          </div>
          <ul class="feature-list">
            <li><strong>Home lookup:</strong> Pull roof and property details from your address.</li>
            <li><strong>Satellite outline:</strong> See your roof shape and estimated area.</li>
            <li><strong>Roof health score:</strong> 0–100 score with plain‑language explanation.</li>
            <li><strong>Damage detection:</strong> Hail, wind, aging, missing shingles, and more.</li>
            <li><strong>Repair vs replace:</strong> Clear recommendation based on condition and lifespan.</li>
            <li><strong>Cost ranges:</strong> Localized estimates for repair or replacement.</li>
            <li><strong>Multiple quotes:</strong> Compare verified contractors side‑by‑side.</li>
          </ul>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">For Contractors</h3>
            <p class="card-subtitle">Spend time on roofs, not spreadsheets.</p>
          </div>
          <ul class="feature-list">
            <li><strong>Pre‑qualified leads:</strong> Homeowners arrive with a report and budget expectations.</li>
            <li><strong>AI takeoffs:</strong> Estimated roof area, pitch, and material type.</li>
            <li><strong>Materials list:</strong> Bundles, underlayment, flashing, vents, and labor hours.</li>
            <li><strong>Quote workspace:</strong> Start from AI ranges, then finalize your price.</li>
            <li><strong>Dashboard:</strong> Leads, bids, close rates, and performance insights.</li>
            <li><strong>Billing:</strong> Simple subscription with clear ROI.</li>
          </ul>
        </div>
      </div>
    </section>
  `);
}

/* -------------------------------
   HOME LOOKUP PAGE
--------------------------------*/

function renderHomeLookup() {
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Home Lookup</h1>
        <p>Start with an address. We’ll do the rest.</p>
      </header>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Property Address</h3>
          <p class="card-subtitle">We’ll pull roof details and satellite imagery where available.</p>
        </div>
        <div class="form-field">
          <label for="lookup-address">Address</label>
          <input id="lookup-address" type="text" placeholder="123 Main St, City, State" />
        </div>
        <div class="form-actions">
          <button id="lookup-btn" class="btn-primary">Search</button>
        </div>
      </div>

      <div id="lookup-results" class="card" style="display:none;"></div>
    </section>
  `);

  const btn = document.getElementById("lookup-btn");
  const resultsBox = document.getElementById("lookup-results");

  btn.onclick = async () => {
    const address = document.getElementById("lookup-address").value.trim();
    if (!address) {
      alert("Please enter an address");
      return;
    }

    resultsBox.style.display = "block";
    resultsBox.innerHTML = `<p>Searching property records...</p>`;

    try {
      const res = await fetch("/functions/home-lookup", {
        method: "POST",
        body: JSON.stringify({ address }),
      });
      const data = res.ok ? await res.json() : {};

      const outlineRes = await fetch("/functions/roof-outline", {
        method: "POST",
        body: JSON.stringify({ address }),
      });
      const outline = outlineRes.ok ? await outlineRes.json() : null;

      resultsBox.innerHTML = `
        <div class="card-header">
          <h3 class="card-title">Property Details</h3>
        </div>
        <ul class="detail-list">
          <li><strong>Roof Area:</strong> ${data.roofArea || "—"} sq ft</li>
          <li><strong>Pitch:</strong> ${data.pitch || "—"}</li>
          <li><strong>Material:</strong> ${data.material || "—"}</li>
          <li><strong>Year Built:</strong> ${data.yearBuilt || "—"}</li>
          <li><strong>Roof Age:</strong> ${data.roofAge || "—"} years</li>
        </ul>

        ${
          outline
            ? `
          <div class="card-header" style="margin-top:16px;">
            <h3 class="card-title">Satellite Roof Outline</h3>
          </div>
          <img src="${outline.imageUrl}" class="satellite-img" alt="Satellite roof" />
          <ul class="detail-list">
            <li><strong>Detected Area:</strong> ${outline.areaSqFt || "—"} sq ft</li>
            <li><strong>Pitch Estimate:</strong> ${outline.pitch || "—"}</li>
            <li><strong>Complexity:</strong> ${outline.complexity || "—"}</li>
          </ul>
        `
            : `<p style="margin-top:12px;">No satellite outline available for this address.</p>`
        }

        <div class="form-actions" style="margin-top:16px;">
          <a href="#/intake" class="btn-primary">Continue to Photo Upload</a>
        </div>
      `;
    } catch (err) {
      console.error(err);
      resultsBox.innerHTML = `
        <p>We couldn’t look up that address. Please try again or continue to photo upload.</p>
        <div class="form-actions" style="margin-top:12px;">
          <a href="#/intake" class="btn-primary">Go to Photo Upload</a>
        </div>
      `;
    }
  };
}

/* -------------------------------
   INTAKE PAGE
--------------------------------*/

function renderIntake() {
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Upload Roof Photos</h1>
        <p>Upload up to 5 clear roof photos for AI analysis.</p>
      </header>

      <form id="intake-form" class="card">
        <div class="card-header">
          <h3 class="card-title">Roof Photos</h3>
          <p class="card-subtitle">Include different angles and slopes for best results.</p>
        </div>
        <div class="form-field">
          <label for="photos">Photos</label>
          <input id="photos" type="file" accept="image/*" multiple />
        </div>
        <div class="form-actions">
          <button class="btn-primary">Run AI Analysis</button>
        </div>
      </form>
    </section>
  `);

  const form = document.getElementById("intake-form");
  form.onsubmit = async (e) => {
    e.preventDefault();

    const files = document.getElementById("photos").files;
    if (!files || files.length === 0) {
      alert("Please upload at least one photo.");
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length && i < 5; i++) {
      formData.append("photos", files[i]);
    }

    try {
      const res = await fetch("/functions/analyze-multiple-roof-photos", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("AI analysis failed");
      const data = await res.json();
      localStorage.setItem("roofAnalysis", JSON.stringify(data));
      navigate("/health");
    } catch (err) {
      console.error(err);
      alert("Unable to run AI analysis right now.");
    }
  };
}

/* -------------------------------
   ROOF HEALTH PAGE
--------------------------------*/

function renderRoofHealth() {
  const data = JSON.parse(localStorage.getItem("roofAnalysis") || "{}");
  const score = data.score ?? 72;
  const severity =
    score >= 85 ? "Excellent" :
    score >= 70 ? "Good" :
    score >= 50 ? "Fair" : "Poor";

  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Roof Health Score</h1>
        <p>AI‑generated assessment based on materials, age, and visible damage.</p>
      </header>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Overall Score</h3>
          </div>
          <div class="score-row">
            <div class="score-circle">${score}</div>
            <div>
              <div class="score-label">${severity}</div>
              <p class="card-subtitle">
                This score reflects estimated remaining life, visible damage, and risk of near‑term issues.
              </p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Roof Details</h3>
          </div>
          <ul class="detail-list">
            <li><strong>Material:</strong> ${data.material || "Asphalt Shingle"}</li>
            <li><strong>Pitch:</strong> ${data.pitch || "6/12"}</li>
            <li><strong>Roof Age:</strong> ${data.roofAge || "—"} years</li>
            <li><strong>Roof Area:</strong> ${data.roofArea || "—"} sq ft</li>
            <li><strong>Damage:</strong> ${data.damage || "—"}</li>
          </ul>
        </div>
      </div>

      <div id="materials"></div>

      <div class="page-actions">
        <a href="#/quotes" class="btn-primary">View Quotes</a>
        <a href="/functions/homeowner-report" class="btn-secondary">Download Homeowner Report</a>
      </div>
    </section>
  `);

  loadMaterials(data.roofArea || 2100);
}

async function loadMaterials(roofArea) {
  try {
    const res = await fetch("/functions/generate-materials-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roofArea }),
    });
    const m = res.ok ? await res.json() : null;
    if (!m) return;

    const container = document.getElementById("materials");
    if (!container) return;

    container.innerHTML = `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Suggested Materials List</h3>
          <p class="card-subtitle">Use this as a starting point and adjust for code and manufacturer specs.</p>
        </div>
        <ul class="detail-list">
          <li><strong>Shingle Bundles:</strong> ${m.bundles}</li>
          <li><strong>Underlayment Rolls:</strong> ${m.underlaymentRolls}</li>
          <li><strong>Drip Edge:</strong> ${m.dripEdgeFt} ft</li>
          <li><strong>Roof Vents:</strong> ${m.vents}</li>
        </ul>
        <p class="card-subtitle">
          ${m.notes || "Quantities are estimates. Confirm on site before ordering."}
        </p>
      </div>
    `;
  } catch (err) {
    console.error(err);
  }
}

/* -------------------------------
   QUOTES PAGE (MOCK)
--------------------------------*/

function renderQuotes() {
  const mockQuotes = [
    {
      contractor: "Sunrise Roofing Co.",
      price: "$12,400",
      timeline: "2–3 days",
      rating: "4.8",
      notes: "Includes tear‑off, disposal, and upgraded underlayment.",
    },
    {
      contractor: "Atlantic Coast Exteriors",
      price: "$11,900",
      timeline: "3–4 days",
      rating: "4.6",
      notes: "Standard architectural shingles, 10‑year workmanship warranty.",
    },
    {
      contractor: "Premier Peak Roofing",
      price: "$13,200",
      timeline: "2 days",
      rating: "4.9",
      notes: "Premium shingles, ridge vent upgrade, and extended warranty.",
    },
  ];

  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>AI‑Generated Quotes</h1>
        <p>These sample quotes show how contractors will see and respond to your roof report.</p>
      </header>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Quote Comparison</h3>
        </div>
        <div class="quotes-grid">
          ${mockQuotes
            .map(
              (q) => `
            <article class="quote-card">
              <h3>${q.contractor}</h3>
              <p class="quote-price">${q.price}</p>
              <p><strong>Timeline:</strong> ${q.timeline}</p>
              <p><strong>Rating:</strong> ⭐ ${q.rating}</p>
              <p class="card-subtitle">${q.notes}</p>
              <button class="btn-secondary" disabled>Request This Quote (demo)</button>
            </article>
          `
            )
            .join("")}
        </div>
      </div>
    </section>
  `);
}

/* -------------------------------
   LOGIN PAGE
--------------------------------*/

function renderLogin() {
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Roofer Login</h1>
        <p>Access your leads, quotes, and performance insights.</p>
      </header>

      <div class="grid-2">
        <form id="login-form" class="card">
          <div class="card-header">
            <h3 class="card-title">Magic Link Login</h3>
            <p class="card-subtitle">No passwords. We’ll email you a secure link.</p>
          </div>
          <div class="form-field">
            <label for="login-email">Work Email</label>
            <input id="login-email" type="email" placeholder="you@roofingcompany.com" />
          </div>
          <div class="form-actions">
            <button class="btn-primary">Send Login Link</button>
          </div>
        </form>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Why magic links?</h3>
          </div>
          <p class="card-subtitle">
            Crews move fast. Passwords slow them down. Magic links keep your account secure without the friction.
          </p>
          <ul class="detail-list">
            <li>✅ No passwords to remember</li>
            <li>✅ Works from phone or desktop</li>
            <li>✅ Easy to roll out to your team</li>
          </ul>
        </div>
      </div>
    </section>
  `);

  const form = document.getElementById("login-form");
  form.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    if (!email) {
      alert("Enter your email");
      return;
    }

    try {
      await fetch("/functions/request-login-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      alert("Demo login: redirecting to dashboard.");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Unable to send login link right now.");
    }
  };
}

/* -------------------------------
   DASHBOARD (MOCK)
--------------------------------*/

function renderDashboard() {
  const mockLeads = [
    { name: "123 Oak St", status: "New", value: "$12,400" },
    { name: "45 Pine Ave", status: "Quoted", value: "$9,800" },
    { name: "78 Maple Dr", status: "Won", value: "$14,200" },
  ];

  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Contractor Dashboard</h1>
        <p>At‑a‑glance view of your pipeline and performance.</p>
      </header>

      <div class="grid-3">
        <div class="card stat-card">
          <h3>Total Leads</h3>
          <p class="stat-value">32</p>
          <p class="stat-sub">+8 this week</p>
        </div>
        <div class="card stat-card">
          <h3>Close Rate</h3>
          <p class="stat-value">41%</p>
          <p class="stat-sub">+6% vs last month</p>
        </div>
        <div class="card stat-card">
          <h3>Avg. Job Size</h3>
          <p class="stat-value">$11,900</p>
          <p class="stat-sub">Based on last 10 wins</p>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Recent Leads</h3>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Status</th>
              <th>Est. Value</th>
            </tr>
          </thead>
          <tbody>
            ${mockLeads
              .map(
                (l) => `
              <tr>
                <td>${l.name}</td>
                <td>${l.status}</td>
                <td>${l.value}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>
  `);
}

/* -------------------------------
   LEADERBOARD (MOCK)
--------------------------------*/

function renderLeaderboard() {
  const mockRows = [
    { name: "Sunrise Roofing Co.", jobs: 24, revenue: "$285k" },
    { name: "Atlantic Coast Exteriors", jobs: 18, revenue: "$214k" },
    { name: "Premier Peak Roofing", jobs: 15, revenue: "$198k" },
  ];

  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Leaderboard</h1>
        <p>See how you stack up against other contractors in your market.</p>
      </header>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Top Performers (Demo Data)</h3>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Contractor</th>
              <th>Jobs Won</th>
              <th>Est. Revenue</th>
            </tr>
          </thead>
          <tbody>
            ${mockRows
              .map(
                (r) => `
              <tr>
                <td>${r.name}</td>
                <td>${r.jobs}</td>
                <td>${r.revenue}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>
  `);
}

/* -------------------------------
   BILLING (MOCK)
--------------------------------*/

function renderBilling() {
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Billing</h1>
        <p>Simple, transparent pricing for your team.</p>
      </header>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Current Plan</h3>
          </div>
          <p class="stat-value" style="margin-top:8px;">Pro</p>
          <p class="card-subtitle">$199 / month · up to 10 users</p>
          <ul class="detail-list">
            <li>Unlimited roof reports</li>
            <li>Priority support</li>
            <li>Lead routing & insights</li>
          </ul>
          <button class="btn-secondary" disabled>Manage Subscription (demo)</button>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Invoices</h3>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Jan 1, 2026</td><td>$199</td><td>Paid</td></tr>
              <tr><td>Dec 1, 2025</td><td>$199</td><td>Paid</td></tr>
              <tr><td>Nov 1, 2025</td><td>$199</td><td>Paid</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `);
}

/* -------------------------------
   ADMIN (MOCK)
--------------------------------*/

function renderAdmin() {
  const mockContractors = [
    { name: "Sunrise Roofing Co.", status: "Approved" },
    { name: "Atlantic Coast Exteriors", status: "Pending" },
    { name: "Premier Peak Roofing", status: "Approved" },
  ];

  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Admin Console</h1>
        <p>Oversee contractor approvals and marketplace health.</p>
      </header>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Contractor Approvals</h3>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${mockContractors
                .map(
                  (c) => `
                <tr>
                  <td>${c.name}</td>
                  <td>${c.status}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Marketplace Snapshot</h3>
          </div>
          <ul class="detail-list">
            <li><strong>Active Contractors:</strong> 42</li>
            <li><strong>Markets:</strong> 7 metro areas</li>
            <li><strong>Avg. Response Time:</strong> 2.3 hours</li>
            <li><strong>Avg. Close Rate:</strong> 38%</li>
          </ul>
        </div>
      </div>
    </section>
  `);
}

/* -------------------------------
   INSIGHTS (MOCK)
--------------------------------*/

function renderInsights() {
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>AI Insights</h1>
        <p>High‑level patterns from your recent quotes and wins.</p>
      </header>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Win Patterns</h3>
          </div>
          <ul class="detail-list">
            <li>You win most often when you respond within <strong>3 hours</strong>.</li>
            <li>Jobs between <strong>$10k–$14k</strong> have your highest close rate.</li>
            <li>Homeowners respond well to <strong>lifetime workmanship warranties</strong>.</li>
          </ul>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Suggested Experiments</h3>
          </div>
          <ul class="detail-list">
            <li>Test a “good / better / best” quote layout.</li>
            <li>Follow up once at 24 hours and once at 72 hours.</li>
            <li>Highlight financing options earlier in the conversation.</li>
          </ul>
        </div>
      </div>
    </section>
  `);
}

/* -------------------------------
   ROUTER BOOTSTRAP
--------------------------------*/

function handleRoute() {
  const path = getRoute();
  const view = routes[path];
  if (typeof view === "function") {
    view();
  }
}

window.addEventListener("hashchange", handleRoute);
window.addEventListener("load", () => {
  initTheme();
  handleRoute();
});
