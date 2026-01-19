/******************************************************
 * ROUTER
 ******************************************************/

window.addEventListener("hashchange", router)
window.addEventListener("load", router)

async function router() {
    const hash = window.location.hash.replace("#", "") || "home"
    const view = document.getElementById("view")

    const me = await fetchJSON("/functions/me")

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

        case "user-login":
            view.innerHTML = userLoginView()
            break

        case "client-login":
            view.innerHTML = clientLoginView()
            break

        case "roofer-dashboard":
            await requireContractor(me)
            await loadRooferDashboard()
            break

        case "contractor-profile":
            await requireContractor(me)
            await loadContractorProfile()
            break

        case "billing":
            await requireContractor(me)
            await loadBilling()
            break

        case "admin":
            await loadAdminData()
            break

        case "leaderboard":
            await loadLeaderboard()
            break

        default:
            view.innerHTML = homeView()
    }
}

async function requireLogin(me) {
    if (!me.loggedIn) {
        window.location.hash = "user-login"
        throw new Error("Not logged in")
    }
}

async function requireContractor(me) {
    await requireLogin(me)
    if (me.type !== "contractor") {
        alert("Contractor account required")
        window.location.hash = "user-login"
        throw new Error("Not contractor")
    }
}

/******************************************************
 * AUTH VIEWS
 ******************************************************/

function userLoginView() {
    return `
        <div class="card">
            <h2>User Login</h2>

            <div class="input-group">
                <input id="login-email" placeholder=" " />
                <label>Email</label>
            </div>

            <select id="login-type" class="input-group">
                <option value="contractor">Contractor</option>
                <option value="client">Client</option>
            </select>

            <button onclick="requestLoginCode()">Send Login Code</button>

            <div id="login-step-2" style="display:none; margin-top:20px;">
                <div class="input-group">
                    <input id="login-code" placeholder=" " />
                    <label>Enter Code</label>
                </div>
                <button onclick="verifyLoginCode()">Verify Code</button>
            </div>
        </div>
    `
}

async function requestLoginCode() {
    const email = document.getElementById("login-email").value
    const type = document.getElementById("login-type").value

    await postJSON("/functions/request-login-code", { email, type })
    document.getElementById("login-step-2").style.display = "block"
}

async function verifyLoginCode() {
    const email = document.getElementById("login-email").value
    const code = document.getElementById("login-code").value
    const type = document.getElementById("login-type").value

    const res = await postJSON("/functions/verify-login-code", { email, code, type })

    if (res.success) {
        window.location.hash = type === "contractor" ? "roofer-dashboard" : "quotes"
    }
}

/******************************************************
 * CLIENT VIEWS
 ******************************************************/

function homeView() {
    return `
        <section class="hero">
            <h1>Roofing Marketplace</h1>
            <p>The fastest way to get roofing quotes — and the smartest way for contractors to win more jobs.</p>
            <button onclick="window.location.hash='intake'">Get Your Free Quote</button>
        </section>

        <section class="features">
            <h2>For Homeowners</h2>
            <div class="feature-grid">
                <div class="feature">
                    <h3>Instant Quotes</h3>
                    <p>Get a real roofing estimate in minutes, not days.</p>
                </div>
                <div class="feature">
                    <h3>Verified Contractors</h3>
                    <p>Every roofer is screened and approved.</p>
                </div>
                <div class="feature">
                    <h3>Compare Bids</h3>
                    <p>See contractor bids side‑by‑side.</p>
                </div>
            </div>
        </section>

        <section class="cta">
            <h2>Ready to get started?</h2>
            <button onclick="window.location.hash='user-login'">Join as a Contractor</button>
            <button class="secondary" onclick="window.location.hash='intake'">Get a Quote</button>
        </section>
    `
}

