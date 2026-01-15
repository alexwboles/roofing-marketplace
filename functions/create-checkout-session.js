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

    const contractor = await env.CONTRACTORS.get(email, { type: "json" }) || {}

    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
        apiVersion: "2023-10-16"
    })

    let customerId = contractor.stripeCustomerId

    if (!customerId) {
        const customer = await stripe.customers.create({
            email,
            metadata: { contractorEmail: email }
        })
        customerId = customer.id

        contractor.stripeCustomerId = customerId
        await env.CONTRACTORS.put(email, JSON.stringify(contractor))
    }

    const sessionObj = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: customerId,
        line_items: [
            {
                price: env.STRIPE_PRICE_ID,
                quantity: 1
            }
        ],
        success_url: `${env.PUBLIC_URL}/#billing`,
        cancel_url: `${env.PUBLIC_URL}/#billing`
    })

    return new Response(JSON.stringify({ url: sessionObj.url }), {
        headers: { "Content-Type": "application/json" }
    })
}

function unauthorized() {
    return new Response("Unauthorized", { status: 401 })
}
