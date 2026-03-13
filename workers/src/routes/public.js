import { query, exec } from "../db.js";

export async function upsertCustomer(request, env) {
  const body = await request.json();

  const existing = await query(env,
    "SELECT id FROM customers WHERE phone = ? LIMIT 1",
    [body.phone]
  );

  let id;

  if (existing.results.length) {
    id = existing.results[0].id;
    await exec(env,
      `UPDATE customers
       SET first_name = ?, last_name = ?, email = ?
       WHERE id = ?`,
      [body.first_name, body.last_name, body.email, id]
    );
  } else {
    id = crypto.randomUUID();
    await exec(env,
      `INSERT INTO customers (id, first_name, last_name, email, phone, created_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'))`,
      [id, body.first_name, body.last_name, body.email, body.phone]
    );
  }

  return new Response(JSON.stringify({ id }), {
    headers: { "Content-Type": "application/json" }
  });
}

export async function currentWaiver(request, env) {
  const result = await query(env,
    "SELECT * FROM waiver_versions ORDER BY created_at DESC LIMIT 1"
  );

  return new Response(JSON.stringify(result.results[0] || null), {
    headers: { "Content-Type": "application/json" }
  });
}

export async function signWaiver(request, env) {
  const body = await request.json();
  const id = crypto.randomUUID();

  await exec(env,
    `INSERT INTO signed_waivers
     (id, customer_id, waiver_version_id, signature_data, signed_at)
     VALUES (?, ?, ?, ?, datetime('now'))`,
    [id, body.customer_id, body.waiver_version_id, body.signature_data]
  );

  return new Response(JSON.stringify({ id }), {
    headers: { "Content-Type": "application/json" }
  });
}

export async function startRental(request, env) {
  const body = await request.json();
  const id = crypto.randomUUID();

  await exec(env,
    `INSERT INTO rentals
     (id, customer_id, bike_id, start_time, status)
     VALUES (?, ?, ?, datetime('now'), 'active')`,
    [id, body.customer_id, body.bike_id]
  );

  return new Response(JSON.stringify({ id }), {
    headers: { "Content-Type": "application/json" }
  });
}

export async function endRental(request, env) {
  const body = await request.json();

  await exec(env,
    `UPDATE rentals
     SET end_time = datetime('now'),
         status = 'completed'
     WHERE id = ?`,
    [body.rental_id]
  );

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" }
  });
}
