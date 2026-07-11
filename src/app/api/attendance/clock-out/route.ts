import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { startOfDay, endOfDay } from "date-fns";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "غير مصرح بالوصول" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { employeeId, date } = body;

    if (!employeeId) {
      return NextResponse.json(
        { error: "معرف الموظف مطلوب" },
        { status: 400 }
      );
    }

    const targetDate = date ? new Date(date) : new Date();
    const start = startOfDay(targetDate);
    const end = endOfDay(targetDate);

    const existing = await prisma.attendance.findFirst({
      where: {
        employeeId,
        date: { gte: start, lte: end },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "لم يتم العثور على سجل الحضور" },
        { status: 404 }
      );
    }

    if (!existing.checkIn) {
      return NextResponse.json(
        { error: "لم يتم تسجيل الحضور أولاً" },
        { status: 400 }
      );
    }

    if (existing.checkOut) {
      return NextResponse.json(
        { error: "تم تسجيل الانصراف مسبقاً" },
        { status: 400 }
      );
    }

    const record = await prisma.attendance.update({
      where: { id: existing.id },
      data: { checkOut: targetDate },
    });

    return NextResponse.json(record, { status: 200 });
  } catch (error) {
    console.error("Error in clock-out:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تسجيل الانصراف" },
      { status: 500 }
    );
  }
}
