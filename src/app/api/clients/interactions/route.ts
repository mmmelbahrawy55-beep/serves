import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح بالوصول" }, { status: 401 });
    }

    const body = await request.json();
    const { clientId, type, description, date } = body;

    if (!clientId || !description) {
      return NextResponse.json({ error: "معرف العميل والوصف مطلوبان" }, { status: 400 });
    }

    const interaction = await prisma.interaction.create({
      data: {
        clientId,
        type: type || "NOTE",
        description,
        date: date ? new Date(date) : new Date(),
        createdById: user.id,
      },
      include: {
        createdBy: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(interaction, { status: 201 });
  } catch {
    return NextResponse.json({ error: "حدث خطأ أثناء إضافة التفاعل" }, { status: 500 });
  }
}