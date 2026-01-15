// Simple global store
const Store = {
  state: {
    view: "clientStep1",
    currentJob: {
      id: "job_123", // stub until real DB
    },
    quotes: [],
    rooferPricing: null,
    role: "client" // 'client' or 'roofer'
  },
  set(patch) {
    this.state = { ...this.state, ...patch };
    render();
  }
};

window.navigate = navigate;
window.saveRooferPricing = saveRooferPricing;
window.fetchQuotesForCurrentJob = fetchQuotesForCurrentJob;
window.handlePhotoSelection = handlePhotoSelection;
window.handlePhotoDrop = handlePhotoDrop;
window.selectQuote = selectQuote;
window.openConversation = openConversation;
window.startStep2 = startStep2;
window.startQuotes = startQuotes;

// Router
function navigate(view) {
  Store.set({ view });
}

// Toast helper
let toastTimeout;
function showToast(message, type = "info") {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.className = "toast visible";
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    el.className = "toast";
  }, 2200);
}

// Stepper
function Stepper(activeIndex) {
  const steps = [
    { label: "Roof details" },
    { label: "Address" },
    { label: "Quotes" }
  ];
  return `
    <div class="stepper">
      ${steps
        .map(
          (s, i) => `
        <div class="step-pill ${activeIndex === i ? "active" : ""}">
          <span>${i + 1}.</span> <span>${s.label}</span>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

// Top nav
function TopNav(state) {
  const role = state.role || "client";
  return `
    <div class="top-nav">
      <div class="brand">
        <div class="brand-logo">R</div>
        <div class="brand-name">Roofing Marketplace</div>
      </div>
      <div class="nav-links">
        <button class="nav-link ${state.view.startsWith("client") || state.view === "quotes" ? "active" : ""}"
          onclick="Store.set({role:'client'});navigate('clientStep1')">
          Client
        </button>
        <button class="nav-link ${state.view.startsWith("roofer") ? "active" : ""}"
          onclick="Store.set({role:'roofer'});navigate('rooferDashboard')">
          Roofer
        </button>
      </div>
    </div>
  `;
}

// Root render
function render() {
  const root = document.getElementById("app");
  const state = Store.state;
  const viewName = state.view;

  let viewHtml = "";
  if (viewName === "clientStep1") viewHtml = ClientStep1(state);
  else if (viewName === "clientStep2") viewHtml = ClientStep2(state);
  else if (viewName === "quotes") viewHtml = QuotesView(state);
  else if (viewName === "rooferDashboard") viewHtml = RooferDashboardView(state);
  else viewHtml = `<div class="view-inner"><p>Unknown view.</p></div>`;

  root.innerHTML = `
    <div class="app-shell">
      ${TopNav(state)}
      ${viewHtml}
    </div>
  `;
}

// ==== Client Flow Step 1 – Roof Details + Photos ====

let uploadedPhotos = [];

function ClientStep1(state) {
  const job = state.currentJob || {};
  return `
    <div class="view-inner">
      ${Stepper(0)}

      <h2>Tell us about your roof</h2>
      <p style="color:var(--text-muted);max-width:520px;font-size:13px;">
        Start with a few basics and upload roof photos. Our AI will help estimate roof type, pitch, and size.
      </p>

      <div class="select-modern">
        <label>Roof pitch</label>
        <select id="pitch">
          <option value="low">Low pitch</option>
          <option value="medium" selected>Medium pitch</option>
          <option value="high">High pitch</option>
        </select>
      </div>

      <div class="select-modern">
        <label>Preferred material</label>
        <select id="material">
          <option value="asphalt" selected>Asphalt shingle</option>
          <option value="metal">Metal roofing</option>
          <option value="tile">Tile roofing</option>
        </select>
      </div>

      <div class="select-modern">
        <label>Tear-off needed?</label>
        <select id="tearoff">
          <option value="no">No</option>
          <option value="yes">Yes, tear-off needed</option>
        </select>
      </div>

      <div class="input-modern">
        <label>Total square footage (optional)</label>
        <input id="manualSqft" type="number" placeholder="e.g., 2400" />
      </div>

      <div class="input-modern">
        <label>Upload roof photos (optional)</label>

        <div class="photo-dropzone"
             ondragover="event.preventDefault()"
             ondrop="handlePhotoDrop(event)"
             onclick="document.getElementById('roofPhotos').click()">
          <div class="photo-dropzone-inner">
            <div class="photo-dropzone-icon">📸</div>
            <div>Drag & drop photos here<br/>
              <span style="font-size:11px;color:var(--text-muted);">
                or click to browse
              </span>
            </div>
          </div>
          <input id="roofPhotos"
                 type="file"
                 accept="image/*"
                 multiple
                 onchange="handlePhotoSelection(event)"
                 style="display:none;" />
        </div>

        <div id="photoPreviewGrid" class="photo-preview-grid"></div>
        <div id="photoAnalysisResult" style="margin-top:6px;font-size:11px;color:var(--text-muted);"></div>
      </div>

      <div style="margin-top:16px;display:flex;justify-content:flex-end;">
        <button class="btn-modern" onclick="startStep2()">Next: Address</button>
      </div>
    </div>
  `;
}

function handlePhotoSelection(event) {
  const files = Array.from(event.target.files || []);
  processPhotos(files);
}

function handlePhotoDrop(event) {
  event.preventDefault();
  const files = Array.from(event.dataTransfer.files || []);
  processPhotos(files);
}

function processPhotos(files) {
  files.forEach(file => {
    if (!file.type.startsWith("image/")) return;
    uploadedPhotos.push(file);
  });
  renderPhotoPreviews();
  if (uploadedPhotos.length) {
    analyzePhotos(uploadedPhotos);
  }
}

function renderPhotoPreviews() {
  const grid = document.getElementById("photoPreviewGrid");
  if (!grid) return;
  grid.innerHTML = uploadedPhotos
    .map(file => {
      const url = URL.createObjectURL(file);
      return `<img src="${url}" alt="roof photo" />`;
    })
    .join("");
}

function fileToBase64(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

async function analyzePhotos(files) {
  const resultBox = document.getElementById("photoAnalysisResult");
  if (resultBox) resultBox.textContent = "Analyzing photos…";

  try {
    const base64Images = await Promise.all(files.map(fileToBase64));

    const res = await fetch("/api/analyze-multiple-roof-photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: base64Images })
    });

    const data = await res.json();

    if (data.roof_type) {
      const matEl = document.getElementById("material");
      if (matEl) matEl.value = data.roof_type;
    }
    if (data.pitch) {
      const pitchEl = document.getElementById("pitch");
      if (pitchEl) pitchEl.value = data.pitch;
    }
    if (data.estimated_sqft) {
      const sqftEl = document.getElementById("manualSqft");
      if (sqftEl) sqftEl.value = data.estimated_sqft;
    }

    if (resultBox) {
      resultBox.innerHTML = `
        <strong>AI analysis complete.</strong><br/>
        Roof type: ${data.roof_type || "unknown"} ·
        Pitch: ${data.pitch || "N/A"} ·
        Estimated sqft: ${data.estimated_sqft || "N/A"}
      `;
    }

    showToast("Photos analyzed (stubbed).", "success");
  } catch (e) {
    console.error(e);
    if (resultBox) resultBox.textContent = "Could not analyze photos.";
    showToast("Photo analysis failed.", "error");
  }
}

function startStep2() {
  const pitch = document.getElementById("pitch").value;
  const material = document.getElementById("material").value;
  const tearoff = document.getElementById("tearoff").value === "yes";
  const manualSqft = parseInt(document.getElementById("manualSqft").value || "0", 10);

  Store.set({
    currentJob: {
      ...(Store.state.currentJob || {}),
      pitch,
      material,
      tearoff,
      manualSqft
    },
    view: "clientStep2"
  });
}

// ==== Client Flow Step 2 – Address ====

function ClientStep2(state) {
  const job = state.currentJob || {};
  return `
    <div class="view-inner">
      ${Stepper(1)}

      <h2>Where is your roof located?</h2>
      <p style="color:var(--text-muted);max-width:520px;font-size:13px;">
        We’ll match you with roofers who serve your area.
      </p>

      <div class="input-modern">
        <label>Street address</label>
        <input id="address" type="text" placeholder="123 Main St" value="${job.address || ""}" />
      </div>

      <div class="input-modern">
        <label>City</label>
        <input id="city" type="text" placeholder="St. Augustine" value="${job.city || ""}" />
      </div>

      <div class="input-modern">
        <label>State</label>
        <input id="state" type="text" placeholder="FL" value="${job.state || ""}" />
      </div>

      <div class="input-modern">
        <label>ZIP</label>
        <input id="zip" type="text" placeholder="32084" value="${job.zip || ""}" />
      </div>

      <div style="margin-top:16px;display:flex;justify-content:space-between;">
        <button class="btn-ghost" onclick="navigate('clientStep1')">Back</button>
        <button class="btn-modern" onclick="startQuotes()">View quotes</button>
      </div>
    </div>
  `;
}

function startQuotes() {
  const address = document.getElementById("address").value;
  const city = document.getElementById("city").value;
  const stateVal = document.getElementById("state").value;
  const zip = document.getElementById("zip").value;

  const existing = Store.state.currentJob || {};
  const finalSqft =
    existing.manualSqft && existing.manualSqft > 0
      ? existing.manualSqft
      : 2400;

  Store.set({
    currentJob: {
      ...existing,
      address,
      city,
      state: stateVal,
      zip,
      finalSqft
    },
    view: "quotes"
  });

  fetchQuotesForCurrentJob();
}

// ==== Quotes View ====

function QuotesView(state) {
  const job = state.currentJob || {};
  const quotes = state.quotes || [];

  return `
    <div class="view-inner">
      ${Stepper(2)}

      <h2>Compare roof quotes</h2>
      <p style="color:var(--text-muted);max-width:520px;font-size:13px;">
        Here are instant, AI-informed estimates from roofers who serve your area.
      </p>

      <div class="job-summary-card">
        <div><strong>Address:</strong> ${job.address || "Pending"}</div>
        <div><strong>Estimated sqft:</strong> ${job.finalSqft || "N/A"}</div>
        <div><strong>Pitch:</strong> ${job.pitch || "N/A"}</div>
        <div><strong>Material:</strong> ${job.material || "N/A"}</div>
      </div>

      <div class="quotes-grid">
        ${
          quotes.length === 0
            ? `<div style="font-size:13px;color:var(--text-muted);">
                Generating quotes…
              </div>`
            : quotes.map(QuoteCard).join("")
        }
      </div>
    </div>
  `;
}

function QuoteCard(q) {
  const roofer = q.roofer || {};
  return `
    <div class="quote-card">
      <div class="quote-header">
        <div class="quote-roofer-name">${roofer.company_name || "Roofer"}</div>
        <div class="quote-price">$${q.total_price.toLocaleString()}</div>
      </div>
      <div class="quote-meta">
        <span>${roofer.rating ?? "N/A"}★</span>
        <span>${roofer.years_in_business || "?"} yrs</span>
        <span>${roofer.distance_miles || "?"} mi</span>
      </div>
      <div style="font-size:12px;">
        <div><strong>Labor:</strong> $${q.labor_cost.toLocaleString()}</div>
        <div><strong>Materials:</strong> $${q.material_cost.toLocaleString()}</div>
        <div><strong>Tear-off:</strong> $${q.tearoff_cost.toLocaleString()}</div>
      </div>
      <div class="quote-footer">
        <button class="btn-modern" onclick="selectQuote('${q.id}')">Select</button>
        <button class="btn-ghost" onclick="openConversation('${q.id}')">Message</button>
      </div>
    </div>
  `;
}

async function fetchQuotesForCurrentJob() {
  const job = Store.state.currentJob;
  if (!job || !job.id) {
    showToast("No job ID set (stub).", "error");
    return;
  }

  try {
    const res = await fetch("/api/generate-quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ job_id: job.id })
    });
    const data = await res.json();
    Store.set({ quotes: data.quotes || [] });
  } catch (e) {
    console.error(e);
    showToast("Failed to generate quotes.", "error");
  }
}

