import { SignJWT, jwtVerify } from "jose";

export async function sign(payload, secret) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(secret));
}

export async function verifyToken(token, secret) {
  return await jwtVerify(token, new TextEncoder().encode(secret));
}
