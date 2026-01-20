// Simple SPA router + page shells with modern layout.
// Assumes your backend functions are already deployed via Cloudflare Pages Functions.

const routes = {
  "/login": renderLogin,
  "/dashboard": renderDashboard,
  "/intake": renderIntake,
  "/quotes": renderQuotes,
  "/leaderboard": renderLeaderboard,
  "/billing": renderBilling,
  "/admin": renderAdmin,
  "/insights": renderInsights,
  "/lookup": renderHomeLookup, // Home lookup route
};

function getRouteFromHash() {
  const hash = window.location.hash || "#/dashboard";
  const path = hash.replace("#", "");
  return routes[path] ? path : "/dashboard";
}

function navigate(path) {
  window.location.hash = path;
}

function renderAppShell({ title, subtitle, tags = [], actions = [], main, side }) {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `
    <section class="app-shell fade-in-up">
      <header class="app-header">
        <div>
          <h2 class="app-title">${title}</h2>
          <p class="app-subtitle">${subtitle || ""}</p>
          ${
            tags.length
              ? `<div class="app-tag-row">${tags
                  .map((t) => `<span class="app-tag">${t}</span>`)
                  .join("")}</div>`
              : ""
          }
        </div>
        <div class="app-actions">
          ${actions.join("")}
        </div>
      </header>
      <div class="app-content">
        <div class="app-main">
          ${main}
        </div>
        <aside class="app-side">
          ${side || ""}
        </aside>
      </div>
    </section>
  `;
}

/* Home Lookup */

function renderHomeLookup() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `
    <div class="page-container fade-in-up">
      <h1>Look Up Your Home</h1>
      <p>Enter your address and we’ll automatically pull roof details and satellite outline before you upload photos.</p>

      <div class="upload-box">
        <input id="lookup-address" type="text" placeholder="123 Main St, City, State" />
        <button id="lookup-btn" class="btn-primary" style="margin-top:12px;">Search</button>
      </div>

      <div id="lookup-results" class="placeholder-box" style="display:none; margin-top:20px;"></div>
    </div>
  `;

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

      if (!res.ok) throw new Error("Lookup failed");
      const data = await res.json();

      let outline = null;
      try {
        const outlineRes = await fetch("/functions/roof-outline", {
          method: "POST",
          body: JSON.stringify({ address }),
        });
        if (outlineRes.ok) {
          outline = await outlineRes.json();
        }
      } catch (e) {
        console.error("Outline fetch failed", e);
      }

      resultsBox.innerHTML = `
        <h2>Property Details</h2>
        <ul>
          <li><strong>Roof Area:</strong> ${data.roofArea} sq ft</li>
          <li><strong>Pitch:</strong> ${data.pitch}</li>
          <li><strong>Material:</strong> ${data.material}</li>
          <li><strong>Year Built:</strong> ${data.yearBuilt}</li>
          <li><strong>Estimated Roof Age:</strong> ${data.roofAge} years</li>
          ${data.lotSize ? `<li><strong>Lot Size:</strong> ${data.lotSize}</li>` : ""}
          ${data.estValue ? `<li><strong>Estimated Value:</strong> ${data.estValue}</li>` : ""}
        </ul>

        ${
          outline
            ? `
          <h2 style="margin-top:20px;">Satellite Roof Outline</h2>
          <img src="${outline.imageUrl}" style="width:100%;border-radius:8px;margin-top:8px;" alt="Satellite roof" />
          <ul style="margin-top:12px;">
            <li><strong>Detected Area:</strong> ${outline.areaSqFt} sq ft</li>
            <li><strong>Pitch Estimate:</strong> ${outline.pitch}</li>
            <li><strong>Complexity:</strong> ${outline.complexity}</li>
          </ul>
        `
            : `<p style="margin-top:12px;">No satellite outline available.</p>`
        }

        <a href="#/intake" class="btn-primary" style="margin-top:20px; display:inline-block;">
          Continue to Photo Upload
        </a>
      `;
    } catch (err) {
      console.error(err);
      resultsBox.innerHTML = `
        <p>We couldn’t look up that address. Please try again or continue to photo upload.</p>
        <a href="#/intake" class="btn-primary" style="margin-top:12px; display:inline-block;">
          Go to Photo Upload
        </a>
      `;
    }
  };
}

/* Individual views */

