import { query, exec } from "../db.js";
import { requireAuth } from "../utils/auth.js";

export async function list(request, env) {
  const auth = await requireAuth(request, env);
  if (!auth) return new Response("Unauthorized", { status: 401 });

  const result = await query(env,
    "SELECT * FROM rentals ORDER BY start_time DESC"
  );

  return new Response(JSON.stringify(result.results), {
    headers: { "Content-Type": "application/json" }
  });
}

export async function captureDeposit(request, env) {
  const auth = await requireAuth(request, env);
  if (!auth) return new Response("Unauthorized", { status: 401 });

  const rentalId = request.params.id;
  const body = await request.json();

  await exec(env,
    `UPDATE rentals
     SET deposit_amount_captured = deposit_amount_captured + ?,
         deposit_status = 'captured'
     WHERE id = ?`,
    [body.amount_cents, rentalId]
  );

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" }
  });
}
