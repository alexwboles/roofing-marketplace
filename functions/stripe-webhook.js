// IMPORTANT: In Workers you can't use Stripe's Node SDK to verify signatures.
// You either:
// - trust Cloudflare's route protection + secret, or
// - implement your own signing check using crypto.subtle (advanced).
// Below is a simple pattern that parses the event and lets you branch on type.

export async function onRequestPost(context) {
  const { request, env } = context

  // Raw body as text (Stripe sends JSON by default if configured that way)
  const rawBody = await request.text()
  const sig = request.headers.get("stripe-signature")

  // If you want to do signature verification with crypto.subtle, you can,
  // but for now we'll assume the route is protected and just parse JSON.
  let event
  try {
    event = JSON.parse(rawBody)
  } catch (e) {
    return new Response("Invalid payload", { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object
        // Handle successful checkout session
        // e.g. mark subscription active, store in DB, etc.
        break
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object
        // Handle subscription lifecycle
        break
      }
      default:
        // Unhandled event type
        break
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    return new Response("Webhook handler error", { status: 500 })
  }
}
