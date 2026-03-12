import { query, run } from '../db.js';
import { createDeposit, captureAmount } from '../utils/stripe.js';

export async function upsertCustomer(request, env) {
  const body = await request.json();
  const { email, phone, first_name, last_name } = body;

  const existing = await query(env,
    "SELECT * FROM customers WHERE email = ? OR phone = ? LIMIT 1",
    [email, phone]
  );

  if (existing.results.length) {
    return new Response(JSON.stringify(existing.results[0]), {
      headers: { "Content-Type": "application/json" }
    });
  }

  await run(env,
    `INSERT INTO customers (id, first_name, last_name, email, phone, created_at)
     VALUES (uuid(), ?, ?, ?, ?, datetime('now'))`,
    [first_name, last_name, email, phone]
  );

  const newCustomer = await query(env,
    "SELECT * FROM customers WHERE email = ? LIMIT 1",
    [email]
  );

  return new Response(JSON.stringify(newCustomer.results[0]), {
    headers: { "Content-Type": "application/json" }
  });
}

export async function currentWaiver(request, env) {
  const res = await query(env,
    "SELECT * FROM waiver_versions ORDER BY created_at DESC LIMIT 1"
  );
  return new Response(JSON.stringify(res.results[0]), {
    headers: { "Content-Type": "application/json" }
  });
}

export async function signWaiver(request, env) {
  const body = await request.json();
  const { customer_id, waiver_version_id, signature_data } = body;

  await run(env,
    `INSERT INTO signed_waivers (id, customer_id, waiver_version_id, signature_data, signed_at)
     VALUES (uuid(), ?, ?, ?, datetime('now'))`,
    [customer_id, waiver_version_id, signature_data]
  );

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" }
  });
}

export async function startRental(request, env) {
  const body = await request.json();
  const { customer_id, bike_id } = body;

  const deposit = await createDeposit(env, 10000);

  await run(env,
    `INSERT INTO rentals (id, customer_id, bike_id, start_time, status, deposit_amount, deposit_status, payment_intent_id)
     VALUES (uuid(), ?, ?, datetime('now'), 'active', 10000, 'held', ?)`,
    [customer_id, bike_id, deposit.id]
  );

  return new Response(JSON.stringify({
    rental_id: deposit.id,
    payment_intent_client_secret: deposit.client_secret
  }), {
    headers: { "Content-Type": "application/json" }
  });
}

export async function endRental(request, env) {
  const body = await request.json();
  const { rental_id } = body;

  const rental = await query(env,
    "SELECT * FROM rentals WHERE payment_intent_id = ? LIMIT 1",
    [rental_id]
  );

  const r = rental.results[0];

  // Calculate cost (example: 25/hr)
  const cost = 2500; // placeholder

  await captureAmount(env, r.payment_intent_id, cost);

  await run(env,
    `UPDATE rentals SET end_time = datetime('now'), final_amount = ?, status = 'completed'
     WHERE payment_intent_id = ?`,
    [cost, rental_id]
  );

  return new Response(JSON.stringify({ success: true, amount_charged: cost }), {
    headers: { "Content-Type": "application/json" }
  });
}
