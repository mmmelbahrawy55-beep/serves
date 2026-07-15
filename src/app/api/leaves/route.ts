import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

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
    const employeeId = searchParams.get("employeeId");
    const status = searchParams.get("status");

    const where: any = {};

    if (employeeId) {
      where.employeeId = employeeId;
    }

    if (status) {
      where.status = status;
    }

    const leaves = await prisma.leave.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(leaves, { status: 200, headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59" } });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب طلبات الإجازة" },
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

    const body = await request.json();
    const { employeeId, startDate, endDate, type, reason } = body;

    if (!employeeId || !startDate || !endDate || !type) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة" },
        { status: 400 }
      );
    }

    if (!["SICK", "ANNUAL", "EMERGENCY", "PERSONAL"].includes(type)) {
      return NextResponse.json({ error: "نوع إجازة غير صالح" }, { status: 400 });
    }

    const employee = await prisma.user.findUnique({ where: { id: employeeId } });
    if (!employee) {
      return NextResponse.json({ error: "الموظف غير موجود" }, { status: 404 });
    }

    const leave = await prisma.leave.create({
      data: {
        employeeId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        type,
        reason,
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(leave, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء طلب الإجازة" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "غير مصرح بالوصول" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "معرف الإجازة والحالة مطلوبان" },
        { status: 400 }
      );
    }

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { error: "حالة غير صالحة" },
        { status: 400 }
      );
    }

    const leave = await prisma.leave.update({
      where: { id },
      data: {
        status,
        approvedBy: user.id,
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(leave, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث الإجازة" },
      { status: 500 }
    );
  }
}
