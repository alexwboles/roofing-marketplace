// Simple SPA router + page shells with modern layout.

const routes = {
  "/login": renderLogin,
  "/dashboard": renderDashboard,
  "/intake": renderIntake,
  "/quotes": renderQuotes,
  "/leaderboard": renderLeaderboard,
  "/billing": renderBilling,
  "/admin": renderAdmin,
  "/insights": renderInsights,
  "/lookup": renderHomeLookup,
  "/health": renderRoofHealth,
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

/* Roof Health Score */

function renderRoofHealth() {
  const app = document.getElementById("app");
  if (!app) return;

  const data = JSON.parse(localStorage.getItem("roofAnalysis") || "{}");

  const score = data.score ?? 72;
  const severity =
    score >= 85 ? "Excellent" :
    score >= 70 ? "Good" :
    score >= 50 ? "Fair" : "Poor";

  const severityClass =
    score >= 85 ? "status-pill-success" :
    score >= 70 ? "status-pill-warning" :
    score >= 50 ? "status-pill-pending" : "status-pill-danger";

  app.innerHTML = `
    <section class="app-shell fade-in-up">
      <header class="app-header">
        <div>
          <h2 class="app-title">Roof Health Score</h2>
          <p class="app-subtitle">AI‑generated assessment for this property.</p>
        </div>
        <div class="app-actions">
          <button class="btn-secondary" onclick="navigate('/quotes')">View Quotes</button>
        </div>
      </header>

      <div class="app-content">
        <div class="app-main">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Overall Score</h3>
            </div>
            <div style="display:flex;align-items:center;gap:16px;margin-top:12px;">
              <div style="width:96px;height:96px;border-radius:50%;border:6px solid #4f46e5;display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:bold;">
                ${score}
              </div>
              <div>
                <span class="status-pill ${severityClass}">${severity}</span>
                <p style="margin-top:8px;font-size:0.9rem;">
                  Based on roof material, estimated age, visible damage, and complexity.
                </p>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Key Details</h3>
            </div>
            <ul>
              <li><strong>Material:</strong> ${data.material || "Asphalt Shingle"}</li>
              <li><strong>Pitch:</strong> ${data.pitch || "6/12"}</li>
              <li><strong>Estimated Age:</strong> ${data.roofAge || "12 years"}</li>
              <li><strong>Roof Area:</strong> ${data.roofArea || "2,100"} sq ft</li>
              <li><strong>Damage:</strong> ${data.damage || "Granule loss, curling"}</li>
            </ul>
          </div>

          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Recommended Action</h3>
            </div>
            <p style="font-size:0.9rem;">
              ${data.recommendation || "We recommend planning a full replacement within the next 12–18 months to avoid leaks and escalating repair costs."}
            </p>
          </div>
        </div>

        <aside class="app-side">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Next Steps</h3>
            </div>
            <ul style="list-style:none;padding-left:0;font-size:0.85rem;margin-top:8px;">
              <li>• Review AI‑generated quotes for this property.</li>
              <li>• Share this report with the homeowner.</li>
              <li>• Use the materials list to finalize your bid.</li>
            </ul>
            <button class="btn-primary" style="margin-top:12px;" onclick="window.location.href='/functions/homeowner-report'">
              Download Homeowner PDF
            </button>
          </div>
        </aside>
      </div>
    </section>
  `;

  fetchMaterials(data.roofArea || 2100).then((materials) => {
    if (!materials) return;
    const appMain = document.querySelector(".app-main");
    if (!appMain) return;

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-header">
        <h3 class="card-title">Suggested Materials List</h3>
      </div>
      <ul>
        <li><strong>Shingle bundles:</strong> ${materials.bundles}</li>
        <li><strong>Underlayment rolls:</strong> ${materials.underlaymentRolls}</li>
        <li><strong>Drip edge:</strong> ${materials.dripEdgeFt} ft</li>
        <li><strong>Roof vents:</strong> ${materials.vents}</li>
      </ul>
      <p style="font-size:0.8rem;color:#6b7280;margin-top:8px;">
        ${materials.notes}
      </p>
    `;
    appMain.appendChild(card);
  });
}

async function fetchMaterials(roofArea) {
  try {
    const res = await fetch("/functions/generate-materials-list", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roofArea }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error(e);
    return null;
  }
}

/* Existing views (login, dashboard, intake, quotes, leaderboard, billing, admin, insights) */
/* — paste your existing implementations here unchanged, except for the intake submit handler — */

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

/* keep your existing renderDashboard, loadDashboardData, renderQuotes, loadQuotes, renderLeaderboard, loadLeaderboard, renderBilling, startCheckout, openBillingPortal, renderAdmin, loadAdminData, renderInsights, loadInsights exactly as before, except: */

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
        localStorage.setItem("roofAnalysis", JSON.stringify(data));
        navigate("/health");
      } catch (err) {
        console.error(err);
        alert("Unable to run AI analysis right now.");
      }
    });
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