function renderLogin() {
  renderAppShell({
    title: "Contractor Login",
    subtitle: "Access your leads, bids, and AI insights.",
    tags: ["Secure magic link login", "No passwords to remember"],
    actions: [],
    main: `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Send Login Code</h3>
          <p class="card-subtitle">We’ll email you a one‑time code to sign in.</p>
        </div>
        <form id="login-form">
          <div class="form-field">
            <label for="login-email">Email</label>
            <input id="login-email" type="email" required placeholder="you@roofingcompany.com" />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary">Send Code</button>
          </div>
        </form>
      </div>
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Verify Code</h3>
          <p class="card-subtitle">Paste the code from your email to complete login.</p>
        </div>
        <form id="verify-form">
          <div class="form-grid">
            <div class="form-field">
              <label for="verify-email">Email</label>
              <input id="verify-email" type="email" required />
            </div>
            <div class="form-field">
              <label for="verify-code">Code</label>
              <input id="verify-code" type="text" required />
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary">Verify & Continue</button>
          </div>
        </form>
      </div>
    `,
    side: `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Why magic links?</h3>
        </div>
        <p class="card-subtitle">
          Passwordless login keeps your crews moving fast while staying secure. No forgotten passwords, no lockouts.
        </p>
      </div>
    `,
  });

  const loginForm = document.getElementById("login-form");
  const verifyForm = document.getElementById("verify-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value.trim();
      if (!email) return;

      try {
        await fetch("/functions/request-login-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        alert("Login code sent. Check your email.");
      } catch (err) {
        console.error(err);
        alert("Unable to send login code right now.");
      }
    });
  }

  if (verifyForm) {
    verifyForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("verify-email").value.trim();
      const code = document.getElementById("verify-code").value.trim();
      if (!email || !code) return;

      try {
        const res = await fetch("/functions/verify-login-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code }),
        });
        if (!res.ok) throw new Error("Invalid code");
        navigate("/dashboard");
      } catch (err) {
        console.error(err);
        alert("Invalid code or login failed.");
      }
    });
  }
}

function renderDashboard() {
  renderAppShell({
    title: "Contractor Dashboard",
    subtitle: "Your active leads, bids, and AI‑assisted performance in one place.",
    tags: ["Live leads", "Bid pipeline", "AI performance insights"],
    actions: [
      `<button class="btn-secondary" onclick="navigate('/intake')">New Intake</button>`,
      `<button class="btn-secondary" onclick="navigate('/quotes')">View Quotes</button>`,
    ],
    main: `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Active Leads</h3>
          <p class="card-subtitle">Leads currently assigned to your team.</p>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Location</th>
              <th>Status</th>
              <th>Due</th>
            </tr>
          </thead>
          <tbody id="dashboard-leads-body">
            <tr><td colspan="4">Loading leads…</td></tr>
          </tbody>
        </table>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Recent Bids</h3>
          <p class="card-subtitle">Track your recent submissions and outcomes.</p>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Bid</th>
              <th>Outcome</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody id="dashboard-bids-body">
            <tr><td colspan="4">Loading bids…</td></tr>
          </tbody>
        </table>
      </div>
    `,
    side: `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">AI Snapshot</h3>
        </div>
        <p class="card-subtitle">
          Get a quick read on how your team is performing across response times, win rates, and pricing bands.
        </p>
        <ul style="list-style:none;padding-left:0;font-size:0.8rem;margin-top:8px;">
          <li>• Response time: <strong>12 min</strong> (top 10%)</li>
          <li>• Win rate: <strong>34%</strong> (above average)</li>
          <li>• Pricing: <strong>Within AI‑suggested band</strong> on 78% of bids</li>
        </ul>
        <button class="btn-secondary" style="margin-top:8px;" onclick="navigate('/insights')">
          View full AI insights
        </button>
      </div>
    `,
  });

  loadDashboardData();
}

