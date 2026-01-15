const state = {
    user: { id: "roofer1", role: "roofer" }, // placeholder
    role: "roofer",
    roofProfile: null,
    quotes: [],
    materialsLists: {},
    pricingModels: {},
    currentLead: null,
    view: "home"
};

window.addEventListener("hashchange", () => {
    const route = location.hash.replace("#", "");
    renderView(route);
});

document.addEventListener("DOMContentLoaded", () => {
    const route = location.hash.replace("#", "") || "home";
    renderView(route);
});

function renderView(view) {
    state.view = view;
    const app = document.getElementById("view");

    switch (view) {
        case "home":
            app.innerHTML = homeView();
            break;
        case "client-intake":
            app.innerHTML = clientIntakeView();
            break;
        case "processing":
            app.innerHTML = processingView();
            break;
        case "quote-results":
            app.innerHTML = quoteResultsView();
            break;
        case "roofer-dashboard":
            app.innerHTML = rooferDashboardView();
            loadRooferDashboard();
            break;
        case "pricing-model":
            app.innerHTML = pricingModelEditorView();
            break;
        case "admin":
            app.innerHTML = adminView();
            loadAdminData();
            break;
        default:
            app.innerHTML = `<h2>Page not found</h2>`;
    }
}

function homeView() {
    return `
        <div class="home">
            <h1>Roofing Marketplace</h1>
            <p>Instant multi‑roofer quotes powered by AI roof detection.</p>
            <button onclick="location.hash='client-intake'">Get My Roof Quote</button>
        </div>
    `;
}

function clientIntakeView() {
    return `
        <div class="intake card">
            <h2>Your Roof Details</h2>
            <label>Address</label>
            <input id="address" type="text">

            <label>Material Preference</label>
            <select id="material">
                <option value="shingle">Shingle</option>
                <option value="metal">Metal</option>
                <option value="tile">Tile</option>
            </select>

            <label>Upload Photos</label>
            <input id="photos" type="file" multiple>

            <button onclick="submitIntake()">Analyze My Roof</button>
        </div>
    `;
}

function processingView() {
    return `
        <div class="processing">
            <h2>Analyzing your roof…</h2>
            <p>This usually takes 10–20 seconds.</p>
        </div>
    `;
}

function quoteResultsView() {
    return `
        <div class="quotes">
            <h2>Your Quotes</h2>
            ${state.quotes.map(q => `
                <div class="quote-card">
                    <h3>${q.rooferName}</h3>
                    <p><strong>Price:</strong> $${q.totalPrice}</p>
                    <p><strong>Materials:</strong> $${q.materialsCost}</p>
                    <p><strong>Labor:</strong> $${q.laborCost}</p>
                    <button onclick="viewMaterials('${q.rooferId}')">View Materials List</button>
                </div>
            `).join("")}
        </div>
    `;
}

function rooferDashboardView() {
    return `
        <div class="roofer-dashboard">
            <h2>Roofer Dashboard</h2>
            <div id="roofer-leads"></div>
        </div>
    `;
}

function adminView() {
    return `
        <div class="admin">
            <h2>Admin Panel</h2>
            <div id="admin-data"></div>
        </div>
    `;
}

