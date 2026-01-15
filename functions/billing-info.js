export async function onRequest(context) {
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

    const billing = {
        plan: contractor.plan || "trial",
        subscriptionStatus: contractor.subscriptionStatus || "trial"
    }

    return new Response(JSON.stringify(billing), {
        headers: { "Content-Type": "application/json" }
    })
}

function unauthorized() {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
    })
}
