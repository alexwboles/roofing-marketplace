export async function onRequestPost(context) {
    const { request, env } = context

    // Read session cookie
    const cookie = request.headers.get("Cookie") || ""
    const session = cookie.match(/session=([^;]+)/)?.[1]
    if (!session) return unauthorized()

    const sessionData = await env.SESSIONS.get(session, { type: "json" })
    if (!sessionData || sessionData.type !== "contractor") return unauthorized()

    const contractorEmail = sessionData.email

    // Stripe client
    const stripe = require("stripe")(env.STRIPE_SECRET_KEY)

    // Create billing portal session
    const portal = await stripe.billingPortal.sessions.create({
        customer_email: contractorEmail,
        return_url: `${env.PUBLIC_URL}/#/billing`
    })

    return new Response(JSON.stringify({ url: portal.url }), {
        headers: { "Content-Type": "application/json" }
    })
}

function unauthorized() {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
    })
}
