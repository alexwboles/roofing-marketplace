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

  // 🔥 ADDED FOR HOME LOOKUP
  "/lookup": renderHomeLookup,
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

/* ---------------------------------------------------------
   🔥 NEW VIEW: HOME LOOKUP
--------------------------------------------------------- */

function renderHomeLookup() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `
    <div class="page-container fade-in-up">
      <h1>Look Up Your Home</h1>
      <p>Enter your address and we’ll automatically pull roof details before you upload photos.</p>

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

        <a href="#/intake" class="btn-primary" style="margin-top:12px; display:inline-block;">
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

/* ---------------------------------------------------------
   EXISTING VIEWS (UNCHANGED)
--------------------------------------------------------- */

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

/* ---------------------------------------------------------
   (All other views remain unchanged)
--------------------------------------------------------- */

function renderDashboard() { /* ... unchanged ... */ }
async function loadDashboardData() { /* ... unchanged ... */ }
function renderIntake() { /* ... unchanged ... */ }
function renderQuotes() { /* ... unchanged ... */ }
async function loadQuotes() { /* ... unchanged ... */ }
function renderLeaderboard() { /* ... unchanged ... */ }
async function loadLeaderboard() { /* ... unchanged ... */ }
function renderBilling() { /* ... unchanged ... */ }
async function startCheckout() { /* ... unchanged ... */ }
async function openBillingPortal() { /* ... unchanged ... */ }
function renderAdmin() { /* ... unchanged ... */ }
async function loadAdminData() { /* ... unchanged ... */ }
function renderInsights() { /* ... unchanged ... */ }
async function loadInsights() { /* ... unchanged ... */ }

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
