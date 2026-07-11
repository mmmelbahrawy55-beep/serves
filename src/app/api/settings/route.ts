import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "غير مصرح بالوصول" },
        { status: 401 }
      );
    }

    const settings = await prisma.systemSetting.findMany({
      orderBy: { key: "asc" },
    });

    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الإعدادات" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "غير مصرح بالوصول" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { settings: settingsArray } = body;

    if (!settingsArray || !Array.isArray(settingsArray)) {
      return NextResponse.json(
        { error: "بيانات الإعدادات غير صحيحة" },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      settingsArray.map(async (setting: any) => {
        const existing = await prisma.systemSetting.findUnique({
          where: { key: setting.key },
        });

        if (existing) {
          return prisma.systemSetting.update({
            where: { key: setting.key },
            data: { value: setting.value },
          });
        } else {
          return prisma.systemSetting.create({
            data: { key: setting.key, value: setting.value },
          });
        }
      })
    );

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error("Error saving settings:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حفظ الإعدادات" },
      { status: 500 }
    );
  }
}
