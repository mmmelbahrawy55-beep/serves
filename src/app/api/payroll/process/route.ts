import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

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
    const { employeeId, month, year } = body;

    if (!employeeId || !month || !year) {
      return NextResponse.json(
        { error: "معرف الموظف والشهر والسنة مطلوبون" },
        { status: 400 }
      );
    }

    const employee = await prisma.user.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "الموظف غير موجود" },
        { status: 404 }
      );
    }

    const existing = await prisma.payroll.findUnique({
      where: {
        employeeId_month_year: {
          employeeId,
          month,
          year,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "تم معالجة راتب هذا الموظف لهذا الشهر مسبقاً" },
        { status: 400 }
      );
    }

    const basicSalary = employee.salary || 0;
    const allowances = basicSalary * 0.1; // 10% allowances
    const deductions = basicSalary * 0.05; // 5% deductions
    const netSalary = basicSalary + allowances - deductions;

    const payroll = await prisma.payroll.create({
      data: {
        employeeId,
        month,
        year,
        basicSalary,
        allowances,
        deductions,
        netSalary,
        status: "PENDING",
      },
    });

    return NextResponse.json(payroll, { status: 201 });
  } catch (error) {
    console.error("Error processing payroll:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء معالجة الراتب" },
      { status: 500 }
    );
  }
}
