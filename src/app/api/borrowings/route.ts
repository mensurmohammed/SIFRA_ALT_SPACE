import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const borrowings = await prisma.borrowing.findMany({
      where: user.role === "Customer" ? { UserID: user.userId as string } : {},
      include: {
        Copy: { include: { Book: true } },
        User: true
      },
      orderBy: { BorrowedAt: 'desc' }
    });

    return NextResponse.json(borrowings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== "Manager" && user.role !== "Administrator")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { copyId, customerEmail, startTime } = await req.json();

    const copy = await prisma.bookCopy.findUnique({ where: { CopyID: copyId } });
    if (!copy || copy.Status !== "Available") {
      return NextResponse.json({ error: "Book copy is not available" }, { status: 400 });
    }

    // Determine the actual start time and round down to nearest 15 mins
    const baseDate = startTime ? new Date(startTime) : new Date();
    const minutes = baseDate.getMinutes();
    const roundedMinutes = Math.floor(minutes / 15) * 15;
    baseDate.setMinutes(roundedMinutes, 0, 0); // set to rounded minutes, 0 secs, 0 ms

    // Look up user by email if provided
    let targetUserId = null;
    let finalCustomerEmail = customerEmail ? customerEmail.trim() : null;

    if (finalCustomerEmail) {
      const customer = await prisma.user.findUnique({ where: { Email: finalCustomerEmail } });
      if (customer) {
        targetUserId = customer.UserID;
      }
    }

    // Transaction to update copy and create borrowing
    const result = await prisma.$transaction([
      prisma.bookCopy.update({
        where: { CopyID: copyId },
        data: { Status: "Borrowed" }
      }),
      prisma.borrowing.create({
        data: {
          CopyID: copyId,
          UserID: targetUserId,
          CustomerEmail: finalCustomerEmail,
          BorrowedAt: baseDate,
          Status: "Active"
        }
      })
    ]);

    return NextResponse.json(result[1], { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
