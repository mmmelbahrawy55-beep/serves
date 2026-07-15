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

    const projects = await prisma.project.findMany({
      include: {
        client: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects, { status: 200, headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59" } });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب المشاريع" },
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
    const { name, description, startDate, endDate, budget, clientId, managerId } = body;

    if (!name || !startDate) {
      return NextResponse.json(
        { error: "اسم المشروع وتاريخ البداية مطلوبان" },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        budget: budget ? (parseFloat(budget) || 0) : 0,
        clientId: clientId || null,
        managerId: managerId || null,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: { tasks: true },
        },
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء المشروع" },
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

    const body = await request.json();
    const { id, name, description, startDate, endDate, status, budget, clientId, managerId } = body;

    if (!id) {
      return NextResponse.json(
        { error: "معرف المشروع مطلوب" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (startDate !== undefined) updateData.startDate = new Date(startDate);
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;
    if (status !== undefined) updateData.status = status;
    if (budget !== undefined) updateData.budget = parseFloat(budget) || 0;
    if (clientId !== undefined) updateData.clientId = clientId || null;
    if (managerId !== undefined) updateData.managerId = managerId || null;

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: { tasks: true },
        },
      },
    });

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث المشروع" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "غير مصرح بالوصول" },
        { status: 401 }
      );
    }

    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "معرف المشروع مطلوب" },
        { status: 400 }
      );
    }

    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "تم حذف المشروع بنجاح" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء حذف المشروع" },
      { status: 500 }
    );
  }
}
