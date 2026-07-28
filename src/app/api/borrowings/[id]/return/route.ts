import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || (user.role !== "Manager" && user.role !== "Administrator")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const borrowingId = id;
    const body = await req.json().catch(() => ({}));
    const { endTime } = body;

    const borrowing = await prisma.borrowing.findUnique({ where: { BorrowingID: borrowingId } });

    if (!borrowing || borrowing.Status === "Returned") {
      return NextResponse.json({ error: "Borrowing not found or already returned" }, { status: 400 });
    }

    const finalEndTime = endTime ? new Date(endTime) : new Date();
    const startTime = new Date(borrowing.BorrowedAt);

    // Validate 24h limit
    const durationMs = finalEndTime.getTime() - startTime.getTime();
    if (durationMs < 0) {
      return NextResponse.json({ error: "End time cannot be before start time" }, { status: 400 });
    }
    const maxDurationMs = 24 * 60 * 60 * 1000;
    if (durationMs > maxDurationMs) {
      return NextResponse.json({ error: "Borrow session exceeds maximum allowed 24 hours" }, { status: 400 });
    }

    // Get system setting rate
    const rateSetting = await prisma.systemSetting.findUnique({
      where: { SettingKey: "borrowing_rate_quarter_hour" }
    });
    const quarterHourRate = rateSetting ? parseFloat(rateSetting.SettingValue) : 15;

    // Calculate chunks of 15 mins (Math.ceil so e.g. 5 mins -> 1 chunk)
    const durationMinutes = durationMs / (1000 * 60);
    const intervals = Math.max(1, Math.ceil(durationMinutes / 15));
    const fee = intervals * quarterHourRate;

    const result = await prisma.$transaction([
      prisma.borrowing.update({
        where: { BorrowingID: borrowingId },
        data: {
          Status: "Returned",
          ReturnedAt: finalEndTime,
          AmountCharged: fee
        }
      }),
      prisma.bookCopy.update({
        where: { CopyID: borrowing.CopyID },
        data: { Status: "Available" }
      })
    ]);

    return NextResponse.json(result[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
