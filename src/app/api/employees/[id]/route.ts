import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "غير مصرح بالوصول" },
        { status: 401 }
      );
    }

    const { id } = params;

    const employee = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        department: true,
        position: true,
        salary: true,
        hireDate: true,
        status: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        attendances: {
          orderBy: { date: "desc" },
          take: 30,
        },
        leaves: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!employee) {
      return NextResponse.json(
        { error: "الموظف غير موجود" },
        { status: 404 }
      );
    }

    return NextResponse.json(employee, { status: 200, headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59" } });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب بيانات الموظف" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "غير مصرح بالوصول" },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();
    const { name, email, role, department, position, salary, status, phone, avatar } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;
    if (department !== undefined) updateData.department = department;
    if (position !== undefined) updateData.position = position;
    if (salary !== undefined) updateData.salary = parseFloat(salary);
    if (status !== undefined) updateData.status = status;
    if (phone !== undefined) updateData.phone = phone;
    if (avatar !== undefined) updateData.avatar = avatar;

    const updatedEmployee = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        position: true,
        salary: true,
        status: true,
        phone: true,
        avatar: true,
      },
    });

    return NextResponse.json(updatedEmployee, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث الموظف" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "غير مصرح بالوصول" },
        { status: 401 }
      );
    }

    const { id } = params;

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "تم حذف الموظف بنجاح" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء حذف الموظف" },
      { status: 500 }
    );
  }
}