function clientIntakeView() {
    return `
        <div class="card">
            <h2>Get Your Instant Roofing Quote</h2>

            <div class="input-group">
                <input id="address" placeholder=" " />
                <label>Address</label>
            </div>

            <div class="input-group">
                <input id="square-feet" placeholder=" " />
                <label>Roof Square Footage</label>
            </div>

            <div class="input-group">
                <select id="material">
                    <option value="">Select Material</option>
                    <option value="shingle">Shingle</option>
                    <option value="metal">Metal</option>
                </select>
                <label>Roof Material</label>
            </div>

            <button onclick="submitIntake()">Get Quote</button>
        </div>
    `
}

function processingView() {
    return `
        <div class="processing">
            <h2>Analyzing Your Roof...</h2>
            <p>This usually takes less than 10 seconds.</p>
        </div>
    `
}

function quotesView() {
    return `
        <div class="quotes">
            <h2>Your Quotes</h2>
            <div id="quote-results"></div>
            <div id="bids-results"></div>
        </div>
    `
}

async function loadBidsForLead(leadId) {
    const data = await fetchJSON(`/functions/get-lead-bids?leadId=${leadId}`)
    const container = document.getElementById("bids-results")

    container.innerHTML = `
        <div class="card">
            <h3>Contractor Bids</h3>
            ${
                data.bids.length === 0
                    ? "<p>No bids yet.</p>"
                    : data.bids
                          .map(
                              (b) => `
                    <div class="lead-card">
                        <p><strong>Bid:</strong> $${b.amount}</p>
                        <p><strong>Notes:</strong> ${b.notes || "—"}</p>
                    </div>
                `
                          )
                          .join("")
            }
        </div>
    `
}

/******************************************************
 * CONTRACTOR VIEWS
 ******************************************************/

async function loadRooferDashboard() {
    const me = await fetchJSON("/functions/me")
    const leads = await fetchJSON("/functions/get-roofer-leads")

    document.getElementById("view").innerHTML = rooferDashboardView(leads, me.user)
}

function rooferDashboardView(leads, contractor) {
    return `
        <div class="card">
            <h2>Roofer Dashboard</h2>
            <p>Logged in as: ${contractor.email}</p>
            <button onclick="window.location.hash='contractor-profile'">Update Profile</button>
            <button class="secondary" onclick="window.location.hash='billing'">Billing</button>
        </div>

        <h3>Assigned Leads</h3>
        <div id="roofer-leads">
            ${leads
                .map(
                    (lead) => `
                <div class="lead-card">
                    <h3>${lead.address}</h3>
                    <p>Square Feet: ${lead.squareFeet}</p>
                    <p>Material: ${lead.material}</p>

                    <div class="input-group">
                        <input id="bid-amount-${lead.id}" placeholder=" " />
                        <label>Your Bid ($)</label>
                    </div>

                    <div class="input-group">
                        <input id="bid-notes-${lead.id}" placeholder=" " />
                        <label>Notes</label>
                    </div>

                    <button onclick="submitBid('${lead.id}')">Submit Bid</button>
                </div>
            `
                )
                .join("")}
        </div>
    `
}

async function submitBid(leadId) {
    const amount = document.getElementById(`bid-amount-${leadId}`).value
    const notes = document.getElementById(`bid-notes-${leadId}`).value

    await postJSON("/functions/submit-bid", { leadId, amount, notes })
    alert("Bid submitted")
}

async function loadContractorProfile() {
    const me = await fetchJSON("/functions/me")
    document.getElementById("view").innerHTML = contractorProfileView(me.user)
}

function contractorProfileView(c) {
    return `
        <div class="card">
            <h2>Contractor Profile</h2>

            <div class="input-group">
                <input id="profile-business-name" placeholder=" " value="${c.businessName || ""}" />
                <label>Business Name</label>
            </div>

            <div class="input-group">
                <input id="profile-service-area" placeholder=" " value="${c.serviceArea || ""}" />
                <label>Service Area (ZIPs)</label>
            </div>

            <div class="input-group">
                <input id="profile-price-per-square" placeholder=" " value="${c.pricePerSquare || ""}" />
                <label>Price per Sq Ft</label>
            </div>

            <div class="input-group">
                <input id="profile-tearoff-fee" placeholder=" " value="${c.tearoffFee || ""}" />
                <label>Tear-Off Fee</label>
            </div>

            <button onclick="saveContractorProfile()">Save Profile</button>
        </div>
    `
}

