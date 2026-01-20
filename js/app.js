// ---------- Theme ----------

function initTheme() {
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") {
    root.setAttribute("data-theme", saved);
  } else {
    root.setAttribute("data-theme", "light");
  }
}

function toggleTheme() {
  const root = document.documentElement;
  const current = root.getAttribute("data-theme") || "light";
  const next = current === "light" ? "dark" : "light";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
}

// ---------- Routing ----------

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
  const path = hash.replace("#", "");
  return path || "/home";
}

function navigate(path) {
  window.location.hash = "#" + path;
}

function mount(contentHtml) {
  const app = document.getElementById("app");
  app.innerHTML = `
    <div class="app-shell">
      ${renderTopbar()}
      ${contentHtml}
    </div>
  `;
  wireTopbar();
}

// ---------- Topbar ----------

function renderTopbar() {
  const route = getRoute();
  const links = [
    { path: "/home", label: "Home" },
    { path: "/features", label: "Features" },
    { path: "/lookup", label: "Home Lookup" },
    { path: "/intake", label: "Intake" },
    { path: "/health", label: "Roof Health" },
    { path: "/quotes", label: "Quotes" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/projects", label: "Projects" },
    { path: "/payments", label: "Payments" },
    { path: "/contractor-login", label: "Contractor Login" },
    { path: "/contractor-dashboard", label: "Contractor Dashboard" },
    { path: "/admin-dashboard", label: "Admin" },
    { path: "/insights", label: "Insights" }
  ];

  const navHtml = links
    .map(link => {
      const active = route === link.path ? "nav-link nav-link-active" : "nav-link";
      return `<button class="${active}" data-nav="${link.path}">${link.label}</button>`;
    })
    .join("");

  return `
    <header class="topbar">
      <div class="topbar-left">
        <div class="logo">Roofing Marketplace</div>
        <nav class="nav-links">
          ${navHtml}
        </nav>
      </div>
      <div class="topbar-right">
        <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">🌓</button>
      </div>
    </header>
  `;
}

function wireTopbar() {
  document.querySelectorAll("[data-nav]").forEach(btn => {
    btn.onclick = () => navigate(btn.getAttribute("data-nav"));
  });
  const toggle = document.getElementById("theme-toggle");
  if (toggle) toggle.onclick = toggleTheme;
}

// ---------- Pages ----------

function renderHome() {
  mount(`
    <section class="page-container fade-in-up">
      <div class="hero">
        <img class="hero-img" src="https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg" alt="Roofing" />
        <div class="hero-overlay"></div>
        <div class="hero-content">
          <h1>AI-powered roof analysis for every home.</h1>
          <p>Instant roof health insights, contractor-ready reports, and smarter quotes — all from satellite and photo uploads.</p>
          <div class="hero-actions">
            <button class="btn-primary" onclick="navigate('/lookup')">Run a home lookup</button>
            <button class="btn-secondary" onclick="navigate('/features')">Explore features</button>
          </div>
          <div class="hero-meta">
            <span>Built for roofers & insurers</span>
            <span>Satellite + photo AI</span>
            <span>Homeowner-friendly reports</span>
          </div>
        </div>
      </div>
    </section>
  `);
}

function renderFeatures() {
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Features</h1>
        <p>Everything you need to turn roof data into decisions.</p>
      </header>

      <div class="grid-3">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">AI Roof Scan</h3>
            <p class="card-subtitle">Detect damage, aging, and risk from satellite and photo uploads.</p>
          </div>
          <ul class="detail-list">
            <li><strong>Inputs:</strong> Satellite + photos</li>
            <li><strong>Outputs:</strong> Risk score, damage map</li>
            <li><strong>Use cases:</strong> Claims, inspections, sales</li>
          </ul>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Contractor Workflow</h3>
            <p class="card-subtitle">From lead intake to signed quote in one flow.</p>
          </div>
          <ul class="detail-list">
            <li><strong>Intake:</strong> Homeowner + property details</li>
            <li><strong>Analysis:</strong> AI roof health</li>
            <li><strong>Quotes:</strong> Side-by-side comparisons</li>
          </ul>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Homeowner Reports</h3>
            <p class="card-subtitle">Plain-language roof health reports homeowners actually understand.</p>
          </div>
          <ul class="detail-list">
            <li><strong>Summary:</strong> Roof health score</li>
            <li><strong>Findings:</strong> Damage, aging, risk</li>
            <li><strong>Next steps:</strong> Repair vs replace</li>
          </ul>
        </div>
      </div>
    </section>
  `);
}

function renderHomeLookup() {
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Home Lookup</h1>
        <p>Start with an address to pull roof geometry and risk signals.</p>
      </header>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Property Search</h3>
            <p class="card-subtitle">Enter an address to simulate a lookup.</p>
          </div>

          <form id="lookup-form">
            <div class="form-field">
              <label>Address</label>
              <input id="lookup-address" type="text" placeholder="123 Oak St, St Augustine, FL" />
            </div>
            <div class="form-actions">
              <button class="btn-primary">Run Lookup</button>
            </div>
          </form>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Lookup Result</h3>
            <p class="card-subtitle">Demo data for now.</p>
          </div>
          <ul class="detail-list" id="lookup-result">
            <li><strong>Roof Type:</strong> —</li>
            <li><strong>Stories:</strong> —</li>
            <li><strong>Estimated Age:</strong> —</li>
            <li><strong>Risk Score:</strong> —</li>
          </ul>
        </div>
      </div>
    </section>
  `);

  const form = document.getElementById("lookup-form");
  const result = document.getElementById("lookup-result");

  form.onsubmit = (e) => {
    e.preventDefault();
    const addr = document.getElementById("lookup-address").value.trim();
    if (!addr) {
      alert("Please enter an address");
      return;
    }
    result.innerHTML = `
      <li><strong>Address:</strong> ${addr}</li>
      <li><strong>Roof Type:</strong> Architectural Shingle</li>
      <li><strong>Stories:</strong> 2</li>
      <li><strong>Estimated Age:</strong> 14 years</li>
      <li><strong>Risk Score:</strong> 72 / 100</li>
    `;
  };
}

