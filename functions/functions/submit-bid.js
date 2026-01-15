export async function onRequestPost(context) {
    const { request, env } = context

    const cookie = request.headers.get("Cookie") || ""
    const session = cookie.match(/session=([^;]+)/)?.[1]
    if (!session) return unauthorized()

    const sessionData = await env.SESSIONS.get(session, { type: "json" })
    if (!sessionData) return unauthorized()

    const { email, type } = sessionData
    if (type !== "contractor") return unauthorized()

    const contractor = await env.CONTRACTORS.get(email, { type: "json" })
    if (!contractor) return unauthorized()

    const { leadId, amount, notes } = await request.json()

    const bidKey = `${leadId}:${email}`

    const bid = {
        leadId,
        contractorEmail: email,
        amount,
        notes,
        createdAt: Date.now()
    }

    await env.BIDS.put(bidKey, JSON.stringify(bid))

    return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
    })
}

function unauthorized() {
    return new Response("Unauthorized", { status: 401 })
}
