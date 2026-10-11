import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJwt } from "@/lib/auth";

export const dynamic = "force-dynamic";

function getToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
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

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const [activeBorrowings, todayOrders, lowStockItems] = await Promise.all([
      prisma.borrowing.count({ where: { Status: "Active" } }),
      prisma.order.findMany({ where: { OrderDate: { gte: today } } }),
      prisma.inventoryItem.count({ where: { CurrentStock: { lt: 20 } } }),
    ]);

    const todayRevenue = todayOrders.reduce(
      (sum: number, o: any) => sum + o.TotalAmount,
      0
    );

    return NextResponse.json({
      stats: {
        todaySalesEtb: todayRevenue,
        ordersToday: todayOrders.length,
        activeBorrowings,
        lowStockAlerts: lowStockItems,
      },
    });
  } catch (err: any) {
    console.error("[API /manager/overview] DB error:", err);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}