async function loadDashboardData() {
  const leadsBody = document.getElementById("dashboard-leads-body");
  const bidsBody = document.getElementById("dashboard-bids-body");
  try {
    const leadsRes = await fetch("/functions/get-roofer-leads");
    const leads = leadsRes.ok ? await leadsRes.json() : [];
    if (leadsBody) {
      leadsBody.innerHTML =
        leads.length === 0
          ? `<tr><td colspan="4">No active leads.</td></tr>`
          : leads
              .map(
                (l) => `
          <tr>
            <td>${l.id || "Lead"}</td>
            <td>${l.city || ""}, ${l.state || ""}</td>
            <td><span class="status-pill status-pill-pending">${l.status || "New"}</span></td>
            <td>${l.dueBy || "—"}</td>
          </tr>`
              )
              .join("");
    }
  } catch (err) {
    console.error(err);
    if (leadsBody) {
      leadsBody.innerHTML = `<tr><td colspan="4">Unable to load leads.</td></tr>`;
    }
  }

  try {
    const bidsRes = await fetch("/functions/admin-bids");
    const bids = bidsRes.ok ? await bidsRes.json() : [];
    if (bidsBody) {
      bidsBody.innerHTML =
        bids.length === 0
          ? `<tr><td colspan="4">No recent bids.</td></tr>`
          : bids
              .map(
                (b) => `
          <tr>
            <td>${b.leadId || "Lead"}</td>
            <td>$${b.amount || "—"}</td>
            <td>
              <span class="status-pill ${
                b.status === "won"
                  ? "status-pill-success"
                  : b.status === "lost"
                  ? "status-pill-danger"
                  : "status-pill-pending"
              }">${b.status || "pending"}</span>
            </td>
            <td>${b.updatedAt || "—"}</td>
          </tr>`
              )
              .join("");
    }
  } catch (err) {
    console.error(err);
    if (bidsBody) {
      bidsBody.innerHTML = `<tr><td colspan="4">Unable to load bids.</td></tr>`;
    }
  }
}

function renderIntake() {
  renderAppShell({
    title: "New Roof Intake",
    subtitle: "Upload photos, capture details, and let the AI do the heavy lifting.",
    tags: ["Multi‑photo upload", "AI roof analysis", "Satellite fusion"],
    actions: [
      `<button class="btn-secondary" onclick="navigate('/dashboard')">Back to Dashboard</button>`,
    ],
    main: `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Property Details</h3>
          <p class="card-subtitle">Basic information about the property and homeowner.</p>
        </div>
        <form id="intake-form">
          <div class="form-grid">
            <div class="form-field">
              <label for="intake-name">Homeowner Name</label>
              <input id="intake-name" type="text" required />
            </div>
            <div class="form-field">
              <label for="intake-email">Email</label>
              <input id="intake-email" type="email" required />
            </div>
            <div class="form-field">
              <label for="intake-city">City</label>
              <input id="intake-city" type="text" required />
            </div>
            <div class="form-field">
              <label for="intake-state">State</label>
              <input id="intake-state" type="text" required />
            </div>
          </div>

          <div class="form-field" style="margin-top:8px;">
            <label for="intake-notes">Notes</label>
            <textarea id="intake-notes" rows="3" placeholder="Insurance claim, storm damage, preferred timing, etc."></textarea>
          </div>

          <div class="form-field" style="margin-top:8px;">
            <label>Roof Photos (up to 5)</label>
            <input id="intake-photos" type="file" accept="image/*" multiple />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-primary">Run AI Analysis</button>
          </div>
        </form>
      </div>
    `,
    side: `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">What the AI will do</h3>
        </div>
        <ul style="list-style:none;padding-left:0;font-size:0.8rem;margin-top:8px;">
          <li>• Detect roof type and approximate pitch</li>
          <li>• Estimate roof area and bundle count</li>
          <li>• Fuse with satellite imagery for refinement</li>
          <li>• Generate a materials list and labor estimate</li>
        </ul>
        <p class="card-subtitle" style="margin-top:8px;">
          You’ll see a structured output you can turn into a quote in minutes.
        </p>
      </div>
    `,
  });

  const intakeForm = document.getElementById("intake-form");
  if (intakeForm) {
    intakeForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const photosInput = document.getElementById("intake-photos");
      const files = photosInput.files || [];
      const formData = new FormData();
      for (let i = 0; i < files.length && i < 5; i++) {
        formData.append("photos", files[i]);
      }
      formData.append("name", document.getElementById("intake-name").value);
      formData.append("email", document.getElementById("intake-email").value);
      formData.append("city", document.getElementById("intake-city").value);
      formData.append("state", document.getElementById("intake-state").value);
      formData.append("notes", document.getElementById("intake-notes").value);

      try {
        const res = await fetch("/functions/analyze-multiple-roof-photos", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("AI analysis failed");
        const data = await res.json();
        alert("AI analysis complete. You can now generate a quote.");
        console.log("AI analysis result:", data);
        navigate("/quotes");
      } catch (err) {
        console.error(err);
        alert("Unable to run AI analysis right now.");
      }
    });
  }
}

