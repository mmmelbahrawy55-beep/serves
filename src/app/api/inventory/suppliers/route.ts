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

    const suppliers = await prisma.supplier.findMany({
      include: {
        _count: {
          select: {
            products: true,
            purchases: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(suppliers, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الموردين" },
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
    const { name, email, phone, address, notes } = body;

    if (!name) {
      return NextResponse.json(
        { error: "اسم المورد مطلوب" },
        { status: 400 }
      );
    }

    const supplier = await prisma.supplier.create({
      data: { name, email, phone, address, notes },
    });

    return NextResponse.json(supplier, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء المورد" },
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
    const { id, name, email, phone, address, notes } = body;

    if (!id) {
      return NextResponse.json(
        { error: "معرف المورد مطلوب" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (notes !== undefined) updateData.notes = notes;

    const supplier = await prisma.supplier.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(supplier, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث المورد" },
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
        { error: "معرف المورد مطلوب" },
        { status: 400 }
      );
    }

    await prisma.supplier.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "تم حذف المورد بنجاح" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء حذف المورد" },
      { status: 500 }
    );
  }
}
