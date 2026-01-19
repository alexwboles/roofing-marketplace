// ---------------------------------------------------------
// SPA ROUTER
// ---------------------------------------------------------
window.addEventListener("hashchange", router)
window.addEventListener("load", router)

async function router() {
    const hash = location.hash || "#/login"

    if (hash === "#/login") return loginView()
    if (hash === "#/verify") return verifyView()
    if (hash === "#/dashboard") return dashboardView()
    if (hash === "#/intake") return intakeView()
    if (hash === "#/quotes") return quotesView()
    if (hash === "#/leaderboard") return leaderboardView()
    if (hash === "#/billing") return billingView()
    if (hash === "#/admin") return adminView()

    document.getElementById("app").innerHTML = "<h2>Not Found</h2>"
}

// ---------------------------------------------------------
// LOGIN VIEW
// ---------------------------------------------------------
function loginView() {
    document.getElementById("app").innerHTML = `
        <h2>Login</h2>
        <form id="loginForm">
            <input id="email" type="email" placeholder="Email" required />
            <button>Send Code</button>
        </form>
    `

    document.getElementById("loginForm").addEventListener("submit", async (e) => {
        e.preventDefault()
        const email = document.getElementById("email").value

        await fetch("/functions/request-login-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        })

        location.hash = "#/verify"
    })
}

// ---------------------------------------------------------
// VERIFY LOGIN CODE
// ---------------------------------------------------------
function verifyView() {
    document.getElementById("app").innerHTML = `
        <h2>Enter Login Code</h2>
        <form id="verifyForm">
            <input id="code" type="text" placeholder="Code" required />
            <button>Verify</button>
        </form>
    `

    document.getElementById("verifyForm").addEventListener("submit", async (e) => {
        e.preventDefault()
        const code = document.getElementById("code").value

        const res = await fetch("/functions/verify-login-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code })
        })

        if (res.ok) location.hash = "#/dashboard"
        else alert("Invalid code")
    })
}

// ---------------------------------------------------------
// DASHBOARD
// ---------------------------------------------------------
async function dashboardView() {
    document.getElementById("app").innerHTML = `
        <h2>Dashboard</h2>
        <button onclick="location.hash='#/intake'">New Roof Intake</button>
        <button onclick="location.hash='#/leaderboard'">Leaderboard</button>
        <button onclick="location.hash='#/billing'">Billing</button>
    `
}

// ---------------------------------------------------------
// INTAKE VIEW (AI-POWERED)
// ---------------------------------------------------------
function intakeView() {
    document.getElementById("app").innerHTML = `
        <h2>Roof Intake</h2>

        <form id="intakeForm">

            <label>Address</label>
            <input id="address" required />

            <label>Roof Type (auto-filled)</label>
            <input id="roofType" />

            <label>Pitch (degrees, auto-filled)</label>
            <input id="pitch" />

            <label>Square Feet (auto-filled)</label>
            <input id="squareFeet" />

            <label>Upload Roof Photos (up to 5)</label>
            <input id="roofPhotos" type="file" accept="image/*" multiple />

            <button>Analyze & Continue</button>
        </form>

        <div id="analyzingModal" class="modal hidden">
            <div class="modal-content">
                <h3>Analyzing Roof Photos…</h3>
                <p>This usually takes 5–10 seconds.</p>
            </div>
        </div>
    `

    document.getElementById("intakeForm").addEventListener("submit", analyzeIntake)
}

