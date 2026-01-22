// functions/stripe-webhook.js
// Cloudflare Pages Function: POST /functions/stripe-webhook
import Stripe from 'stripe';

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function onRequestPost(context) {
  const sig = context.request.headers.get('stripe-signature');
  const rawBody = await context.request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  switch (event.type) {
    case 'account.updated':
      // handle connected account updates
      break;
    case 'payout.paid':
      // mark payout as completed in Firestore
      break;
    default:
      break;
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