function renderIntake() {
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Intake</h1>
        <p>Collect homeowner details and notes.</p>
      </header>

      <div class="grid-2">
        <form id="intake-form" class="card">
          <div class="card-header">
            <h3 class="card-title">Homeowner Details</h3>
          </div>

          <div class="form-field">
            <label>Name</label>
            <input id="intake-name" type="text" placeholder="Jane Doe" />
          </div>
          <div class="form-field">
            <label>Email</label>
            <input id="intake-email" type="email" placeholder="jane@example.com" />
          </div>
          <div class="form-field">
            <label>Address</label>
            <input id="intake-address" type="text" placeholder="123 Oak St, St Augustine, FL" />
          </div>
          <div class="form-field">
            <label>Notes</label>
            <textarea id="intake-notes" placeholder="Hail storm last month, visible granule loss..."></textarea>
          </div>

          <div class="form-actions">
            <button class="btn-primary">Save Intake</button>
          </div>
        </form>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Next Steps</h3>
          </div>
          <ul class="detail-list">
            <li>Upload roof photos on the <strong>Upload</strong> page.</li>
            <li>Run AI analysis on the <strong>Roof Health</strong> page.</li>
            <li>Generate quotes on the <strong>Quotes</strong> page.</li>
          </ul>
        </div>
      </div>
    </section>
  `);

  const form = document.getElementById("intake-form");
  form.onsubmit = (e) => {
    e.preventDefault();
    alert("Intake saved (demo). Continue to Upload or Roof Health.");
  };
}

function renderRoofHealth() {
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Roof Health</h1>
        <p>AI-generated roof health summary based on uploaded photos.</p>
      </header>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Health Score</h3>
          </div>
          <div class="score-row">
            <div class="score-circle">68</div>
            <div>
              <div class="score-label">Moderate Risk</div>
              <p class="card-subtitle">Aging shingles, granule loss, and minor flashing issues detected.</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Key Findings</h3>
          </div>
          <ul class="detail-list">
            <li><strong>Shingle Wear:</strong> Moderate granule loss across south-facing slopes.</li>
            <li><strong>Flashing:</strong> Suspected gaps around chimney and vent stacks.</li>
            <li><strong>Storm Impact:</strong> Hail impact patterns consistent with recent storms.</li>
            <li><strong>Recommended Action:</strong> Full replacement within 12–18 months.</li>
          </ul>
        </div>
      </div>
    </section>
  `);
}

