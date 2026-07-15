import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
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
  } catch {
    return NextResponse.json(
      { error: "حدث خطأ أثناء تسجيل الانصراف" },
      { status: 500 }
    );
  }
}
