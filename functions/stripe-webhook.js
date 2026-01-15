import Stripe from "stripe"

export async function onRequestPost(context) {
    const { request, env } = context

    const sig = request.headers.get("Stripe-Signature")
    const rawBody = await request.text()

    let event
    try {
        const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
            apiVersion: "2023-10-16"
        })

        event = stripe.webhooks.constructEvent(
            rawBody,
            sig,
            env.STRIPE_WEBHOOK_SECRET
        )
    } catch (err) {
        console.error("Webhook signature verification failed", err)
        return new Response("Bad signature", { status: 400 })
    }

    if (event.type === "customer.subscription.updated" ||
        event.type === "customer.subscription.created") {

        const subscription = event.data.object
        const customerId = subscription.customer
        const status = subscription.status

        const list = await env.CONTRACTORS.list()
        for (const item of list.keys) {
            const c = await env.CONTRACTORS.get(item.name, { type: "json" })
            if (c && c.stripeCustomerId === customerId) {
                c.subscriptionStatus = status
                await env.CONTRACTORS.put(item.name, JSON.stringify(c))
                break
            }
        }
    }

    return new Response("OK", { status: 200 })
}
