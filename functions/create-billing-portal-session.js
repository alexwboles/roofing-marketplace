export async function onRequestPost(context) {
  const { request, env } = context

  try {
    const body = await request.json()
    const { customer_id, return_url } = body

    const params = new URLSearchParams()
    params.append("customer", customer_id)
    if (return_url) params.append("return_url", return_url)

    const stripeRes = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })

    const data = await stripeRes.json()

    if (!stripeRes.ok) {
      return new Response(JSON.stringify({ error: data }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify({ url: data.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to create billing portal session" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
