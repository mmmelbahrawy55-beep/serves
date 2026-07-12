import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح بالوصول" }, { status: 401 });
    }

    const settings = await prisma.systemSetting.findMany();
    const map: Record<string, string> = {};
    settings.forEach((s) => { map[s.key] = s.value; });

    return NextResponse.json({
      companyInfo: {
        name: map.companyName || "",
        email: map.companyEmail || "",
        phone: map.companyPhone || "",
        address: map.companyAddress || "",
      },
      systemPrefs: {
        currency: map.currency || "SAR",
        language: map.language || "ar",
        timezone: map.timezone || "Asia/Riyadh",
        taxRate: map.taxRate || "15",
        lowStockAlert: map.lowStockAlert === "true",
        emailNotifications: map.emailNotifications === "true",
      },
    });
  } catch {
    return NextResponse.json({ error: "حدث خطأ أثناء جلب الإعدادات" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح بالوصول" }, { status: 401 });
    }

    const { companyInfo, systemPrefs } = await request.json();
    const entries: Record<string, string> = {};

    if (companyInfo) {
      if (companyInfo.name) entries.companyName = companyInfo.name;
      if (companyInfo.email) entries.companyEmail = companyInfo.email;
      if (companyInfo.phone) entries.companyPhone = companyInfo.phone;
      if (companyInfo.address) entries.companyAddress = companyInfo.address;
    }
    if (systemPrefs) {
      if (systemPrefs.currency) entries.currency = systemPrefs.currency;
      if (systemPrefs.language) entries.language = systemPrefs.language;
      if (systemPrefs.timezone) entries.timezone = systemPrefs.timezone;
      if (systemPrefs.taxRate) entries.taxRate = String(systemPrefs.taxRate);
      if (systemPrefs.lowStockAlert !== undefined) entries.lowStockAlert = String(systemPrefs.lowStockAlert);
      if (systemPrefs.emailNotifications !== undefined) entries.emailNotifications = String(systemPrefs.emailNotifications);
    }

    await Promise.all(
      Object.entries(entries).map(([key, value]) =>
        prisma.systemSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    );

    return NextResponse.json({ message: "تم حفظ الإعدادات بنجاح" });
  } catch {
    return NextResponse.json({ error: "فشل حفظ الإعدادات" }, { status: 500 });
  }
}