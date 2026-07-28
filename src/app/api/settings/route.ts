import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "Administrator") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await prisma.systemSetting.findMany();
    const settingsMap = settings.reduce((acc: any, s: any) => {
      acc[s.SettingKey] = s.SettingValue;
      return acc;
    }, {});

    return NextResponse.json(settingsMap);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "Administrator") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updates = await req.json();

    const transactions = Object.entries(updates).map(([key, value]) => {
      return prisma.systemSetting.upsert({
        where: { SettingKey: key },
        update: { SettingValue: String(value), UpdatedByID: user.userId as string },
        create: { SettingKey: key, SettingValue: String(value), UpdatedByID: user.userId as string }
      });
    });

    await prisma.$transaction(transactions);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
