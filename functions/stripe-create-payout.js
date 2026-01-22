// functions/stripe-create-payout.js
// Cloudflare Pages Function: POST /functions/stripe-create-payout
import Stripe from 'stripe';

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export async function onRequestPost(context) {
  const body = await context.request.json();
  const { rooferId, amountCents, currency } = body;

  // Lookup roofer's connected account ID from your DB
  const accountId = await getRooferStripeAccountId(rooferId);

  const transfer = await stripe.transfers.create({
    amount: amountCents,
    currency,
    destination: accountId,
    description: `Roofing Marketplace payout for roofer ${rooferId}`,
  });

  return new Response(JSON.stringify({ id: transfer.id }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function getRooferStripeAccountId(rooferId) {
  // TODO: fetch from Firestore 'roofers' collection
  return 'acct_1234567890';
}
