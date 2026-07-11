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
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const where: any = {};

    if (month) {
      where.month = parseInt(month);
    }

    if (year) {
      where.year = parseInt(year);
    }

    const payrolls = await prisma.payroll.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            position: true,
          },
        },
      },
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });

    return NextResponse.json(payrolls, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب بيانات الرواتب" },
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
    const { month, year } = body;

    if (!month || !year) {
      return NextResponse.json(
        { error: "الشهر والسنة مطلوبان" },
        { status: 400 }
      );
    }

    const employees = await prisma.user.findMany({
      where: {
        status: "ACTIVE",
        salary: { gt: 0 },
      },
      select: {
        id: true,
        salary: true,
      },
    });

    if (employees.length === 0) {
      return NextResponse.json(
        { error: "لا يوجد موظفون نشطون برواتب محددة" },
        { status: 400 }
      );
    }

    const payrollData = employees.map((emp) => ({
      employeeId: emp.id,
      month: parseInt(month),
      year: parseInt(year),
      basicSalary: emp.salary ?? 0,
      allowances: 0,
      deductions: 0,
      netSalary: emp.salary ?? 0,
    }));

    for (const data of payrollData) {
      await prisma.payroll.upsert({
        where: {
          employeeId_month_year: {
            employeeId: data.employeeId,
            month: data.month,
            year: data.year,
          },
        },
        update: data,
        create: data,
      });
    }

    const payrolls = await prisma.payroll.findMany({
      where: {
        month: parseInt(month),
        year: parseInt(year),
      },
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
    });

    return NextResponse.json(payrolls, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء الرواتب" },
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
    const { id, allowances, deductions, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: "معرف الراتب مطلوب" },
        { status: 400 }
      );
    }

    const payroll = await prisma.payroll.findUnique({
      where: { id },
    });

    if (!payroll) {
      return NextResponse.json(
        { error: "الراتب غير موجود" },
        { status: 404 }
      );
    }

    const updateData: any = {};

    if (allowances !== undefined) {
      updateData.allowances = parseFloat(allowances);
    }

    if (deductions !== undefined) {
      updateData.deductions = parseFloat(deductions);
    }

    if (status === "PAID") {
      updateData.status = "PAID";
      updateData.paidDate = new Date();
    }

    if (allowances !== undefined || deductions !== undefined) {
      const basic = payroll.basicSalary;
      const newAllowances = allowances !== undefined ? parseFloat(allowances) : payroll.allowances;
      const newDeductions = deductions !== undefined ? parseFloat(deductions) : payroll.deductions;
      updateData.netSalary = basic + newAllowances - newDeductions;
    }

    const updated = await prisma.payroll.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث الراتب" },
      { status: 500 }
    );
  }
}
