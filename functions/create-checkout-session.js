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

    // Create checkout session
    const checkout = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer_email: contractorEmail,
        line_items: [
            {
                price: env.STRIPE_PRICE_ID, // your monthly subscription price
                quantity: 1
            }
        ],
        success_url: `${env.PUBLIC_URL}/#/billing?success=true`,
        cancel_url: `${env.PUBLIC_URL}/#/billing?canceled=true`,
        metadata: {
            contractorEmail
        }
    })

    return new Response(JSON.stringify({ url: checkout.url }), {
        headers: { "Content-Type": "application/json" }
    })
}

function unauthorized() {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
    })
}
