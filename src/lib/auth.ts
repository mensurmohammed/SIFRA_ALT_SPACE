import { SignJWT, jwtVerify } from "jose";

const secretKey = "sifra-super-secret-key-for-local-dev";
const key = new TextEncoder().encode(secretKey);

export async function signJwt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch (err) {
    return null;
  }
}

export async function getUserFromRequest(req: Request) {
  // 1. Try Authorization: Bearer <token> first (Flutter client)
  const authHeader = req.headers.get('authorization') || '';
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    const payload = await verifyJwt(token);
    if (payload) return payload;
  }
  // 2. Fall back to auth_token cookie (browser)
  const cookieHeader = req.headers.get('cookie') || '';
  const match = cookieHeader.match(/auth_token=([^;]+)/);
  if (!match) return null;
  const token = match[1];
  return await verifyJwt(token);
}
