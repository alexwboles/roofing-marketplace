// functions/stripe-create-payout.js

export async function onRequestPost(context) {
  const { amount, connectedAccountId } = await context.request.json();

  const stripeKey = context.env.STRIPE_SECRET_KEY;

  const res = await fetch("https://api.stripe.com/v1/payouts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      amount: Math.round(amount * 100),
      currency: "usd",
      stripe_account: connectedAccountId,
    }),
  });

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