// ---------------------------------------------------------
// AI INTAKE LOGIC
// ---------------------------------------------------------
async function analyzeIntake(e) {
    e.preventDefault()

    const photos = document.getElementById("roofPhotos").files
    if (photos.length > 5) {
        alert("Please upload no more than 5 photos.")
        return
    }

    const modal = document.getElementById("analyzingModal")
    modal.classList.remove("hidden")

    // STEP 1 — Analyze photos
    const formData = new FormData()
    for (const p of photos) formData.append("photos", p)

    const analyzeRes = await fetch("/functions/analyze-multiple-roof-photos", {
        method: "POST",
        body: formData
    })
    const analyzeJson = await analyzeRes.json()

    // STEP 2 — Fuse with satellite
    const address = document.getElementById("address").value

    const fusionRes = await fetch("/functions/ai-fusion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            address,
            photoAnalysis: analyzeJson.photos
        })
    })
    const fusionJson = await fusionRes.json()
    const roof = fusionJson.fused

    // Auto-fill fields
    document.getElementById("roofType").value = roof.roofType || ""
    document.getElementById("pitch").value = roof.pitchDegrees || ""
    document.getElementById("squareFeet").value = roof.estimatedSqFt || ""

    // STEP 3 — Materials list
    const materialsRes = await fetch("/functions/materials-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roof })
    })
    const materialsJson = await materialsRes.json()

    // Store globally for quotes
    window.fusedRoofModel = roof
    window.generatedMaterials = materialsJson.materials

    modal.classList.add("hidden")

    alert("Roof analysis complete! Fields auto-filled.")
    location.hash = "#/quotes"
}

// ---------------------------------------------------------
// QUOTES VIEW
// ---------------------------------------------------------
async function quotesView() {
    const roof = window.fusedRoofModel
    const materials = window.generatedMaterials

    const res = await fetch("/functions/generate-quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            roof,
            materials
        })
    })

    const json = await res.json()

    document.getElementById("app").innerHTML = `
        <h2>Quotes</h2>
        ${json.quotes
            .map(
                q => `
            <div class="quote-card">
                <h3>${q.businessName}</h3>
                <p>Total: $${q.total}</p>
                <p>Material Cost: $${q.breakdown.materialCost}</p>
                <p>Labor: $${q.breakdown.labor}</p>
            </div>
        `
            )
            .join("")}
    `
}

// ---------------------------------------------------------
// LEADERBOARD
// ---------------------------------------------------------
async function leaderboardView() {
    const res = await fetch("/functions/contractor-leaderboard")
    const json = await res.json()

    document.getElementById("app").innerHTML = `
        <h2>Leaderboard</h2>
        ${json.leaderboard
            .map(
                row => `
            <div class="leader-row">
                <strong>${row.businessName}</strong>
                <span>${row.bids} bids</span>
                <span>$${row.totalAmount}</span>
            </div>
        `
            )
            .join("")}
    `
}

// ---------------------------------------------------------
// BILLING VIEW
// ---------------------------------------------------------
async function billingView() {
    const res = await fetch("/functions/billing-info")
    const json = await res.json()

    document.getElementById("app").innerHTML = `
        <h2>Billing</h2>
        <p>Plan: ${json.plan}</p>
        <p>Status: ${json.subscriptionStatus}</p>

        <button id="subscribeBtn">Subscribe</button>
        <button id="portalBtn">Manage Billing</button>
    `

    document.getElementById("subscribeBtn").onclick = async () => {
        const r = await fetch("/functions/create-checkout-session", { method: "POST" })
        const j = await r.json()
        location.href = j.url
    }

    document.getElementById("portalBtn").onclick = async () => {
        const r = await fetch("/functions/create-billing-portal-session", { method: "POST" })
        const j = await r.json()
        location.href = j.url
    }
}

// ---------------------------------------------------------
// ADMIN VIEW
// ---------------------------------------------------------
async function adminView() {
    const res = await fetch("/functions/admin-contractors")
    const json = await res.json()

    document.getElementById("app").innerHTML = `
        <h2>Admin — Contractors</h2>
        ${json.contractors
            .map(
                c => `
            <div class="contractor-row">
                <strong>${c.businessName}</strong>
                <span>${c.email}</span>
                <span>Status: ${c.verificationStatus}</span>
                <button onclick="approveContractor('${c.email}')">Approve</button>
                <button onclick="rejectContractor('${c.email}')">Reject</button>
            </div>
        `
            )
            .join("")}
    `
}

async function approveContractor(email) {
    await fetch("/functions/verify-contractor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractorEmail: email, status: "approved" })
    })
    adminView()
}

async function rejectContractor(email) {
    await fetch("/functions/verify-contractor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contractorEmail: email, status: "rejected" })
    })
    adminView()
}
