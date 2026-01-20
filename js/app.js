/* ============================
   THEME SYSTEM
============================ */
const THEME_KEY="roofing_theme";
function applyTheme(t){document.documentElement.setAttribute("data-theme",t);localStorage.setItem(THEME_KEY,t)}
function initTheme(){const s=localStorage.getItem(THEME_KEY);const p=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches;applyTheme(s|| (p?"dark":"light"))}
function toggleTheme(){const c=document.documentElement.getAttribute("data-theme")||"light";applyTheme(c==="light"?"dark":"light")}

/* ============================
   ROUTER
============================ */
const routes={
  "/home":renderHome,
  "/features":renderFeatures,
  "/lookup":renderHomeLookup,
  "/intake":renderIntake,
  "/health":renderRoofHealth,
  "/quotes":renderQuotes,
  "/login":renderLogin,
  "/dashboard":renderDashboard,
  "/leaderboard":renderLeaderboard,
  "/billing":renderBilling,
  "/admin":renderAdmin,
  "/insights":renderInsights
};
function getRoute(){const h=window.location.hash||"#/home";const p=h.replace("#","");return routes[p]?p:"/home"}
function navigate(p){window.location.hash=p}
function mount(html){
  const app=document.getElementById("app");
  if(!app)return;
  app.innerHTML=`
    <div class="app-shell">
      ${renderTopNav()}
      <div class="app-body">${html}</div>
    </div>`;
}

/* ============================
   NAVIGATION BAR
============================ */
function renderTopNav(){
  const current=getRoute();
  const theme=document.documentElement.getAttribute("data-theme")||"light";
  const link=(p,l)=>`<a href="#${p}" class="nav-link ${current===p?"nav-link-active":""}">${l}</a>`;
  return `
    <header class="topbar">
      <div class="topbar-left">
        <a href="#/home" class="logo">Roofing Marketplace</a>
        <nav class="nav-links">
          ${link("/home","Home")}
          ${link("/features","Features")}
          ${link("/lookup","Home Lookup")}
          ${link("/intake","Upload Photos")}
          ${link("/health","Roof Health")}
          ${link("/quotes","Quotes")}
        </nav>
      </div>
      <div class="topbar-right">
        <nav class="nav-links">
          ${link("/dashboard","Dashboard")}
          ${link("/login","Roofer Login")}
        </nav>
        <button class="theme-toggle" onclick="toggleTheme()">${theme==="light"?"🌙":"☀️"}</button>
      </div>
    </header>`;
}

/* ============================
   HOME PAGE
============================ */
function renderHome(){
  mount(`
    <section class="hero fade-in-up">
      <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80" class="hero-img" alt="Roof" />
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1>AI‑Powered Roof Health & Contractor Quotes</h1>
        <p>Instant roof scoring, satellite outlines, and verified contractor quotes — all in one clean dashboard.</p>
        <div class="hero-actions">
          <a href="#/lookup" class="btn-primary">Look Up My Home</a>
          <a href="#/intake" class="btn-secondary">Upload Roof Photos</a>
        </div>
        <div class="hero-meta">
          <span>⚡ Under 60 seconds</span>
          <span>🔒 Private</span>
          <span>🏠 No sales pressure</span>
        </div>
      </div>
    </section>

    <section class="features-grid fade-in-up">
      <article class="feature-card">
        <img src="https://images.unsplash.com/photo-1597004891283-5e4c2c8e85b2?auto=format&fit=crop&w=900&q=80" class="feature-img" />
        <h3>Smart Material Recognition</h3>
        <p>AI identifies shingles, tiles, metal, and more with high accuracy.</p>
      </article>

      <article class="feature-card">
        <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80" class="feature-img" />
        <h3>Damage Detection</h3>
        <p>Detect hail, wind, and age‑related wear — no ladder required.</p>
      </article>

      <article class="feature-card">
        <img src="https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=900&q=80" class="feature-img" />
        <h3>Verified Contractors</h3>
        <p>Homeowners see clear options. Contractors get pre‑qualified leads.</p>
      </article>
    </section>
  `);
}

