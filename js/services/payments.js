// js/services/payments.js
// Stripe Connect helper calls to your Cloudflare functions

export async function createRooferPayoutIntent({ rooferId, amountCents, currency = 'usd' }) {
  const res = await fetch('/functions/stripe-create-payout', {
    method: 'POST',
    body: JSON.stringify({ rooferId, amountCents, currency }),
  });
  if (!res.ok) throw new Error('Failed to create payout');
  return await res.json();
}
