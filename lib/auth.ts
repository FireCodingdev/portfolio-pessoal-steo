import { SignJWT, jwtVerify } from "jose";

export const COOKIE_NAME = "crm_session";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 dias

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "A variável de ambiente JWT_SECRET não foi configurada. Defina-a nas configurações do projeto na Vercel."
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(payload: { email: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${COOKIE_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as { email: string };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  name: COOKIE_NAME,
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: COOKIE_MAX_AGE_SECONDS,
};
