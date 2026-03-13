import { query, exec } from "../db.js";
import { requireAuth } from "../utils/auth.js";

export async function list(request, env) {
  const auth = await requireAuth(request, env);
  if (!auth) return new Response("Unauthorized", { status: 401 });

  const result = await query(env, "SELECT * FROM coupons ORDER BY code ASC");
  return new Response(JSON.stringify(result.results), {
    headers: { "Content-Type": "application/json" }
  });
}

export async function create(request, env) {
  const auth = await requireAuth(request, env);
  if (!auth) return new Response("Unauthorized", { status: 401 });

  const body = await request.json();
  const id = crypto.randomUUID();

  await exec(env,
    `INSERT INTO coupons
     (id, code, description, type, value, valid_from, valid_to, minimum_spend, active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
    [
      id,
      body.code,
      body.description,
      body.type,
      body.value,
      body.valid_from,
      body.valid_to,
      body.minimum_spend
    ]
  );

  return new Response(JSON.stringify({ id }), {
    headers: { "Content-Type": "application/json" }
  });
}
