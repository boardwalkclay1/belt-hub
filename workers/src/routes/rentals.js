import { query, run } from '../db.js';
import { captureAmount } from '../utils/stripe.js';

export async function captureDeposit(request, env) {
  const { id } = request.params;
  const body = await request.json();
  const { amount_cents, reason } = body;

  const rental = await query(env,
    "SELECT * FROM rentals WHERE id = ? LIMIT 1",
    [id]
  );

  const r = rental.results[0];

  const res = await captureAmount(env, r.payment_intent_id, amount_cents);

  await run(env,
    `UPDATE rentals
     SET deposit_amount_captured = deposit_amount_captured + ?, deposit_status = 'partially_captured'
     WHERE id = ?`,
    [amount_cents, id]
  );

  return new Response(JSON.stringify({ success: true, stripe: res }), {
    headers: { "Content-Type": "application/json" }
  });
}
