export async function onRequest(context) {
    const { request, env } = context

    const cookie = request.headers.get("Cookie") || ""
    const session = cookie.match(/session=([^;]+)/)?.[1]

    if (!session) return notLoggedIn()

    const sessionData = await env.SESSIONS.get(session, { type: "json" })
    if (!sessionData) return notLoggedIn()

    const { email, type } = sessionData

    let user = null

    if (type === "contractor") {
        user = await env.CONTRACTORS.get(email, { type: "json" })
    }

    if (type === "client") {
        user = await env.CLIENTS.get(email, { type: "json" })
    }

    if (!user) return notLoggedIn()

    return new Response(JSON.stringify({
        loggedIn: true,
        type,
        user
    }), {
        headers: { "Content-Type": "application/json" }
    })
}

function notLoggedIn() {
    return new Response(JSON.stringify({ loggedIn: false }), {
        headers: { "Content-Type": "application/json" }
    })
}
