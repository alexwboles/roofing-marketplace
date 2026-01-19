export async function onRequestPost(context) {
    const { request, env } = context

    // Read session cookie
    const cookie = request.headers.get("Cookie") || ""
    const session = cookie.match(/session=([^;]+)/)?.[1]
    if (!session) return unauthorized()

    const sessionData = await env.SESSIONS.get(session, { type: "json" })
    if (!sessionData || sessionData.type !== "contractor") return unauthorized()

    const { email } = sessionData
    const contractor = await env.CONTRACTORS.get(email, { type: "json" }) || {}

    const updates = await request.json()

    // Merge updates safely
    const updated = {
        ...contractor,
        ...updates,
        email, // never allow overwrite
        updatedAt: Date.now()
    }

    await env.CONTRACTORS.put(email, JSON.stringify(updated))

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
