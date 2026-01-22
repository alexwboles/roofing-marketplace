// functions/stripe-webhook.js
export async function onRequestPost(context) {
  const STRIPE_WEBHOOK_SECRET = context.env.STRIPE_WEBHOOK_SECRET;

  const signature = context.request.headers.get("stripe-signature");
  const rawBody = await context.request.text();

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(STRIPE_WEBHOOK_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signed = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));
  const expected = [...new Uint8Array(signed)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  if (!signature || !signature.includes(expected)) {
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(rawBody);

  switch (event.type) {
    case "payout.paid":
      // TODO: update Firestore via REST
      break;
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" }
  });
}