/* ============================
   FEATURES PAGE
============================ */
function renderFeatures(){
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Platform Features</h1>
        <p>Everything you need to understand a roof clearly.</p>
      </header>

      <div class="grid-2">
        <div class="card">
          <div class="card-header"><h3 class="card-title">For Homeowners</h3></div>
          <ul class="feature-list">
            <li><strong>Home lookup:</strong> Pull roof details instantly.</li>
            <li><strong>Satellite outline:</strong> Auto‑detected roof shape.</li>
            <li><strong>Health score:</strong> 0–100 with explanation.</li>
            <li><strong>Damage detection:</strong> Hail, wind, aging.</li>
            <li><strong>Cost ranges:</strong> Localized estimates.</li>
            <li><strong>Multiple quotes:</strong> Compare contractors.</li>
          </ul>
        </div>

        <div class="card">
          <div class="card-header"><h3 class="card-title">For Contractors</h3></div>
          <ul class="feature-list">
            <li><strong>Pre‑qualified leads:</strong> Homeowners arrive informed.</li>
            <li><strong>AI takeoffs:</strong> Area, pitch, materials.</li>
            <li><strong>Quote workspace:</strong> Start from AI ranges.</li>
            <li><strong>Dashboard:</strong> Leads, bids, insights.</li>
            <li><strong>Billing:</strong> Simple subscription.</li>
          </ul>
        </div>
      </div>
    </section>
  `);
}

/* ============================
   HOME LOOKUP PAGE
============================ */
function renderHomeLookup(){
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Home Lookup</h1>
        <p>Start with an address. We’ll do the rest.</p>
      </header>

      <div class="card">
        <div class="card-header"><h3 class="card-title">Property Address</h3></div>
        <div class="form-field">
          <label>Address</label>
          <input id="lookup-address" type="text" placeholder="123 Main St, City, State" />
        </div>
        <div class="form-actions">
          <button id="lookup-btn" class="btn-primary">Search</button>
        </div>
      </div>

      <div id="lookup-results" class="card" style="display:none;"></div>
    </section>
  `);

  const btn=document.getElementById("lookup-btn");
  const box=document.getElementById("lookup-results");

  btn.onclick=async()=>{
    const address=document.getElementById("lookup-address").value.trim();
    if(!address){alert("Enter an address");return;}
    box.style.display="block";
    box.innerHTML="<p>Searching property records...</p>";

    try{
      const res=await fetch("/functions/home-lookup",{method:"POST",body:JSON.stringify({address})});
      const data=res.ok?await res.json():{};
      const oRes=await fetch("/functions/roof-outline",{method:"POST",body:JSON.stringify({address})});
      const outline=oRes.ok?await oRes.json():null;

      box.innerHTML=`
        <div class="card-header"><h3 class="card-title">Property Details</h3></div>
        <ul class="detail-list">
          <li><strong>Roof Area:</strong> ${data.roofArea||"—"} sq ft</li>
          <li><strong>Pitch:</strong> ${data.pitch||"—"}</li>
          <li><strong>Material:</strong> ${data.material||"—"}</li>
          <li><strong>Year Built:</strong> ${data.yearBuilt||"—"}</li>
          <li><strong>Roof Age:</strong> ${data.roofAge||"—"} years</li>
        </ul>

        ${
          outline?`
            <div class="card-header" style="margin-top:16px;"><h3 class="card-title">Satellite Roof Outline</h3></div>
            <img src="${outline.imageUrl}" class="satellite-img" />
            <ul class="detail-list">
              <li><strong>Detected Area:</strong> ${outline.areaSqFt||"—"} sq ft</li>
              <li><strong>Pitch Estimate:</strong> ${outline.pitch||"—"}</li>
              <li><strong>Complexity:</strong> ${outline.complexity||"—"}</li>
            </ul>
          `:`<p>No satellite outline available.</p>`
        }

        <div class="form-actions" style="margin-top:16px;">
          <a href="#/intake" class="btn-primary">Continue to Photo Upload</a>
        </div>
      `;
    }catch(e){
      box.innerHTML="<p>Lookup failed. Try again or continue to photo upload.</p>";
    }
  };
}
/* ============================
   INTAKE PAGE
============================ */
function renderIntake(){
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Upload Roof Photos</h1>
        <p>Upload up to 5 clear roof photos for AI analysis.</p>
      </header>

      <form id="intake-form" class="card">
        <div class="card-header">
          <h3 class="card-title">Roof Photos</h3>
          <p class="card-subtitle">Include different angles for best results.</p>
        </div>

        <div class="form-field">
          <label>Photos</label>
          <input id="photos" type="file" accept="image/*" multiple />
        </div>

        <div class="form-actions">
          <button class="btn-primary">Run AI Analysis</button>
        </div>
      </form>
    </section>
  `);

  const form=document.getElementById("intake-form");
  form.onsubmit=async(e)=>{
    e.preventDefault();
    const files=document.getElementById("photos").files;
    if(!files||files.length===0){alert("Upload at least one photo.");return;}

    const fd=new FormData();
    for(let i=0;i<files.length&&i<5;i++) fd.append("photos",files[i]);

    try{
      const res=await fetch("/functions/analyze-multiple-roof-photos",{method:"POST",body:fd});
      if(!res.ok) throw new Error("AI failed");
      const data=await res.json();
      localStorage.setItem("roofAnalysis",JSON.stringify(data));
      navigate("/health");
    }catch(err){
      alert("Unable to run AI analysis right now.");
    }
  };
}

/* ============================
   ROOF HEALTH PAGE
============================ */
function renderRoofHealth(){
  const data=JSON.parse(localStorage.getItem("roofAnalysis")||"{}");
  const score=data.score??72;
  const severity=score>=85?"Excellent":score>=70?"Good":score>=50?"Fair":"Poor";

  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Roof Health Score</h1>
        <p>AI‑generated assessment based on materials, age, and visible damage.</p>
      </header>

      <div class="grid-2">
        <div class="card">
          <div class="card-header"><h3 class="card-title">Overall Score</h3></div>
          <div class="score-row">
            <div class="score-circle">${score}</div>
            <div>
              <div class="score-label">${severity}</div>
              <p class="card-subtitle">Estimated remaining life and visible condition.</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header"><h3 class="card-title">Roof Details</h3></div>
          <ul class="detail-list">
            <li><strong>Material:</strong> ${data.material||"Asphalt Shingle"}</li>
            <li><strong>Pitch:</strong> ${data.pitch||"6/12"}</li>
            <li><strong>Roof Age:</strong> ${data.roofAge||"—"} years</li>
            <li><strong>Roof Area:</strong> ${data.roofArea||"—"} sq ft</li>
            <li><strong>Damage:</strong> ${data.damage||"—"}</li>
          </ul>
        </div>
      </div>

      <div id="materials"></div>

      <div class="page-actions">
        <a href="#/quotes" class="btn-primary">View Quotes</a>
        <a href="/functions/homeowner-report" class="btn-secondary">Download Report</a>
      </div>
    </section>
  `);

  loadMaterials(data.roofArea||2100);
}

