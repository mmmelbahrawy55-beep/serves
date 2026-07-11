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

    const journalEntries = await prisma.journalEntry.findMany({
      include: {
        lines: {
          include: {
            account: {
              select: {
                id: true,
                code: true,
                name: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(journalEntries, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب القيود اليومية" },
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
    const { date, description, reference, lines } = body;

    if (!description || !lines || lines.length === 0) {
      return NextResponse.json(
        { error: "الوصف والبنود مطلوبة" },
        { status: 400 }
      );
    }

    const totalDebit = lines.reduce((sum: number, line: any) => sum + (line.debit || 0), 0);
    const totalCredit = lines.reduce((sum: number, line: any) => sum + (line.credit || 0), 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      return NextResponse.json(
        { error: "المدين والدائن غير متساويين" },
        { status: 400 }
      );
    }

    const journalEntry = await prisma.journalEntry.create({
      data: {
        date: date ? new Date(date) : new Date(),
        description,
        reference,
        createdById: user.id,
        lines: {
          create: lines.map((line: any) => ({
            accountId: line.accountId,
            debit: line.debit || 0,
            credit: line.credit || 0,
            description: line.description,
          })),
        },
      },
      include: {
        lines: {
          include: {
            account: true,
          },
        },
      },
    });

    return NextResponse.json(journalEntry, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء القيد اليومي" },
      { status: 500 }
    );
  }
}
