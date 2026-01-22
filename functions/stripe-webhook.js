// functions/stripe-webhook.js

export async function onRequestPost(context) {
  const payload = await context.request.text();
  const signature = context.request.headers.get("stripe-signature");
  const webhookSecret = context.env.STRIPE_WEBHOOK_SECRET;

  // Stripe signature verification must be done server-side
  const res = await fetch("https://api.stripe.com/v1/webhook_endpoints/verify", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${context.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      payload,
      sig_header: signature,
      secret: webhookSecret,
    }),
  });

  const verified = await res.json();

  if (!verified.valid) {
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(payload);

  // Handle events
  switch (event.type) {
    case "payout.paid":
      console.log("Payout completed:", event.data.object.id);
      break;
    case "payment_intent.succeeded":
      console.log("Payment succeeded:", event.data.object.id);
      break;
  }

  return new Response("OK", { status: 200 });
}
