import { query, exec } from "../db.js";
import { requireAuth } from "../utils/auth.js";

export async function list(request, env) {
  const auth = await requireAuth(request, env);
  if (!auth) return new Response("Unauthorized", { status: 401 });

  const result = await query(env, "SELECT * FROM customers ORDER BY created_at DESC");
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
    `INSERT INTO customers (id, first_name, last_name, email, phone, created_at)
     VALUES (?, ?, ?, ?, ?, datetime('now'))`,
    [id, body.first_name, body.last_name, body.email, body.phone]
  );

  return new Response(JSON.stringify({ id }), {
    headers: { "Content-Type": "application/json" }
  });
}