function renderQuotes() {
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Quotes</h1>
        <p>Compare contractor-ready quotes based on AI roof analysis.</p>
      </header>

      <div class="quotes-grid">
        <div class="quote-card">
          <h3>Premier Peak Roofing</h3>
          <p class="quote-price">$14,200</p>
          <p class="card-subtitle">Architectural shingles, full tear-off, 25-year warranty.</p>
        </div>
        <div class="quote-card">
          <h3>Sunrise Roofing Co.</h3>
          <p class="quote-price">$12,900</p>
          <p class="card-subtitle">Architectural shingles, overlay, 20-year warranty.</p>
        </div>
        <div class="quote-card">
          <h3>Atlantic Coast Exteriors</h3>
          <p class="quote-price">$15,400</p>
          <p class="card-subtitle">Metal roof upgrade, 35-year warranty.</p>
        </div>
      </div>
    </section>
  `);
}

function renderLogin() {
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Login</h1>
        <p>Access your reports and saved quotes.</p>
      </header>

      <div class="grid-2">
        <form id="login-form" class="card">
          <div class="card-header">
            <h3 class="card-title">Magic Link Login</h3>
            <p class="card-subtitle">Enter your email to receive a secure login link.</p>
          </div>

          <div class="form-field">
            <label>Email</label>
            <input id="login-email" type="email" placeholder="you@example.com" />
          </div>

          <div class="form-actions">
            <button class="btn-primary">Send Login Link</button>
          </div>
        </form>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Why Magic Links?</h3>
          </div>
          <ul class="detail-list">
            <li>No passwords to remember</li>
            <li>Fast and secure</li>
            <li>Works on any device</li>
          </ul>
        </div>
      </div>
    </section>
  `);

  const form = document.getElementById("login-form");
  form.onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    if (!email) {
      alert("Please enter your email");
      return;
    }
    alert("Demo login — redirecting to Dashboard.");
    navigate("/dashboard");
  };
}

function renderDashboard() {
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Dashboard</h1>
        <p>Your roof reports, quotes, and activity.</p>
      </header>

      <div class="grid-3">
        <div class="card stat-card">
          <h3>Reports</h3>
          <p class="stat-value">3</p>
          <p class="stat-sub">Roof health reports generated</p>
        </div>
        <div class="card stat-card">
          <h3>Quotes</h3>
          <p class="stat-value">2</p>
          <p class="stat-sub">Active contractor quotes</p>
        </div>
        <div class="card stat-card">
          <h3>Last Scan</h3>
          <p class="stat-value">5 days ago</p>
          <p class="stat-sub">Based on latest upload</p>
        </div>
      </div>
    </section>
  `);
}

function renderLeaderboard() {
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Leaderboard</h1>
        <p>Top-performing contractors on the platform.</p>
      </header>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Top Contractors</h3>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Contractor</th>
              <th>Jobs Completed</th>
              <th>Avg. Rating</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Premier Peak Roofing</td><td>128</td><td>4.9</td></tr>
            <tr><td>Sunrise Roofing Co.</td><td>94</td><td>4.8</td></tr>
            <tr><td>Atlantic Coast Exteriors</td><td>76</td><td>4.7</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  `);
}

function renderBilling() {
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Billing</h1>
        <p>Subscription and billing overview.</p>
      </header>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Plan</h3>
        </div>
        <ul class="detail-list">
          <li><strong>Plan:</strong> Pro</li>
          <li><strong>Price:</strong> $149 / month</li>
          <li><strong>Status:</strong> Active</li>
        </ul>
      </div>
    </section>
  `);
}

function renderAdmin() {
  mount(`
    <section class.page-container fade-in-up">
      <header class="page-header">
        <h1>Admin Console</h1>
        <p>Manage platform settings and configuration.</p>
      </header>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Controls</h3>
        </div>
        <ul class="detail-list">
          <li>Toggle AI providers (demo)</li>
          <li>Manage feature flags (demo)</li>
          <li>View system logs (demo)</li>
        </ul>
      </div>
    </section>
  `);
}

function renderInsights() {
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Insights</h1>
        <p>High-level trends across roofs, quotes, and contractors.</p>
      </header>

      <div class="grid-3">
        <div class="card stat-card">
          <h3>Avg. Roof Age</h3>
          <p class="stat-value">17 yrs</p>
          <p class="stat-sub">Across scanned properties</p>
        </div>
        <div class="card stat-card">
          <h3>Replacement Rate</h3>
          <p class="stat-value">38%</p>
          <p class="stat-sub">Within 12 months of scan</p>
        </div>
        <div class="card stat-card">
          <h3>Avg. Quote Spread</h3>
          <p class="stat-value">$3,200</p>
          <p class="stat-sub">Between lowest and highest bid</p>
        </div>
      </div>
    </section>
  `);
}

