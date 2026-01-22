// functions/stripe-create-payout.js
export async function onRequestPost(context) {
  const { rooferId, amountCents } = await context.request.json();
  const STRIPE_SECRET_KEY = context.env.STRIPE_SECRET_KEY;

  const connectedAccountId = "acct_1234567890"; // TODO: look up via Firestore REST

  const body = new URLSearchParams({
    amount: amountCents,
    currency: "usd",
    destination: connectedAccountId
  });

  const res = await fetch("https://api.stripe.com/v1/transfers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
}
