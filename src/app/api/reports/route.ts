import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { cleanErrorMessage } from "@/lib/error-formatter";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== "Manager" && user.role !== "Administrator")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [orders, borrowings, inventory, events] = await Promise.all([
      prisma.order.findMany({
        orderBy: { OrderDate: "desc" },
        take: 300,
      }),
      prisma.borrowing.findMany({
        include: {
          Copy: {
            include: {
              Book: { select: { Title: true } },
            },
          },
          User: { select: { FirstName: true, LastName: true, Email: true } },
        },
        orderBy: { BorrowedAt: "desc" },
        take: 300,
      }),
      prisma.inventoryItem.findMany({
        orderBy: { CurrentStock: "asc" },
      }),
   prisma.event.findMany({
  include: { Registrations: true },
  orderBy: { EventDate: "desc" },
}),
    ]);

    return NextResponse.json({
      orders,
      borrowings,
      inventory,
      events,
    });
  } catch (error: any) {
    return NextResponse.json({ error: cleanErrorMessage(error.message) }, { status: 500 });
  }
}