function renderQuotes() {
  renderAppShell({
    title: "Quotes",
    subtitle: "Review AI‑assisted quotes and send them to homeowners.",
    tags: ["AI‑suggested ranges", "Materials & labor breakdown"],
    actions: [
      `<button class="btn-secondary" onclick="navigate('/intake')">New Intake</button>`,
    ],
    main: `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Generated Quotes</h3>
          <p class="card-subtitle">Quotes generated from recent AI analyses.</p>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Range</th>
              <th>AI Confidence</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="quotes-body">
            <tr><td colspan="4">Loading quotes…</td></tr>
          </tbody>
        </table>
      </div>
    `,
    side: `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">How AI ranges work</h3>
        </div>
        <p class="card-subtitle">
          We generate a recommended range based on roof complexity, materials, and regional pricing. You stay in control of the final number.
        </p>
      </div>
    `,
  });

  loadQuotes();
}

async function loadQuotes() {
  const body = document.getElementById("quotes-body");
  try {
    const res = await fetch("/functions/generate-quotes");
    const quotes = res.ok ? await res.json() : [];
    if (body) {
      body.innerHTML =
        quotes.length === 0
          ? `<tr><td colspan="4">No quotes yet.</td></tr>`
          : quotes
              .map(
                (q) => `
        <tr>
          <td>${q.leadId || "Lead"}</td>
          <td>$${q.min || "—"} – $${q.max || "—"}</td>
          <td>${q.confidence || "—"}</td>
          <td><button class="btn-secondary" style="font-size:0.75rem;">View</button></td>
        </tr>`
              )
              .join("");
    }
  } catch (err) {
    console.error(err);
    if (body) {
      body.innerHTML = `<tr><td colspan="4">Unable to load quotes.</td></tr>`;
    }
  }
}

function renderLeaderboard() {
  renderAppShell({
    title: "Contractor Leaderboard",
    subtitle: "See how your team stacks up across response time, win rate, and volume.",
    tags: ["Gamified performance", "Transparent metrics"],
    actions: [],
    main: `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Leaderboard</h3>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Contractor</th>
              <th>Win Rate</th>
              <th>Avg. Response</th>
              <th>Leads Won</th>
            </tr>
          </thead>
          <tbody id="leaderboard-body">
            <tr><td colspan="4">Loading leaderboard…</td></tr>
          </tbody>
        </table>
      </div>
    `,
    side: `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Why leaderboard?</h3>
        </div>
        <p class="card-subtitle">
          Healthy competition keeps response times low and win rates high. Use this view in team meetings to celebrate wins.
        </p>
      </div>
    `,
  });

  loadLeaderboard();
}

async function loadLeaderboard() {
  const body = document.getElementById("leaderboard-body");
  try {
    const res = await fetch("/functions/contractor-leaderboard");
    const rows = res.ok ? await res.json() : [];
    if (body) {
      body.innerHTML =
        rows.length === 0
          ? `<tr><td colspan="4">No leaderboard data yet.</td></tr>`
          : rows
              .map(
                (r) => `
        <tr>
          <td>${r.name || "Contractor"}</td>
          <td>${r.winRate || "—"}%</td>
          <td>${r.avgResponse || "—"} min</td>
          <td>${r.leadsWon || 0}</td>
        </tr>`
              )
              .join("");
    }
  } catch (err) {
    console.error(err);
    if (body) {
      body.innerHTML = `<tr><td colspan="4">Unable to load leaderboard.</td></tr>`;
    }
  }
}

function renderBilling() {
  renderAppShell({
    title: "Billing & Subscription",
    subtitle: "Manage your plan, invoices, and payment details.",
    tags: ["Stripe billing", "Usage‑based pricing"],
    actions: [
      `<button class="btn-primary" onclick="startCheckout()">Upgrade Plan</button>`,
    ],
    main: `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Current Plan</h3>
        </div>
        <p class="card-subtitle">
          You’re on the <strong>Pro</strong> plan. Perfect for growing teams that want AI‑assisted quoting and marketplace access.
        </p>
      </div>
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Invoices</h3>
        </div>
        <p class="card-subtitle">Invoices will appear here once billing is live.</p>
      </div>
    `,
    side: `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Stripe‑backed billing</h3>
        </div>
        <p class="card-subtitle">
          All payments are processed securely via Stripe. You can update your card, download invoices, and manage your subscription in the billing portal.
        </p>
        <button class="btn-secondary" style="margin-top:8px;" onclick="openBillingPortal()">
          Open Billing Portal
        </button>
      </div>
    `,
  });
}

