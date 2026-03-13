import { verifyToken } from "./jwt.js";

export async function requireAuth(request, env) {
  const auth = request.headers.get("Authorization");
  if (!auth) return null;

  const token = auth.replace("Bearer ", "").trim();
  if (!token) return null;

  try {
    const { payload } = await verifyToken(token, env.JWT_SECRET);
    return payload;
  } catch (err) {
    return null;
  }
}
