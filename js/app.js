/* -------------------------------
   SIMPLE SPA ROUTER
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

function mount(html) {
  const app = document.getElementById("app");
  if (!app) return;
  app.innerHTML = html;
}

/* -------------------------------
   HOME PAGE
--------------------------------*/

function renderHome() {
  mount(`
    <header class="hero fade-in-up">
      <img
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80"
        class="hero-img"
        loading="lazy"
        alt="Roofing hero"
      />
      <div class="hero-content">
        <h1>Instant Roof Health & Contractor Quotes</h1>
        <p>Look up your home, analyze your roof with AI, and get quotes from verified contractors.</p>
        <div style="display:flex; gap:12px; flex-wrap:wrap;">
          <a href="#/lookup" class="cta-btn">Look Up My Home</a>
          <a href="#/intake" class="cta-btn secondary">Upload Roof Photos</a>
        </div>
      </div>
    </header>

    <section class="features fade-in-up">
      <div class="feature">
        <img
          src="https://images.unsplash.com/photo-1581091012184-5c7b6c2a5d79?auto=format&fit=crop&w=800&q=80"
          class="feature-img"
          loading="lazy"
          alt="Roofing materials"
        />
        <h3>Smart Material Recognition</h3>
        <p>Automatically detect shingles, tiles, metal, and more.</p>
      </div>

      <div class="feature">
        <img
          src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80"
          class="feature-img"
          loading="lazy"
          alt="Roof inspection"
        />
        <h3>Damage Scoring</h3>
        <p>Identify hail, wind, and age‑related damage instantly.</p>
      </div>

      <div class="feature">
        <img
          src="https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=800&q=80"
          class="feature-img"
          loading="lazy"
          alt="Contractor tools"
        />
        <h3>Verified Contractors</h3>
        <p>Compare quotes from vetted roofing pros.</p>
      </div>
    </section>
  `);
}

/* -------------------------------
   FEATURES PAGE
--------------------------------*/

function renderFeatures() {
  mount(`
    <div class="page-container fade-in-up">
      <h1>Features</h1>
      <p>Everything you need to assess your roof and get quotes fast.</p>

      <div class="upload-box">
        <h2>For Homeowners</h2>
        <ul>
          <li>Home lookup with satellite outline</li>
          <li>AI roof health score</li>
          <li>Damage detection</li>
          <li>Repair vs replace recommendation</li>
          <li>Instant cost ranges</li>
          <li>Multiple contractor quotes</li>
        </ul>
      </div>

      <div class="upload-box" style="margin-top:24px;">
        <h2>For Contractors</h2>
        <ul>
          <li>Pre‑qualified leads</li>
          <li>AI takeoffs</li>
          <li>Materials list</li>
          <li>Quote workspace</li>
          <li>Dashboard & insights</li>
        </ul>
      </div>
    </div>
  `);
}

/* -------------------------------
   HOME LOOKUP PAGE
--------------------------------*/

