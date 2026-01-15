import Stripe from "stripe"

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
    if (!contractor || !contractor.stripeCustomerId) {
        return new Response("No Stripe customer found", { status: 400 })
    }

    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
        apiVersion: "2023-10-16"
    })

    const portalSession = await stripe.billingPortal.sessions.create({
        customer: contractor.stripeCustomerId,
        return_url: `${env.PUBLIC_URL}/#billing`
    })

    return new Response(JSON.stringify({ url: portalSession.url }), {
        headers: { "Content-Type": "application/json" }
    })
}

function unauthorized() {
    return new Response("Unauthorized", { status: 401 })
}
