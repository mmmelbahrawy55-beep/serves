import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { startOfDay, endOfDay, parseISO } from "date-fns";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "غير مصرح بالوصول" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");
    const employeeId = searchParams.get("employeeId");

    const targetDate = dateParam ? parseISO(dateParam) : new Date();
    const start = startOfDay(targetDate);
    const end = endOfDay(targetDate);

    // Get all active employees
    const employees = await prisma.user.findMany({
      where: { 
        status: "ACTIVE",
        ...(employeeId ? { id: employeeId } : {})
      },
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
      },
    });

    // Get existing attendance records for the date
    const existingAttendance = await prisma.attendance.findMany({
      where: {
        date: { gte: start, lte: end },
        ...(employeeId ? { employeeId } : {}),
      },
      include: {
        employee: {
          select: { id: true, name: true, email: true, department: true },
        },
      },
    });

    // Create a map for quick lookup
    const attendanceMap = new Map(
      existingAttendance.map(a => [a.employeeId, a])
    );

    // Combine employees with their attendance records
    const result = employees.map(employee => {
      const attendance = attendanceMap.get(employee.id);
      return {
        id: attendance?.id || `temp-${employee.id}`,
        employeeId: employee.id,
        employeeName: employee.name,
        date: targetDate.toISOString(),
        checkIn: attendance?.checkIn ? attendance.checkIn.toISOString() : null,
        checkOut: attendance?.checkOut ? attendance.checkOut.toISOString() : null,
        status: attendance?.status || "ABSENT",
        notes: attendance?.notes || null,
      };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب سجلات الحضور" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "غير مصرح بالوصول" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const path = url.pathname;

    if (path.endsWith("/check-in")) {
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
      // Check if late (after 9:00 AM for example)
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
    }

    return NextResponse.json(
      { error: "نوع العملية غير صحيح" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in attendance POST:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تسجيل الحضور" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "غير مصرح بالوصول" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const id = pathParts[pathParts.length - 2];

    if (pathParts[pathParts.length - 1] === "check-out" && id) {
      const today = new Date();
      
      const existing = await prisma.attendance.findUnique({
        where: { id },
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
        where: { id },
        data: { checkOut: today },
      });

      return NextResponse.json(record, { status: 200 });
    }

    return NextResponse.json(
      { error: "نوع العملية غير صحيح" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error in attendance PATCH:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تسجيل الانصراف" },
      { status: 500 }
    );
  }
}