async function saveContractorProfile() {
    const payload = {
        businessName: document.getElementById("profile-business-name").value,
        serviceArea: document.getElementById("profile-service-area").value,
        pricePerSquare: document.getElementById("profile-price-per-square").value,
        tearoffFee: document.getElementById("profile-tearoff-fee").value
    }

    await postJSON("/functions/save-contractor-profile", payload)
    alert("Profile saved")
}

/******************************************************
 * BILLING
 ******************************************************/

async function loadBilling() {
    const me = await fetchJSON("/functions/me")
    const billing = await fetchJSON("/functions/billing-info")

    document.getElementById("view").innerHTML = billingView(me.user, billing)
}

function billingView(contractor, billing) {
    return `
        <div class="card">
            <h2>Billing</h2>
            <p>Plan: ${billing.plan}</p>
            <p>Status: ${billing.subscriptionStatus}</p>

            <button onclick="openBillingPortal()">Manage Billing</button>
        </div>
    `
}

async function openBillingPortal() {
    const data = await postJSON("/functions/create-billing-portal-session", {})
    if (data.url) window.location.href = data.url
}

/******************************************************
 * ADMIN
 ******************************************************/

async function loadAdminData() {
    const contractors = await fetchJSON("/functions/admin-contractors")
    const bids = await fetchJSON("/functions/admin-bids")

    document.getElementById("view").innerHTML = adminView(contractors.contractors, bids.bids)
}

function adminView(contractors, bids) {
    return `
        <div class="card">
            <h2>Admin – Contractors</h2>
            ${contractors
                .map(
                    (c) => `
                <div class="lead-card">
                    <h3>${c.businessName || c.email}</h3>
                    <p>Email: ${c.email}</p>
                    <p>Status: ${c.verificationStatus}</p>
                    <p>Subscription: ${c.subscriptionStatus}</p>
                    <button onclick="updateContractorStatus('${c.email}', 'approved')">Approve</button>
                    <button class="secondary" onclick="updateContractorStatus('${c.email}', 'rejected')">Reject</button>
                </div>
            `
                )
                .join("")}
        </div>

        <div class="card">
            <h2>Admin – Bids</h2>
            ${bids
                .map(
                    (b) => `
                <div class="lead-card">
                    <p><strong>Lead:</strong> ${b.leadId}</p>
                    <p><strong>Contractor:</strong> ${b.contractorEmail}</p>
                    <p><strong>Amount:</strong> $${b.amount}</p>
                    <p><strong>Notes:</strong> ${b.notes}</p>
                </div>
            `
                )
                .join("")}
        </div>
    `
}

async function updateContractorStatus(email, status) {
    await postJSON("/functions/verify-contractor", { contractorEmail: email, status })
    loadAdminData()
}

/******************************************************
 * LEADERBOARD
 ******************************************************/

async function loadLeaderboard() {
    const data = await fetchJSON("/functions/contractor-leaderboard")
    document.getElementById("view").innerHTML = leaderboardView(data.leaderboard)
}

function leaderboardView(rows) {
    return `
        <div class="card">
            <h2>Top Contractors</h2>
            ${rows
                .map(
                    (r, i) => `
                <div class="lead-card">
                    <h3>#${i + 1} – ${r.businessName}</h3>
                    <p>Bids: ${r.bids}</p>
                    <p>Total Volume: $${r.totalAmount}</p>
                </div>
            `
                )
                .join("")}
        </div>
    `
}

/******************************************************
 * UTILITIES
 ******************************************************/

async function fetchJSON(url) {
    const res = await fetch(url)
    return res.json()
}

async function postJSON(url, body) {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    })
    return res.json()
}
