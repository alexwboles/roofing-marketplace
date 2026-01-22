// js/services/payments.js
export async function createRooferPayout(rooferId, amountCents) {
  const res = await fetch('/functions/stripe-create-payout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rooferId, amountCents })
  });
  return await res.json();
}