/* ============================
   MATERIALS LIST LOADER
============================ */
async function loadMaterials(area){
  try{
    const res=await fetch("/functions/generate-materials-list",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({roofArea:area})
    });
    const m=res.ok?await res.json():null;
    if(!m)return;

    const box=document.getElementById("materials");
    if(!box)return;

    box.innerHTML=`
      <div class="card">
        <div class="card-header"><h3 class="card-title">Suggested Materials</h3></div>
        <ul class="detail-list">
          <li><strong>Shingle Bundles:</strong> ${m.bundles}</li>
          <li><strong>Underlayment Rolls:</strong> ${m.underlaymentRolls}</li>
          <li><strong>Drip Edge:</strong> ${m.dripEdgeFt} ft</li>
          <li><strong>Roof Vents:</strong> ${m.vents}</li>
        </ul>
        <p class="card-subtitle">${m.notes||"Estimates only — verify on site."}</p>
      </div>
    `;
  }catch(e){}
}
/* ============================
   QUOTES PAGE (MOCK)
============================ */
function renderQuotes(){
  const mockQuotes=[
    {contractor:"Sunrise Roofing Co.",price:"$12,400",timeline:"2–3 days",rating:"4.8",notes:"Includes tear‑off, disposal, upgraded underlayment."},
    {contractor:"Atlantic Coast Exteriors",price:"$11,900",timeline:"3–4 days",rating:"4.6",notes:"Standard shingles, 10‑year workmanship warranty."},
    {contractor:"Premier Peak Roofing",price:"$13,200",timeline:"2 days",rating:"4.9",notes:"Premium shingles, ridge vent upgrade, extended warranty."}
  ];

  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>AI‑Generated Quotes</h1>
        <p>These sample quotes show how contractors will respond to your roof report.</p>
      </header>

      <div class="card">
        <div class="card-header"><h3 class="card-title">Quote Comparison</h3></div>
        <div class="quotes-grid">
          ${mockQuotes.map(q=>`
            <article class="quote-card">
              <h3>${q.contractor}</h3>
              <p class="quote-price">${q.price}</p>
              <p><strong>Timeline:</strong> ${q.timeline}</p>
              <p><strong>Rating:</strong> ⭐ ${q.rating}</p>
              <p class="card-subtitle">${q.notes}</p>
              <button class="btn-secondary" disabled>Request Quote (demo)</button>
            </article>
          `).join("")}
        </div>
      </div>
    </section>
  `);
}

/* ============================
   LOGIN PAGE
============================ */
function renderLogin(){
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
            <p class="card-subtitle">No passwords — we’ll email you a secure link.</p>
          </div>

          <div class="form-field">
            <label>Work Email</label>
            <input id="login-email" type="email" placeholder="you@roofingcompany.com" />
          </div>

          <div class="form-actions">
            <button class="btn-primary">Send Login Link</button>
          </div>
        </form>

        <div class="card">
          <div class="card-header"><h3 class="card-title">Why Magic Links?</h3></div>
          <p class="card-subtitle">Crews move fast. Passwords slow them down.</p>
          <ul class="detail-list">
            <li>Fast and secure</li>
            <li>No passwords to remember</li>
            <li>Works on any device</li>
          </ul>
        </div>
      </div>
    </section>
  `);

  const form=document.getElementById("login-form");
  form.onsubmit=async(e)=>{
    e.preventDefault();
    const email=document.getElementById("login-email").value.trim();
    if(!email){alert("Enter your email");return;}

    try{
      await fetch("/functions/request-login-code",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email})
      });
      alert("Demo login — redirecting to dashboard.");
      navigate("/dashboard");
    }catch(err){
      alert("Unable to send login link.");
    }
  };
}
/* ============================
   DASHBOARD (MOCK)
============================ */
function renderDashboard(){
  const mockLeads=[
    {name:"123 Oak St",status:"New",value:"$12,400"},
    {name:"45 Pine Ave",status:"Quoted",value:"$9,800"},
    {name:"78 Maple Dr",status:"Won",value:"$14,200"}
  ];
   function renderDashboard(){
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Contractor Dashboard</h1>
        <p>At‑a‑glance view of your pipeline and performance.</p>
      </header>
  `);
}
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
      <tr><td>123 Oak St</td><td>New</td><td>$12,400</td></tr>
      <tr><td>45 Pine Ave</td><td>Quoted</td><td>$9,800</td></tr>
      <tr><td>78 Maple Dr</td><td>Won</td><td>$14,200</td></tr>
    </tbody>
  </table>
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
      <tr><td>123 Oak St</td><td>New</td><td>$12,400</td></tr>
      <tr><td>45 Pine Ave</td><td>Quoted</td><td>$9,800</td></tr>
      <tr><td>78 Maple Dr</td><td>Won</td><td>$14,200</td></tr>
    </tbody>
  </table>
</div>
</section> `); }
   /* ============================
   LEADERBOARD PAGE
============================ */
function renderLeaderboard(){
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Contractor Leaderboard</h1>
        <p>Top performers based on close rate, job size, and customer satisfaction.</p>
      </header>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Top Contractors</h3>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Company</th>
              <th>Close Rate</th>
              <th>Avg. Job Size</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#1</td>
              <td>Premier Peak Roofing</td>
              <td>54%</td>
              <td>$14,200</td>
              <td>⭐ 4.9</td>
            </tr>
            <tr>
              <td>#2</td>
              <td>Sunrise Roofing Co.</td>
              <td>49%</td>
              <td>$12,800</td>
              <td>⭐ 4.8</td>
            </tr>
            <tr>
              <td>#3</td>
              <td>Atlantic Coast Exteriors</td>
              <td>46%</td>
              <td>$11,900</td>
              <td>⭐ 4.6</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `);
}
/* ============================
   BILLING PAGE
============================ */
function renderBilling(){
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Billing & Subscription</h1>
        <p>Manage your plan, usage, and payment details.</p>
      </header>

      <div class="grid-2">

        <!-- Current Plan -->
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

          <div class="form-actions" style="margin-top:16px;">
            <button class="btn-secondary" disabled>Manage Payment (demo)</button>
          </div>
        </div>

        <!-- Usage Summary -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Usage Summary</h3>
            <p class="card-subtitle">Your activity this billing cycle.</p>
          </div>

          <ul class="detail-list">
            <li><strong>Leads Received:</strong> 18</li>
            <li><strong>Quotes Sent:</strong> 12</li>
            <li><strong>Reports Downloaded:</strong> 7</li>
            <li><strong>AI Analyses:</strong> Unlimited</li>
          </ul>
        </div>

      </div>

      <!-- Upgrade Options -->
      <div class="card" style="margin-top:24px;">
        <div class="card-header">
          <h3 class="card-title">Upgrade Options</h3>
          <p class="card-subtitle">Scale your business with higher‑tier plans.</p>
        </div>

        <div class="grid-3">

          <div class="card">
            <h3 class="card-title">Starter</h3>
            <p class="stat-value">$79/mo</p>
            <ul class="detail-list">
              <li>Up to 10 leads</li>
              <li>Basic analytics</li>
              <li>Email support</li>
            </ul>
            <button class="btn-secondary" disabled>Select (demo)</button>
          </div>

          <div class="card">
            <h3 class="card-title">Pro Contractor</h3>
            <p class="stat-value">$149/mo</p>
            <ul class="detail-list">
              <li>Unlimited leads</li>
              <li>AI takeoffs</li>
              <li>Priority support</li>
            </ul>
            <button class="btn-primary" disabled>Current Plan</button>
          </div>

          <div class="card">
            <h3 class="card-title">Enterprise</h3>
            <p class="stat-value">$299/mo</p>
            <ul class="detail-list">
              <li>Multi‑crew support</li>
              <li>Custom integrations</li>
              <li>Dedicated rep</li>
            </ul>
            <button class="btn-secondary" disabled>Contact Sales (demo)</button>
          </div>

        </div>
      </div>

    </section>
  `);
}
/* ============================
   ADMIN PAGE
============================ */
function renderAdmin(){
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Admin Console</h1>
        <p>Manage users, system settings, and platform activity.</p>
      </header>

      <div class="grid-2">

        <!-- User Management -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">User Management</h3>
            <p class="card-subtitle">Active contractors on the platform.</p>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Status</th>
                <th>Plan</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Premier Peak Roofing</td>
                <td>Active</td>
                <td>Pro</td>
              </tr>
              <tr>
                <td>Sunrise Roofing Co.</td>
                <td>Active</td>
                <td>Starter</td>
              </tr>
              <tr>
                <td>Atlantic Coast Exteriors</td>
                <td>Suspended</td>
                <td>Pro</td>
              </tr>
            </tbody>
          </table>

          <div class="form-actions" style="margin-top:12px;">
            <button class="btn-secondary" disabled>Manage Users (demo)</button>
          </div>
        </div>

        <!-- System Metrics -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">System Metrics</h3>
            <p class="card-subtitle">Platform‑wide performance indicators.</p>
          </div>

          <ul class="detail-list">
            <li><strong>AI Analyses Today:</strong> 142</li>
            <li><strong>Active Sessions:</strong> 58</li>
            <li><strong>API Latency:</strong> 182 ms avg</li>
            <li><strong>Error Rate:</strong> 0.4%</li>
          </ul>
        </div>

      </div>

      <!-- Feature Toggles -->
      <div class="card" style="margin-top:24px;">
        <div class="card-header">
          <h3 class="card-title">Feature Toggles</h3>
          <p class="card-subtitle">Enable or disable experimental features.</p>
        </div>

        <ul class="detail-list">
          <li><strong>AI Damage Heatmap:</strong> Enabled</li>
          <li><strong>Contractor Chat:</strong> Disabled</li>
          <li><strong>Auto‑Generated Quotes:</strong> Enabled</li>
        </ul>

        <div class="form-actions" style="margin-top:12px;">
          <button class="btn-secondary" disabled>Modify Features (demo)</button>
        </div>
      </div>

      <!-- Audit Log -->
      <div class="card" style="margin-top:24px;">
        <div class="card-header">
          <h3 class="card-title">Recent Activity</h3>
          <p class="card-subtitle">System‑level events and admin actions.</p>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Event</th>
              <th>User</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Updated feature flags</td>
              <td>admin@roofing.com</td>
              <td>2 hours ago</td>
            </tr>
            <tr>
              <td>Suspended contractor account</td>
              <td>admin@roofing.com</td>
              <td>5 hours ago</td>
            </tr>
            <tr>
              <td>Generated platform report</td>
              <td>system</td>
              <td>Yesterday</td>
            </tr>
          </tbody>
        </table>
      </div>

    </section>
  `);
}
/* ============================
   INSIGHTS PAGE
============================ */
function renderInsights(){
  mount(`
    <section class="page-container fade-in-up">
      <header class="page-header">
        <h1>Performance Insights</h1>
        <p>AI‑powered analytics to help you understand your roofing business.</p>
      </header>

      <!-- Trend Cards -->
      <div class="grid-3">
        <div class="card stat-card">
          <h3>Lead Growth</h3>
          <p class="stat-value">+18%</p>
          <p class="stat-sub">vs last 30 days</p>
        </div>

        <div class="card stat-card">
          <h3>Quote Acceptance</h3>
          <p class="stat-value">42%</p>
          <p class="stat-sub">Steady performance</p>
        </div>

        <div class="card stat-card">
          <h3>Avg. Response Time</h3>
          <p class="stat-value">1.8 hrs</p>
          <p class="stat-sub">Faster than competitors</p>
        </div>
      </div>

      <!-- Insights Summary -->
      <div class="card" style="margin-top:24px;">
        <div class="card-header">
          <h3 class="card-title">AI Summary</h3>
          <p class="card-subtitle">Key insights generated from your recent activity.</p>
        </div>

        <ul class="detail-list">
          <li>Your close rate improves significantly when quotes are sent within 2 hours.</li>
          <li>Homes built before 1990 show a 23% higher likelihood of needing full replacement.</li>
          <li>Premium shingles lead to a 12% increase in accepted quotes.</li>
          <li>Repeat customers generate 28% higher average job value.</li>
        </ul>
      </div>

      <!-- Performance Table -->
      <div class="card" style="margin-top:24px;">
        <div class="card-header">
          <h3 class="card-title">Recent Performance Metrics</h3>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
              <th>Trend</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Lead Conversion</td>
              <td>41%</td>
              <td>▲ Improving</td>
            </tr>
            <tr>
              <td>Quote Turnaround</td>
              <td>1.8 hrs</td>
              <td>▲ Improving</td>
            </tr>
            <tr>
              <td>Avg. Job Size</td>
              <td>$11,900</td>
              <td>▶ Stable</td>
            </tr>
            <tr>
              <td>Customer Rating</td>
              <td>4.7 / 5</td>
              <td>▲ Improving</td>
            </tr>
          </tbody>
        </table>
      </div>

    </section>
  `);
}
/* ============================
   ROUTER BOOTSTRAP
============================ */
function startRouter(){
  const load=()=> {
    const route=getRoute();
    const fn=routes[route];
    if(typeof fn==="function") fn();
  };

  window.addEventListener("hashchange", load);
  load();
}

/* ============================
   APP INIT
============================ */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  startRouter();
});