function renderContractorDashboard() {
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Contractor Dashboard</h1>
        <p>Your active jobs, leads, and performance metrics.</p>
      </header>

      <div class="grid-3">
        <div class="card stat-card">
          <h3>Active Jobs</h3>
          <p class="stat-value">6</p>
          <p class="stat-sub">2 scheduled this week</p>
        </div>

        <div class="card stat-card">
          <h3>Pending Quotes</h3>
          <p class="stat-value">4</p>
          <p class="stat-sub">Awaiting homeowner response</p>
        </div>

        <div class="card stat-card">
          <h3>Avg. Job Value</h3>
          <p class="stat-value">$12,300</p>
          <p class="stat-sub">Based on last 10 jobs</p>
        </div>
      </div>

      <div class="card" style="margin-top:24px;">
        <div class="card-header">
          <h3 class="card-title">Recent Jobs</h3>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Address</th>
              <th>Status</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>123 Oak St</td><td>In Progress</td><td>$14,200</td></tr>
            <tr><td>45 Pine Ave</td><td>Scheduled</td><td>$9,800</td></tr>
            <tr><td>78 Maple Dr</td><td>Completed</td><td>$12,900</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  `);
}

function renderContractorLogin() {
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Contractor Login</h1>
        <p>Access your dashboard, leads, and performance insights.</p>
      </header>

      <div class="grid-2">
        <form id="contractor-login-form" class="card">
          <div class="card-header">
            <h3 class="card-title">Magic Link Login</h3>
            <p class="card-subtitle">Enter your work email to receive a secure login link.</p>
          </div>

          <div class="form-field">
            <label>Email</label>
            <input id="contractor-login-email" type="email" placeholder="you@roofingcompany.com" />
          </div>

          <div class="form-actions">
            <button class="btn-primary">Send Login Link</button>
          </div>
        </form>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Why Magic Links?</h3>
          </div>
          <ul class="detail-list">
            <li>No passwords to remember</li>
            <li>Fast and secure</li>
            <li>Works on any device</li>
            <li>Perfect for crews in the field</li>
          </ul>
        </div>
      </div>
    </section>
  `);

  const form = document.getElementById("contractor-login-form");
  form.onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById("contractor-login-email").value.trim();
    if (!email) {
      alert("Please enter your email");
      return;
    }
    alert("Demo login — redirecting to contractor dashboard.");
    navigate("/contractor-dashboard");
  };
}

