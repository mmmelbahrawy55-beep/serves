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
    const accountId = searchParams.get("accountId");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    const where: any = {};

    if (fromDate || toDate) {
      where.date = {};
      if (fromDate) where.date.gte = new Date(fromDate);
      if (toDate) where.date.lte = new Date(toDate);
    }

    if (accountId) {
      where.lines = {
        some: { accountId },
      };
    }

    const entries = await prisma.journalEntry.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
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
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(entries, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب قيود اليومية" },
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

    if (!description || !lines || !Array.isArray(lines) || lines.length < 2) {
      return NextResponse.json(
        { error: "الوصف وسطرين على الأقل مطلوبان" },
        { status: 400 }
      );
    }

    const journalLines = lines.map((line: any) => ({
      accountId: line.accountId,
      debit: parseFloat(line.debit) || 0,
      credit: parseFloat(line.credit) || 0,
      description: line.description,
    }));

    const totalDebit = journalLines.reduce((sum: number, l: any) => sum + l.debit, 0);
    const totalCredit = journalLines.reduce((sum: number, l: any) => sum + l.credit, 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      return NextResponse.json(
        { error: "مجموع المدين لا يساوي مجموع الدائن" },
        { status: 400 }
      );
    }

    for (const line of journalLines) {
      if (line.debit === 0 && line.credit === 0) {
        return NextResponse.json(
          { error: "يجب أن يكون لكل سطر قيمة مدين أو دائن" },
          { status: 400 }
        );
      }
    }

    const entry = await prisma.journalEntry.create({
      data: {
        date: date ? new Date(date) : new Date(),
        description,
        reference,
        createdById: user.id,
        lines: {
          create: journalLines,
        },
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
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
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء قيد اليومية" },
      { status: 500 }
    );
  }
}