function renderHomeLookup() {
  mount(`
    <div class="page-container fade-in-up">
      <h1>Home Lookup</h1>
      <p>Enter your address to pull roof details automatically.</p>

      <div class="upload-box">
        <input id="lookup-address" type="text" placeholder="123 Main St, City, State" />
        <button id="lookup-btn" class="btn-primary" style="margin-top:12px;">Search</button>
      </div>

      <div id="lookup-results" class="placeholder-box" style="display:none;margin-top:20px;"></div>
    </div>
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

      let outline = null;
      try {
        const outlineRes = await fetch("/functions/roof-outline", {
          method: "POST",
          body: JSON.stringify({ address }),
        });
        outline = outlineRes.ok ? await outlineRes.json() : null;
      } catch (e) {
        console.error(e);
      }

      resultsBox.innerHTML = `
        <h2>Property Details</h2>
        <ul>
          <li><strong>Roof Area:</strong> ${data.roofArea || "—"} sq ft</li>
          <li><strong>Pitch:</strong> ${data.pitch || "—"}</li>
          <li><strong>Material:</strong> ${data.material || "—"}</li>
          <li><strong>Year Built:</strong> ${data.yearBuilt || "—"}</li>
          <li><strong>Roof Age:</strong> ${data.roofAge || "—"} years</li>
        </ul>

        ${
          outline
            ? `
          <h2 style="margin-top:20px;">Satellite Roof Outline</h2>
          <img src="${outline.imageUrl}" style="width:100%;border-radius:8px;margin-top:8px;" alt="Satellite roof" />
          <ul style="margin-top:12px;">
            <li><strong>Detected Area:</strong> ${outline.areaSqFt || "—"} sq ft</li>
            <li><strong>Pitch Estimate:</strong> ${outline.pitch || "—"}</li>
            <li><strong>Complexity:</strong> ${outline.complexity || "—"}</li>
          </ul>
        `
            : `<p style="margin-top:12px;">No satellite outline available.</p>`
        }

        <a href="#/intake" class="btn-primary" style="margin-top:20px;display:inline-block;">
          Continue to Photo Upload
        </a>
      `;
    } catch (err) {
      console.error(err);
      resultsBox.innerHTML = `
        <p>We couldn’t look up that address. Please try again or continue to photo upload.</p>
        <a href="#/intake" class="btn-primary" style="margin-top:12px;display:inline-block;">
          Go to Photo Upload
        </a>
      `;
    }
  };
}

/* -------------------------------
   INTAKE (UPLOAD PHOTOS)
--------------------------------*/

function renderIntake() {
  mount(`
    <div class="page-container fade-in-up">
      <h1>Upload Roof Photos</h1>
      <p>Upload up to 5 photos for AI analysis.</p>

      <form id="intake-form" class="upload-box">
        <input id="photos" type="file" accept="image/*" multiple />
        <button class="btn-primary" style="margin-top:12px;">Run AI Analysis</button>
      </form>
    </div>
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
   ROOF HEALTH SCORE PAGE
--------------------------------*/

function renderRoofHealth() {
  const data = JSON.parse(localStorage.getItem("roofAnalysis") || "{}");

  const score = data.score ?? 72;
  const severity =
    score >= 85 ? "Excellent" :
    score >= 70 ? "Good" :
    score >= 50 ? "Fair" : "Poor";

  mount(`
    <div class="page-container fade-in-up">
      <h1>Roof Health Score</h1>

      <div class="card">
        <div class="card-header"><h3>Overall Score</h3></div>
        <div style="display:flex;align-items:center;gap:16px;margin-top:12px;">
          <div style="width:96px;height:96px;border-radius:50%;border:6px solid #4f46e5;display:flex;align-items:center;justify-content:center;font-size:1.8rem;font-weight:bold;">
            ${score}
          </div>
          <div>
            <span class="status-pill">${severity}</span>
            <p style="margin-top:8px;font-size:0.9rem;">
              Based on roof material, estimated age, visible damage, and complexity.
            </p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h3>Details</h3></div>
        <ul>
          <li><strong>Material:</strong> ${data.material || "Asphalt Shingle"}</li>
          <li><strong>Pitch:</strong> ${data.pitch || "6/12"}</li>
          <li><strong>Roof Age:</strong> ${data.roofAge || "—"} years</li>
          <li><strong>Roof Area:</strong> ${data.roofArea || "—"} sq ft</li>
          <li><strong>Damage:</strong> ${data.damage || "—"}</li>
        </ul>
      </div>

      <div id="materials"></div>

      <a href="#/quotes" class="btn-primary" style="margin-top:20px;display:inline-block;">
        View Quotes
      </a>

      <a href="/functions/homeowner-report" class="btn-secondary" style="margin-top:12px;display:inline-block;">
        Download Homeowner Report
      </a>
    </div>
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
        <div class="card-header"><h3>Suggested Materials List</h3></div>
        <ul>
          <li><strong>Shingle Bundles:</strong> ${m.bundles}</li>
          <li><strong>Underlayment Rolls:</strong> ${m.underlaymentRolls}</li>
          <li><strong>Drip Edge:</strong> ${m.dripEdgeFt} ft</li>
          <li><strong>Roof Vents:</strong> ${m.vents}</li>
        </ul>
        <p style="font-size:0.8rem;color:#6b7280;margin-top:8px;">
          ${m.notes || "Adjust based on local code, manufacturer specs, and roof complexity."}
        </p>
      </div>
    `;
  } catch (err) {
    console.error(err);
  }
}

/* -------------------------------
   QUOTES PAGE
--------------------------------*/

function renderQuotes() {
  mount(`
    <div class="page-container fade-in-up">
      <h1>AI‑Generated Quotes</h1>
      <p>This is where contractor quotes will appear.</p>
    </div>
  `);
}

/* -------------------------------
   LOGIN PAGE
--------------------------------*/

function renderLogin() {
  mount(`
    <div class="page-container fade-in-up">
      <h1>Roofer Login</h1>

      <form id="login-form" class="upload-box">
        <input id="login-email" type="email" placeholder="you@roofingcompany.com" />
        <button class="btn-primary" style="margin-top:12px;">Send Login Code</button>
      </form>
    </div>
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
      alert("Mock login: redirecting to dashboard");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Unable to send login code right now.");
    }
  };
}

/* -------------------------------
   DASHBOARD
--------------------------------*/

function renderDashboard() {
  mount(`
    <div class="page-container fade-in-up">
      <h1>Contractor Dashboard</h1>
      <p>Your leads, bids, and performance insights will appear here.</p>
    </div>
  `);
}

/* -------------------------------
   OTHER PAGES (PLACEHOLDERS)
--------------------------------*/

function renderLeaderboard() {
  mount(`
    <div class="page-container fade-in-up">
      <h1>Leaderboard</h1>
      <p>Gamified performance metrics will appear here.</p>
    </div>
  `);
}

function renderBilling() {
  mount(`
    <div class="page-container fade-in-up">
      <h1>Billing</h1>
      <p>Manage your subscription and invoices here.</p>
    </div>
  `);
}

function renderAdmin() {
  mount(`
    <div class="page-container fade-in-up">
      <h1>Admin Console</h1>
      <p>Approve contractors and oversee marketplace health.</p>
    </div>
  `);
}

function renderInsights() {
  mount(`
    <div class="page-container fade-in-up">
      <h1>AI Insights</h1>
      <p>Personalized feedback on your bidding performance.</p>
    </div>
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
window.addEventListener("load", handleRoute);