function renderProjects() {
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Projects</h1>
        <p>Track your active, scheduled, and completed roofing projects.</p>
      </header>

      <div class="grid-3">
        <div class="card stat-card">
          <h3>Active</h3>
          <p class="stat-value">6</p>
          <p class="stat-sub">Currently in progress</p>
        </div>

        <div class="card stat-card">
          <h3>Scheduled</h3>
          <p class="stat-value">4</p>
          <p class="stat-sub">Upcoming this week</p>
        </div>

        <div class="card stat-card">
          <h3>Completed</h3>
          <p class="stat-value">28</p>
          <p class="stat-sub">Last 90 days</p>
        </div>
      </div>

      <div class="card" style="margin-top:24px;">
        <div class="card-header">
          <h3 class="card-title">Project List</h3>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Address</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>123 Oak St</td><td>In Progress</td><td>Jan 12</td><td>$14,200</td></tr>
            <tr><td>45 Pine Ave</td><td>Scheduled</td><td>Jan 20</td><td>$9,800</td></tr>
            <tr><td>78 Maple Dr</td><td>Completed</td><td>Jan 3</td><td>$12,900</td></tr>
            <tr><td>90 Cedar Ln</td><td>In Progress</td><td>Jan 15</td><td>$11,400</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  `);
}

function renderPayments() {
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Payments</h1>
        <p>View your invoices, payment history, and billing details.</p>
      </header>

      <div class="grid-2">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Current Plan</h3>
            <p class="card-subtitle">Your active subscription details.</p>
          </div>

          <ul class="detail-list">
            <li><strong>Plan:</strong> Pro Contractor</li>
            <li><strong>Price:</strong> $149 / month</li>
            <li><strong>Next Billing Date:</strong> Feb 12, 2026</li>
            <li><strong>Status:</strong> Active</li>
          </ul>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Payment Method</h3>
            <p class="card-subtitle">Your saved card on file.</p>
          </div>

          <ul class="detail-list">
            <li><strong>Card:</strong> Visa ending in 4242</li>
            <li><strong>Expires:</strong> 08/28</li>
            <li><strong>Billing Email:</strong> billing@roofingcompany.com</li>
          </ul>
        </div>
      </div>

      <div class="card" style="margin-top:24px;">
        <div class="card-header">
          <h3 class="card-title">Invoice History</h3>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Invoice #</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Jan 12, 2026</td><td>INV-1023</td><td>$149.00</td><td>Paid</td></tr>
            <tr><td>Dec 12, 2025</td><td>INV-1012</td><td>$149.00</td><td>Paid</td></tr>
            <tr><td>Nov 12, 2025</td><td>INV-1001</td><td>$149.00</td><td>Paid</td></tr>
          </tbody>
        </table>
      </div>
    </section>
  `);
}

function renderUpload() {
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Upload Photos</h1>
        <p>Upload roof images for AI analysis and damage detection.</p>
      </header>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Upload Roof Images</h3>
          <p class="card-subtitle">Supported formats: JPG, PNG. Max 10 images.</p>
        </div>

        <form id="upload-form">
          <div class="form-field">
            <label>Select Photos</label>
            <input id="upload-input" type="file" accept="image/*" multiple />
          </div>

          <div id="upload-preview" class="upload-grid" style="margin-top:16px;"></div>

          <div class="form-actions" style="margin-top:16px;">
            <button class="btn-primary">Analyze Roof</button>
          </div>
        </form>
      </div>
    </section>
  `);

  const input = document.getElementById("upload-input");
  const preview = document.getElementById("upload-preview");

  input.onchange = () => {
    preview.innerHTML = "";
    [...input.files].forEach(file => {
      const url = URL.createObjectURL(file);
      preview.innerHTML += `
        <div class="card" style="padding:8px;">
          <img src="${url}" style="width:100%; border-radius:6px;" />
        </div>
      `;
    });
  };

  const form = document.getElementById("upload-form");
  form.onsubmit = (e) => {
    e.preventDefault();
    if (!input.files.length) {
      alert("Please upload at least one photo");
      return;
    }
    alert("Demo upload complete — redirecting to Roof Health page.");
    navigate("/health");
  };
}

function renderAdminDashboard() {
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Admin Dashboard</h1>
        <p>Platform-wide metrics, system health, and contractor activity.</p>
      </header>

      <div class="grid-3">
        <div class="card stat-card">
          <h3>Total Contractors</h3>
          <p class="stat-value">142</p>
          <p class="stat-sub">+12 this month</p>
        </div>

        <div class="card stat-card">
          <h3>Active Sessions</h3>
          <p class="stat-value">58</p>
          <p class="stat-sub">Real-time usage</p>
        </div>

        <div class="card stat-card">
          <h3>AI Analyses Today</h3>
          <p class="stat-value">142</p>
          <p class="stat-sub">Steady volume</p>
        </div>
      </div>

      <div class="card" style="margin-top:24px;">
        <div class="card-header">
          <h3 class="card-title">System Health</h3>
        </div>

        <ul class="detail-list">
          <li><strong>API Latency:</strong> 182 ms avg</li>
          <li><strong>Error Rate:</strong> 0.4%</li>
          <li><strong>Uptime:</strong> 99.98%</li>
          <li><strong>Queue Depth:</strong> Normal</li>
        </ul>
      </div>
    </section>
  `);
}

// ---------- Router bootstrap ----------

function loadRoute() {
  const route = getRoute();
  const fn = routes[route];
  if (typeof fn === "function") fn();
  else renderHome();
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  window.addEventListener("hashchange", loadRoute);
  loadRoute();
});
