// ===============================
// SPA ROUTER
// ===============================

window.addEventListener("hashchange", router)
window.addEventListener("load", router)

function router() {
    const hash = window.location.hash.replace("#", "") || "home"
    const view = document.getElementById("view")

    switch (hash) {
        case "home":
            view.innerHTML = homeView()
            break

        case "intake":
            view.innerHTML = clientIntakeView()
            break

        case "processing":
            view.innerHTML = processingView()
            break

        case "quotes":
            view.innerHTML = quotesView()
            break

        case "roofer-dashboard":
            loadRooferDashboard()
            break

        case "roofer-signup":
            view.innerHTML = rooferSignupView()
            break

        case "admin":
            loadAdminData()
            break

        default:
            view.innerHTML = homeView()
    }
}

// ===============================
// HOME VIEW
// ===============================

function homeView() {
    return `
        <div class="home">
            <h1>Welcome to the Roofing Marketplace</h1>
            <p>Instant quotes. Verified contractors. Smart roofing decisions.</p>
            <button onclick="window.location.hash='intake'">Start Your Quote</button>
        </div>
    `
}

// ===============================
// CLIENT INTAKE VIEW
// ===============================

function clientIntakeView() {
    return `
        <div class="card">
            <h2>Get Your Instant Roofing Quote</h2>

            <div class="input-group">
                <input id="address" placeholder=" " />
                <label for="address">Address</label>
            </div>

            <div class="input-group">
                <input id="square-feet" placeholder=" " />
                <label for="square-feet">Roof Square Footage</label>
            </div>

            <div class="input-group">
                <select id="material">
                    <option value="">Select Material</option>
                    <option value="shingle">Shingle</option>
                    <option value="metal">Metal</option>
                </select>
                <label for="material">Roof Material</label>
            </div>

            <button onclick="submitIntake()">Get Quote</button>
        </div>
    `
}

// ===============================
// PROCESSING VIEW
// ===============================

function processingView() {
    return `
        <div class="processing">
            <h2>Analyzing Your Roof...</h2>
            <p>This usually takes less than 10 seconds.</p>
        </div>
    `
}

// ===============================
// QUOTES VIEW
// ===============================

function quotesView() {
    return `
        <div class="quotes">
            <h2>Your Quotes</h2>
            <div id="quote-results"></div>
        </div>
    `
}

// ===============================
// ROOFER DASHBOARD
// ===============================

function rooferDashboardView(leads) {
    return `
        <div class="card">
            <h2>Roofer Dashboard</h2>
            <button onclick="window.location.hash='roofer-signup'">
                Update Pricing / Contractor Profile
            </button>
        </div>

        <h3>Incoming Leads</h3>
        <div id="roofer-leads">
            ${leads
                .map(
                    (lead) => `
                <div class="lead-card">
                    <h3>${lead.address}</h3>
                    <p>Square Feet: ${lead.squareFeet}</p>
                    <p>Material: ${lead.material}</p>
                    <p>Needs Tear-Off: ${lead.tearoff ? "Yes" : "No"}</p>
                </div>
            `
                )
                .join("")}
        </div>
    `
}

async function loadRooferDashboard() {
    const view = document.getElementById("view")
    const res = await fetch("/functions/get-roofer-leads")
    const leads = await res.json()
    view.innerHTML = rooferDashboardView(leads)
}

// ===============================
// ROOFER SIGNUP / PRICING MODEL
// ===============================

function rooferSignupView() {
    return `
        <div class="card">
            <h2>Contractor Profile & Pricing</h2>
            <p>Update your business info and pricing model used for instant quotes.</p>

            <div class="input-group">
                <input id="roofer-name" placeholder=" " />
                <label for="roofer-name">Business Name</label>
            </div>

            <div class="input-group">
                <input id="roofer-email" placeholder=" " />
                <label for="roofer-email">Email</label>
            </div>

            <div class="input-group">
                <input id="roofer-phone" placeholder=" " />
                <label for="roofer-phone">Phone Number</label>
            </div>

            <div class="input-group">
                <input id="roofer-service-area" placeholder=" " />
                <label for="roofer-service-area">Service Area (ZIP codes)</label>
            </div>

            <h3>Pricing Model</h3>

            <div class="input-group">
                <input id="price-per-square" placeholder=" " />
                <label for="price-per-square">Price per Square Foot ($)</label>
            </div>

            <div class="input-group">
                <input id="tearoff-fee" placeholder=" " />
                <label for="tearoff-fee">Tear-Off Fee ($)</label>
            </div>

            <button onclick="submitRooferSignup()">Save Contractor Profile</button>
        </div>
    `
}

async function submitRooferSignup() {
    const roofer = {
        name: document.getElementById("roofer-name").value,
        email: document.getElementById("roofer-email").value,
        phone: document.getElementById("roofer-phone").value,
        serviceArea: document.getElementById("roofer-service-area").value,
        pricePerSquare: document.getElementById("price-per-square").value,
        tearoffFee: document.getElementById("tearoff-fee").value
    }

    const res = await fetch("/functions/save-pricing-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roofer)
    })

    if (res.ok) {
        alert("Contractor profile updated!")
        window.location.hash = "roofer-dashboard"
    } else {
        alert("There was an error saving your profile.")
    }
}

// ===============================
// ADMIN VIEW
// ===============================

async function loadAdminData() {
    const view = document.getElementById("view")
    const res = await fetch("/functions/admin-data")
    const data = await res.text()

    view.innerHTML = `
        <div class="card">
            <h2>Admin Panel</h2>
            <pre id="admin-data">${data}</pre>
        </div>
    `
}

