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
    const { employeeId, notes } = body;

    if (!employeeId) {
      return NextResponse.json(
        { error: "معرف الموظف مطلوب" },
        { status: 400 }
      );
    }

    const today = new Date();
    const startToday = startOfDay(today);
    const endToday = endOfDay(today);

    const existing = await prisma.attendance.findFirst({
      where: {
        employeeId,
        date: { gte: startToday, lte: endToday },
      },
    });

    if (existing?.checkIn) {
      return NextResponse.json(
        { error: "تم تسجيل الحضور مسبقاً اليوم" },
        { status: 400 }
      );
    }

    const checkInTime = today;
    let status = "PRESENT";
    // Check if late (after 9:00 AM)
    const checkInHour = checkInTime.getHours();
    const checkInMinute = checkInTime.getMinutes();
    if (checkInHour > 9 || (checkInHour === 9 && checkInMinute > 0)) {
      status = "LATE";
    }

    let record;
    if (existing) {
      record = await prisma.attendance.update({
        where: { id: existing.id },
        data: { checkIn: checkInTime, status },
      });
    } else {
      record = await prisma.attendance.create({
        data: {
          employeeId,
          checkIn: checkInTime,
          date: checkInTime,
          status,
          notes,
        },
      });
    }

    return NextResponse.json(record, { status: 200 });
  } catch (error) {
    console.error("Error in check-in:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تسجيل الحضور" },
      { status: 500 }
    );
  }
}
