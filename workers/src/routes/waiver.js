import { query, exec } from "../db.js";
import { requireAuth } from "../utils/auth.js";

export async function list(request, env) {
  const auth = await requireAuth(request, env);
  if (!auth) return new Response("Unauthorized", { status: 401 });

  const result = await query(env,
    "SELECT * FROM waiver_versions ORDER BY created_at DESC"
  );

  return new Response(JSON.stringify(result.results), {
    headers: { "Content-Type": "application/json" }
  });
}

export async function createVersion(request, env) {
  const auth = await requireAuth(request, env);
  if (!auth) return new Response("Unauthorized", { status: 401 });

  const body = await request.json();
  const id = crypto.randomUUID();

  await exec(env,
    `INSERT INTO waiver_versions (id, title, content_html, created_at, created_by_user_id)
     VALUES (?, ?, ?, datetime('now'), ?)`,
    [id, body.title || "Waiver", body.content_html, auth.user_id]
  );

  return new Response(JSON.stringify({ id }), {
    headers: { "Content-Type": "application/json" }
  });
}
