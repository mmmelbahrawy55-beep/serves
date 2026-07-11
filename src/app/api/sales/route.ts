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

    const invoices = await prisma.invoice.findMany({
      include: {
        client: {
          select: {
            id: true,
            name: true,
            company: true,
          },
        },
        items: true,
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(invoices, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب المبيعات" },
      { status: 500 }
    );
  }
}
