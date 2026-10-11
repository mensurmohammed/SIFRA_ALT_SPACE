import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";

export const dynamic = "force-dynamic";

function getToken(req: NextRequest): string | null {
  // Prefer Authorization header (Flutter sends Bearer <token>)
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  // Fallback to cookie (browser)
  return req.cookies.get("auth_token")?.value ?? null;
}

export async function GET(req: NextRequest) {
  const token = getToken(req);
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const payload: any = await verifyJwt(token);
  if (!payload) return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });

  if (payload.role !== "Manager" && payload.role !== "Administrator") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    user: {
      id: payload.userId,
      email: payload.email,
      role: payload.role,
      name: payload.name,
    },
  });
}