export async function onRequestPost(context) {
  const { request, env } = context

  try {
    const body = await request.json()

    // Example: expect items, success_url, cancel_url from frontend
    const { line_items, success_url, cancel_url, mode = "payment" } = body

    const params = new URLSearchParams()
    params.append("mode", mode)
    params.append("success_url", success_url)
    params.append("cancel_url", cancel_url)

    // line_items: [{ price: "price_xxx", quantity: 1 }, ...]
    if (Array.isArray(line_items)) {
      line_items.forEach((item, index) => {
        params.append(`line_items[${index}][price]`, item.price)
        params.append(`line_items[${index}][quantity]`, String(item.quantity || 1))
      })
    }

    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
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

    return new Response(JSON.stringify({ id: data.id, url: data.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to create checkout session" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
