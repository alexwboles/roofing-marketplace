export async function onRequestPost(context) {
    const { request, env } = context

    // Read session cookie
    const cookie = request.headers.get("Cookie") || ""
    const session = cookie.match(/session=([^;]+)/)?.[1]
    if (!session) return unauthorized()

    const sessionData = await env.SESSIONS.get(session, { type: "json" })
    if (!sessionData || sessionData.type !== "contractor") return unauthorized()

    const contractorEmail = sessionData.email

    // Parse bid
    const { leadId, amount, notes } = await request.json()

    if (!leadId || !amount) {
        return new Response("Missing fields", { status: 400 })
    }

    // Verify contractor was assigned this lead
    const assignment = await env.LEAD_ASSIGNMENTS.get(leadId, { type: "json" })
    if (!assignment || assignment.contractorEmail !== contractorEmail) {
        return new Response("Lead not assigned to this contractor", { status: 403 })
    }

    // Create bid record
    const bidRecord = {
        id: crypto.randomUUID(),
        leadId,
        contractorEmail,
        amount,
        notes: notes || "",
        createdAt: Date.now()
    }

    // Store bid
    await env.BIDS.put(bidRecord.id, JSON.stringify(bidRecord))

    return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
    })
}

function unauthorized() {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
    })
}
