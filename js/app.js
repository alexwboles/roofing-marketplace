/* ============================================================
   GLOBAL AI PHOTO STORE
============================================================ */

const AIPhotoStore = {
  files: [],
  set(files) {
    this.files = [...files];
  },
  get() {
    return this.files;
  }
};

/* ============================================================
   THEME
============================================================ */

function initTheme() {
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");
  root.setAttribute("data-theme", saved || "light");
}

function toggleTheme() {
  const root = document.documentElement;
  const current = root.getAttribute("data-theme");
  const next = current === "light" ? "dark" : "light";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
}

/* ============================================================
   ROUTER
============================================================ */

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
  "/contractor-dashboard": renderContractorDashboard,
  "/contractor-login": renderContractorLogin,
  "/projects": renderProjects,
  "/payments": renderPayments,
  "/upload": renderUpload,
  "/admin-dashboard": renderAdminDashboard
};

function getRoute() {
  const hash = window.location.hash || "#/home";
  return hash.replace("#", "") || "/home";
}

function navigate(path) {
  window.location.hash = "#" + path;
}

function mount(html) {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="app-shell">
      ${renderTopbar()}
      ${html}
    </div>
  `;
  wireTopbar();
}

/* ============================================================
   TOP BAR (Option A — Minimal + Hamburger Menu)
============================================================ */

function renderTopbar() {
  return `
    <header class="topbar">
      <div class="topbar-left">
        <div class="logo">Roofing Marketplace</div>
      </div>

      <div class="topbar-right">
        <button class="theme-toggle" id="theme-toggle">🌓</button>
        <button class="menu-toggle" id="menu-toggle">☰</button>
      </div>

      <nav class="menu-panel" id="menu-panel">
        <button data-nav="/home">Home</button>
        <button data-nav="/features">Features</button>
        <button data-nav="/lookup">Home Lookup</button>
        <button data-nav="/intake">Intake</button>
        <button data-nav="/health">Roof Health</button>
        <button data-nav="/quotes">Quotes</button>
        <button data-nav="/dashboard">Dashboard</button>
        <button data-nav="/projects">Projects</button>
        <button data-nav="/payments">Payments</button>
        <button data-nav="/contractor-login">Contractor Login</button>
        <button data-nav="/contractor-dashboard">Contractor Dashboard</button>
        <button data-nav="/admin-dashboard">Admin</button>
        <button data-nav="/insights">Insights</button>
      </nav>
    </header>
  `;
}

function wireTopbar() {
  document.querySelectorAll("[data-nav]").forEach(btn => {
    btn.onclick = () => navigate(btn.getAttribute("data-nav"));
  });

  document.getElementById("theme-toggle").onclick = toggleTheme;

  const menuToggle = document.getElementById("menu-toggle");
  const menuPanel = document.getElementById("menu-panel");

  menuToggle.onclick = () => {
    menuPanel.classList.toggle("open");
  };
}

/* ============================================================
   HOME PAGE (with AI photo linking)
============================================================ */

function renderHome() {
  mount(`
    <section class="page-container fade-in-up">
      <div class="hero">
        <img class="hero-img" src="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg" />
        <div class="hero-overlay"></div>

        <div class="hero-content">
          <h1>AI-powered roof analysis for every home.</h1>
          <p>Instant roof health insights, contractor-ready reports, and smarter quotes.</p>

          <div class="hero-actions">
            <button class="btn-primary" onclick="navigate('/lookup')">Run a home lookup</button>
            <button class="btn-secondary" onclick="navigate('/features')">Explore features</button>

            <label class="btn-primary" style="cursor:pointer;">
              Upload Photos
              <input id="home-upload" type="file" accept="image/*" multiple style="display:none;">
            </label>
          </div>
        </div>
      </div>
    </section>
  `);

  const input = document.getElementById("home-upload");

  input.onchange = () => {
    AIPhotoStore.set(input.files);
    navigate("/health");
  };
}

/* ============================================================
   FEATURES
============================================================ */

function renderFeatures() {
  mount(`
    <section class="page-container fade-in-up">
      <h1>Features</h1>
      <p>Everything you need to turn roof data into decisions.</p>
    </section>
  `);
}

/* ============================================================
   HOME LOOKUP
============================================================ */

function renderHomeLookup() {
  mount(`
    <section class="page-container fade-in-up">
      <h1>Home Lookup</h1>

      <form id="lookup-form" class="card">
        <div class="form-field">
          <label>Address</label>
          <input id="lookup-address" type="text">
        </div>
        <button class="btn-primary">Run Lookup</button>
      </form>

      <div class="card" style="margin-top:20px;">
        <h3>Lookup Result</h3>
        <ul id="lookup-result" class="detail-list"><li>—</li></ul>
      </div>
    </section>
  `);

  const form = document.getElementById("lookup-form");
  const result = document.getElementById("lookup-result");

  form.onsubmit = e => {
    e.preventDefault();
    const addr = document.getElementById("lookup-address").value.trim();
    if (!addr) return alert("Enter an address");

    result.innerHTML = `
      <li><strong>Address:</strong> ${addr}</li>
      <li><strong>Roof Type:</strong> Architectural Shingle</li>
      <li><strong>Age:</strong> 14 years</li>
      <li><strong>Risk Score:</strong> 72 / 100</li>
    `;
  };
}

/* ============================================================
   INTAKE (with AI photo linking)
============================================================ */

function renderIntake() {
  mount(`
    <section class="page-container fade-in-up">
      <h1>Intake</h1>
      <p>Collect homeowner details and roof photos.</p>

      <div class="grid-2">
        <form id="intake-form" class="card">
          <div class="form-field">
            <label>Name</label>
            <input id="intake-name" type="text">
          </div>

          <div class="form-field">
            <label>Email</label>
            <input id="intake-email" type="email">
          </div>

          <div class="form-field">
            <label>Address</label>
            <input id="intake-address" type="text">
          </div>

          <div class="form-field">
            <label>Upload Roof Photos</label>
            <input id="intake-photos" type="file" accept="image/*" multiple>
          </div>

          <button class="btn-primary">Save Intake</button>
        </form>

        <div class="card">
          <h3>Next Steps</h3>
          <ul class="detail-list">
            <li>Run AI analysis on Roof Health page.</li>
            <li>Generate quotes on Quotes page.</li>
          </ul>
        </div>
      </div>
    </section>
  `);

  const input = document.getElementById("intake-photos");

  input.onchange = () => {
    AIPhotoStore.set(input.files);
    navigate("/health");
  };

  document.getElementById("intake-form").onsubmit = e => {
    e.preventDefault();
    alert("Intake saved (demo).");
  };
}

/* ============================================================
   ROOF HEALTH (AI photo analysis)
============================================================ */

function renderRoofHealth() {
  const files = AIPhotoStore.get();

  let previews = "";
  if (files.length) {
    previews = [...files]
      .map(file => {
        const url = URL.createObjectURL(file);
        return `
          <div class="card" style="padding:8px;">
            <img src="${url}" style="width:100%; border-radius:6px;">
          </div>
        `;
      })
      .join("");
  }

  mount(`
    <section class="page-container fade-in-up">
      <h1>Roof Health</h1>
      <p>AI-generated roof health summary based on uploaded photos.</p>

      <div class="grid-2">
        <div class="card">
          <h3>Uploaded Photos</h3>
          <div class="upload-grid">${previews || "<p>No photos uploaded yet.</p>"}</div>
        </div>

        <div class="card">
          <h3>AI Analysis</h3>
          <ul class="detail-list">
            <li><strong>Shingle Wear:</strong> Moderate granule loss</li>
            <li><strong>Flashing:</strong> Possible gaps around vents</li>
            <li><strong>Storm Damage:</strong> Hail impact patterns detected</li>
            <li><strong>Recommended Action:</strong> Replace within 12–18 months</li>
          </ul>
        </div>
      </div>
    </section>
  `);
}

/* ============================================================
   QUOTES
============================================================ */

function renderQuotes() {
  mount(`
    <section class="page-container fade-in-up">
      <h1>Quotes</h1>
      <div class="quotes-grid">
        <div class="quote-card"><h3>Premier Peak</h3><p>$14,200</p></div>
        <div class="quote-card"><h3>Sunrise Roofing</h3><p>$12,900</p></div>
        <div class="quote-card"><h3>Atlantic Coast</h3><p>$15,400</p></div>
      </div>
    </section>
  `);
}

/* ============================================================
   LOGIN
============================================================ */

function renderLogin() {
  mount(`
    <section class="page-container fade-in-up">
      <h1>Login</h1>
      <form id="login-form" class="card">
        <div class="form-field">
          <label>Email</label>
          <input id="login-email" type="email">
        </div>
        <button class="btn-primary">Send Login Link</button>
      </form>
    </section>
  `);

  document.getElementById("login-form").onsubmit = e => {
    e.preventDefault();
    navigate("/dashboard");
  };
}

/* ============================================================
   DASHBOARD
============================================================ */

function renderDashboard() {
  mount(`
    <section class="page-container fade-in-up">
      <h1>Dashboard</h1>
      <div class="grid-3">
        <div class="card stat-card"><h3>Reports</h3><p class="stat-value">3</p></div>
        <div class="card stat-card"><h3>Quotes</h3><p class="stat-value">2</p></div>
        <div class="card stat-card"><h3>Last Scan</h3><p class="stat-value">5 days ago</p></div>
      </div>
    </section>
  `);
}

/* ============================================================
   LEADERBOARD
============================================================ */

function renderLeaderboard() {
  mount(`
    <section class="page-container fade-in-up">
      <h1>Leaderboard</h1>
      <div class="card">
        <table class="table">
          <tr><th>Contractor</th><th>Jobs</th><th>Rating</th></tr>
          <tr><td>Premier Peak</td><td>128</td><td>4.9</td></tr>
          <tr><td>Sunrise Roofing</td><td>94</td><td>4.8</td></tr>
        </table>
      </div>
    </section>
  `);
}

/* ============================================================
   BILLING
============================================================ */

function renderBilling() {
  mount(`
    <section class="page-container fade-in-up">
      <h1>Billing</h1>
      <div class="card">
        <ul class="detail-list">
          <li>Plan: Pro</li>
          <li>Price: $149/mo</li>
        </ul>
      </div>
    </section>
  `);
}

/* ============================================================
   ADMIN
============================================================ */

function renderAdmin() {
  mount(`
    <section class="page-container fade-in-up">
      <h1>Admin Console</h1>
      <div class="card">
        <ul class="detail-list">
          <li>Feature Flags</li>
          <li>System Logs</li>
        </ul>
      </div>
    </section>
  `);
}

/* ============================================================
   INSIGHTS
============================================================ */

function renderInsights() {
  mount(`
    <section class="page-container fade-in-up">
      <h1>Insights</h1>
      <div class="grid-3">
        <div class="card stat-card"><h3>Avg Roof Age</h3><p class="stat-value">17 yrs</p></div>
        <div class="card stat-card"><h3>Replacement Rate</h3><p class="stat-value">38%</p></div>
        <div class="card stat-card"><h3>Quote Spread</h3><p class="stat-value">$3,200</p></div>
      </div>
    </section>
  `);
}

/* ============================================================
   CONTRACTOR DASHBOARD
============================================================ */

function renderContractorDashboard() {
  mount(`
    <section class="page-container fade-in-up">
      <h1>Contractor Dashboard</h1>
      <div class="grid-3">
        <div class="card stat-card"><h3>Active Jobs</h3><p class="stat-value">6</p></div>
        <div class="card stat-card"><h3>Pending Quotes</h3><p class="stat-value">4</p></div>
        <div class="card stat-card"><h3>Avg Job Value</h3><p class="stat-value">$12,300</p></div>
      </div>
    </section>
  `);
}

/* ============================================================
   CONTRACTOR LOGIN
============================================================ */

function renderContractorLogin() {
  mount(`
    <section class="page-container fade-in-up">
      <h1>Contractor Login</h1>
      <form id="contractor-login-form" class="card">
        <div class="form-field">
          <label>Email</label>
          <input id="contractor-login-email" type="email">
        </div>
        <button class="btn-primary">Send Login Link</button>
      </form>
    </section>
  `);

  document.getElementById("contractor-login-form").onsubmit = e => {
    e.preventDefault();
    navigate("/contractor-dashboard");
  };
}

/* ============================================================
   PROJECTS
============================================================ */

function renderProjects() {
  mount(`
    <section class="page-container fade-in-up">
      <h1>Projects</h1>
      <div class="grid-3">
        <div class="card stat-card"><h3>Active</h3><p class="stat-value">6</p></div>
        <div class="card stat-card"><h3>Scheduled</h3><p class="stat-value">4</p></div>
        <div class="card stat-card"><h3>Completed</h3><p class="stat-value">28</p></div>
      </div>
    </section>
  `);
}

/* ============================================================
   PAYMENTS
============================================================ */

function renderPayments() {
  mount(`
    <section class="page-container fade-in-up">
      <h1>Payments</h1>
      <div class="card">
        <ul class="detail-list">
          <li>Plan: Pro Contractor</li>
          <li>Price: $149/mo</li>
        </ul>
      </div>
    </section>
  `);
}

/* ============================================================
   UPLOAD PAGE (AI photo linking)
============================================================ */

function renderUpload() {
  mount(`
    <section class="page-container fade-in-up">
      <h1>Upload Photos</h1>

      <div class="card">
        <form id="upload-form">
          <div class="form-field">
            <label>Select Photos</label>
            <input id="upload-input" type="file" accept="image/*" multiple>
          </div>

          <button class="btn-primary" style="margin-top:16px;">Analyze Roof</button>
        </form>
      </div>
    </section>
  `);

  const input = document.getElementById("upload-input");

  input.onchange = () => {
    AIPhotoStore.set(input.files);
  };

  document.getElementById("upload-form").onsubmit = e => {
    e.preventDefault();
    if (!AIPhotoStore.get().length) {
      alert("Please upload at least one photo");
      return;
    }
    navigate("/health");
  };
}

/* ============================================================
   ADMIN DASHBOARD
============================================================ */

function renderAdminDashboard() {
  mount(`
    <section class="page-container fade-in-up">
      <h1>Admin Dashboard</h1>
      <div class="grid-3">
        <div class="card stat-card"><h3>Total Contractors</h3><p class="stat-value">142</p></div>
        <div class="card stat-card"><h3>Active Sessions</h3><p