function pricingModelEditorView() {
    const pm = state.pricingModels[state.user?.id] || {
        basePricePerSquare: 350,
        materialMultipliers: { shingle: 1, metal: 1.3, tile: 1.6 },
        pitchMultipliers: { low: 1, medium: 1.15, steep: 1.3 },
        complexityMultipliers: { simple: 1, medium: 1.2, complex: 1.4 },
        tearOffMultiplier: 1.1,
        wasteFactor: 0.12,
        minimumJobPrice: 5000
    };

    return `
        <div class="card">
            <h2>Pricing Model Editor</h2>

            <label>Base Price Per Square ($)</label>
            <input id="pm-base" type="number" value="${pm.basePricePerSquare}">

            <h3>Material Multipliers</h3>
            <label>Shingle</label>
            <input id="pm-mat-shingle" type="number" value="${pm.materialMultipliers.shingle}">
            <label>Metal</label>
            <input id="pm-mat-metal" type="number" value="${pm.materialMultipliers.metal}">
            <label>Tile</label>
            <input id="pm-mat-tile" type="number" value="${pm.materialMultipliers.tile}">

            <h3>Pitch Multipliers</h3>
            <label>Low Pitch</label>
            <input id="pm-pitch-low" type="number" value="${pm.pitchMultipliers.low}">
            <label>Medium Pitch</label>
            <input id="pm-pitch-medium" type="number" value="${pm.pitchMultipliers.medium}">
            <label>Steep Pitch</label>
            <input id="pm-pitch-steep" type="number" value="${pm.pitchMultipliers.steep}">

            <h3>Complexity Multipliers</h3>
            <label>Simple</label>
            <input id="pm-comp-simple" type="number" value="${pm.complexityMultipliers.simple}">
            <label>Medium</label>
            <input id="pm-comp-medium" type="number" value="${pm.complexityMultipliers.medium}">
            <label>Complex</label>
            <input id="pm-comp-complex" type="number" value="${pm.complexityMultipliers.complex}">

            <label>Tear‑Off Multiplier</label>
            <input id="pm-tearoff" type="number" value="${pm.tearOffMultiplier}">

            <label>Waste Factor (0.10 = 10%)</label>
            <input id="pm-waste" type="number" value="${pm.wasteFactor}">

            <label>Minimum Job Price ($)</label>
            <input id="pm-minjob" type="number" value="${pm.minimumJobPrice}">

            <button onclick="savePricingModel()">Save Pricing Model</button>
        </div>
    `;
}

async function submitIntake() {
    const address = document.getElementById("address").value;
    const material = document.getElementById("material").value;
    const photos = document.getElementById("photos").files;

    if (!address || photos.length === 0) {
        alert("Please enter an address and upload photos.");
        return;
    }

    location.hash = "processing";

    const formData = new FormData();
    for (let p of photos) formData.append("photos", p);

    const photoRes = await fetch("/functions/ai-fusion", {
        method: "POST",
        body: formData
    });

    const roofProfile = await photoRes.json();
    state.roofProfile = roofProfile;

    const quoteRes = await fetch("/functions/generate-quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            roofProfile,
            material
        })
    });

    const quotes = await quoteRes.json();
    state.quotes = quotes;

    location.hash = "quote-results";
}

async function viewMaterials(rooferId) {
    if (!state.materialsLists[rooferId]) {
        const res = await fetch("/functions/materials-list", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                rooferId,
                roofProfile: state.roofProfile
            })
        });

        state.materialsLists[rooferId] = await res.json();
    }

    alert(JSON.stringify(state.materialsLists[rooferId], null, 2));
}

async function loadRooferDashboard() {
    const res = await fetch("/functions/get-roofer-leads");
    const leads = await res.json();

    document.getElementById("roofer-leads").innerHTML = leads.map(l => `
        <div class="lead-card">
            <h3>${l.address}</h3>
            <p>${l.material}</p>
            <button onclick="openLead('${l.id}')">Open</button>
        </div>
    `).join("");
}

async function loadAdminData() {
    const res = await fetch("/functions/admin-data");
    const data = await res.json();

    document.getElementById("admin-data").innerHTML = `
        <pre>${JSON.stringify(data, null, 2)}</pre>
    `;
}

async function savePricingModel() {
    const model = {
        rooferId: state.user?.id || "roofer1",
        basePricePerSquare: Number(document.getElementById("pm-base").value),
        materialMultipliers: {
            shingle: Number(document.getElementById("pm-mat-shingle").value),
            metal: Number(document.getElementById("pm-mat-metal").value),
            tile: Number(document.getElementById("pm-mat-tile").value)
        },
        pitchMultipliers: {
            low: Number(document.getElementById("pm-pitch-low").value),
            medium: Number(document.getElementById("pm-pitch-medium").value),
            steep: Number(document.getElementById("pm-pitch-steep").value)
        },
        complexityMultipliers: {
            simple: Number(document.getElementById("pm-comp-simple").value),
            medium: Number(document.getElementById("pm-comp-medium").value),
            complex: Number(document.getElementById("pm-comp-complex").value)
        },
        tearOffMultiplier: Number(document.getElementById("pm-tearoff").value),
        wasteFactor: Number(document.getElementById("pm-waste").value),
        minimumJobPrice: Number(document.getElementById("pm-minjob").value)
    };

    const res = await fetch("/functions/save-pricing-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(model)
    });

    await res.json();
    alert("Pricing model saved successfully.");
}