async function startCheckout() {
  try {
    const res = await fetch("/functions/create-checkout-session", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  } catch (err) {
    console.error(err);
    alert("Unable to start checkout right now.");
  }
}

async function openBillingPortal() {
  try {
    const res = await fetch("/functions/create-billing-portal-session", { method: "POST" });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  } catch (err) {
    console.error(err);
    alert("Unable to open billing portal right now.");
  }
}

function renderAdmin() {
  renderAppShell({
    title: "Admin Console",
    subtitle: "Approve contractors, review bids, and oversee marketplace health.",
    tags: ["Admin‑only", "Contractor verification", "Bid oversight"],
    actions: [],
    main: `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Contractor Approvals</h3>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Contractor</th>
              <th>Region</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="admin-contractors-body">
            <tr><td colspan="4">Loading contractors…</td></tr>
          </tbody>
        </table>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Bids</h3>
        </div>
        <table class="table">
          <thead>
            <tr>
              <th>Lead</th>
              <th>Contractor</th>
              <th>Bid</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="admin-bids-body">
            <tr><td colspan="4">Loading bids…</td></tr>
          </tbody>
        </table>
      </div>
    `,
    side: `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Marketplace health</h3>
        </div>
        <p class="card-subtitle">
          Use this console to keep your marketplace balanced—enough contractors per region, healthy response times, and fair pricing.
        </p>
      </div>
    `,
  });

  loadAdminData();
}

async function loadAdminData() {
  const contractorsBody = document.getElementById("admin-contractors-body");
  const bidsBody = document.getElementById("admin-bids-body");

  try {
    const res = await fetch("/functions/admin-contractors");
    const contractors = res.ok ? await res.json() : [];
    if (contractorsBody) {
      contractorsBody.innerHTML =
        contractors.length === 0
          ? `<tr><td colspan="4">No contractors yet.</td></tr>`
          : contractors
              .map(
                (c) => `
        <tr>
          <td>${c.name || "Contractor"}</td>
          <td>${c.region || "—"}</td>
          <td>${c.status || "pending"}</td>
          <td><button class="btn-secondary" style="font-size:0.75rem;">Review</button></td>
        </tr>`
              )
              .join("");
    }
  } catch (err) {
    console.error(err);
    if (contractorsBody) {
      contractorsBody.innerHTML = `<tr><td colspan="4">Unable to load contractors.</td></tr>`;
    }
  }

  try {
    const res = await fetch("/functions/admin-bids");
    const bids = res.ok ? await res.json() : [];
    if (bidsBody) {
      bidsBody.innerHTML =
        bids.length === 0
          ? `<tr><td colspan="4">No bids yet.</td></tr>`
          : bids
              .map(
                (b) => `
        <tr>
          <td>${b.leadId || "Lead"}</td>
          <td>${b.contractorName || "Contractor"}</td>
          <td>$${b.amount || "—"}</td>
          <td>${b.status || "pending"}</td>
        </tr>`
              )
              .join("");
    }
  } catch (err) {
    console.error(err);
    if (bidsBody) {
      bidsBody.innerHTML = `<tr><td colspan="4">Unable to load bids.</td></tr>`;
    }
  }
}

function renderInsights() {
  renderAppShell({
    title: "AI Contractor Insights",
    subtitle: "Personalized feedback on your bidding performance and opportunities to improve.",
    tags: ["AI‑powered coaching", "Pricing bands", "Response time insights"],
    actions: [],
    main: `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Performance Overview</h3>
        </div>
        <div id="insights-body">
          Loading AI insights…
        </div>
      </div>
    `,
    side: `
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">How to use this</h3>
        </div>
        <p class="card-subtitle">
          Treat this as a coach, not a rulebook. Use the insights to tighten your response times and pricing strategy.
        </p>
      </div>
    `,
  });

  loadInsights();
}

async function loadInsights() {
  const body = document.getElementById("insights-body");
  try {
    const res = await fetch("/functions/contractor-ai-insights");
    const data = res.ok ? await res.json() : null;
    if (!body) return;

    if (!data) {
      body.textContent = "No insights available yet.";
      return;
    }

    body.innerHTML = `
      <p style="font-size:0.9rem;">${data.summary || "AI insights loaded."}</p>
      ${
        data.recommendations && data.recommendations.length
          ? `<ul style="font-size:0.85rem;padding-left:18px;margin-top:8px;">
              ${data.recommendations.map((r) => `<li>${r}</li>`).join("")}
            </ul>`
          : ""
      }
    `;
  } catch (err) {
    console.error(err);
    if (body) body.textContent = "Unable to load AI insights right now.";
  }
}

/* Router bootstrap */

function handleRouteChange() {
  const path = getRouteFromHash();
  const view = routes[path];
  if (typeof view === "function") {
    view();
  }
}

window.addEventListener("hashchange", handleRouteChange);
window.addEventListener("load", handleRouteChange);
