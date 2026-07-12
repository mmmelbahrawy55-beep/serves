import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح بالوصول" }, { status: 401 });
    }

    const { month, year } = await request.json();

    if (!month || !year) {
      return NextResponse.json({ error: "الشهر والسنة مطلوبان" }, { status: 400 });
    }

    const employees = await prisma.user.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, salary: true, name: true },
    });

    const existing = await prisma.payroll.findMany({
      where: { month, year },
      select: { employeeId: true },
    });
    const existingIds = new Set(existing.map((e) => e.employeeId));

    const newPayrolls = employees
      .filter((e) => !existingIds.has(e.id))
      .map((employee) => {
        const basicSalary = employee.salary || 0;
        const allowances = Math.round(basicSalary * 0.1);
        const deductions = Math.round(basicSalary * 0.05);
        const netSalary = basicSalary + allowances - deductions;
        return {
          employeeId: employee.id,
          month,
          year,
          basicSalary,
          allowances,
          deductions,
          netSalary,
        };
      });

    if (newPayrolls.length > 0) {
      await prisma.payroll.createMany({ data: newPayrolls });
    }

    return NextResponse.json({
      message: `تم إنشاء ${newPayrolls.length} راتب`,
      count: newPayrolls.length,
    });
  } catch {
    return NextResponse.json({ error: "حدث خطأ أثناء إنشاء الرواتب" }, { status: 500 });
  }
}