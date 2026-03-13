import { query } from "../db.js";
import bcrypt from "bcryptjs";
import { sign } from "../utils/jwt.js";

export async function login(request, env) {
  const body = await request.json();
  const { email, password } = body;

  const result = await query(env,
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  if (!result.results.length) {
    return new Response("Invalid email or password", { status: 401 });
  }

  const user = result.results[0];
  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    return new Response("Invalid email or password", { status: 401 });
  }

  const token = await sign(
    { user_id: user.id, role: user.role },
    env.JWT_SECRET
  );

  return new Response(JSON.stringify({ token }), {
    headers: { "Content-Type": "application/json" }
  });
}