function selectQuote(quoteId) {
  showToast(`Selected quote ${quoteId}. (stub)`, "info");
}

function openConversation(quoteId) {
  showToast(`Open conversation for quote ${quoteId}. (stub)`, "info");
}

// ==== Roofer Dashboard ====

function RooferDashboardView(state) {
  const pricing =
    state.rooferPricing || {
      base_price_per_sqft: 4.0,
      pitch_multipliers: { low: 1.0, medium: 1.15, high: 1.3 },
      material_multipliers: { asphalt: 1.0, metal: 1.4, tile: 1.6 },
      tearoff_multiplier: 1.2,
      minimum_job_price: 6500
    };

  return `
    <div class="view-inner">
      <h2>Roofer dashboard</h2>
      <p style="color:var(--text-muted);font-size:13px;">
        Configure your pricing model. Clients will see instant estimates based on your rules.
      </p>

      <div class="card">
        <h3 style="margin-top:0;margin-bottom:6px;font-size:14px;">Pricing model</h3>

        <div class="pricing-grid">
          <div>
            <label>Base price per sqft</label>
            <input id="basePriceSqft" type="number" step="0.1" value="${pricing.base_price_per_sqft}" />
          </div>

          <div>
            <label>Pitch – Low</label>
            <input id="pitchLow" type="number" step="0.05" value="${pricing.pitch_multipliers.low}" />
          </div>
          <div>
            <label>Pitch – Medium</label>
            <input id="pitchMed" type="number" step="0.05" value="${pricing.pitch_multipliers.medium}" />
          </div>
          <div>
            <label>Pitch – High</label>
            <input id="pitchHigh" type="number" step="0.05" value="${pricing.pitch_multipliers.high}" />
          </div>

          <div>
            <label>Material – Asphalt</label>
            <input id="matAsphalt" type="number" step="0.05" value="${pricing.material_multipliers.asphalt}" />
          </div>
          <div>
            <label>Material – Metal</label>
            <input id="matMetal" type="number" step="0.05" value="${pricing.material_multipliers.metal}" />
          </div>
          <div>
            <label>Material – Tile</label>
            <input id="matTile" type="number" step="0.05" value="${pricing.material_multipliers.tile}" />
          </div>

          <div>
            <label>Tear-off multiplier</label>
            <input id="tearoffMult" type="number" step="0.05" value="${pricing.tearoff_multiplier}" />
          </div>

          <div>
            <label>Minimum job price</label>
            <input id="minJobPrice" type="number" value="${pricing.minimum_job_price}" />
          </div>
        </div>

        <button class="btn-modern" onclick="saveRooferPricing()">Save pricing</button>
      </div>
    </div>
  `;
}

async function saveRooferPricing() {
  const body = {
    base_price_per_sqft: parseFloat(document.getElementById("basePriceSqft").value),
    pitch_multipliers: {
      low: parseFloat(document.getElementById("pitchLow").value),
      medium: parseFloat(document.getElementById("pitchMed").value),
      high: parseFloat(document.getElementById("pitchHigh").value)
    },
    material_multipliers: {
      asphalt: parseFloat(document.getElementById("matAsphalt").value),
      metal: parseFloat(document.getElementById("matMetal").value),
      tile: parseFloat(document.getElementById("matTile").value)
    },
    tearoff_multiplier: parseFloat(document.getElementById("tearoffMult").value),
    minimum_job_price: parseInt(document.getElementById("minJobPrice").value || "0", 10)
  };

  try {
    const res = await fetch("/api/save-pricing-model", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (res.ok) {
      Store.set({ rooferPricing: body });
      showToast("Pricing saved (stub).", "success");
    } else {
      showToast(data.error || "Failed to save pricing.", "error");
    }
  } catch (e) {
    console.error(e);
    showToast("Failed to save pricing.", "error");
  }
}

// Initial render
render();

