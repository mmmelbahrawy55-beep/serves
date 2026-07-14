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

    const accounts = await prisma.account.findMany({
      include: {
        _count: {
          select: { journalLines: true },
        },
      },
      orderBy: { code: "asc" },
    });

    return NextResponse.json(accounts, { status: 200, headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59" } });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الحسابات" },
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
    const { code, name, type, parentId, balance } = body;

    if (!code || !name || !type) {
      return NextResponse.json(
        { error: "رمز الحساب والاسم والنوع مطلوبون" },
        { status: 400 }
      );
    }

    const existing = await prisma.account.findUnique({
      where: { code },
    });

    if (existing) {
      return NextResponse.json(
        { error: "رمز الحساب موجود مسبقاً" },
        { status: 400 }
      );
    }

    const account = await prisma.account.create({
      data: {
        code,
        name,
        type,
        parentId,
        balance: balance ? parseFloat(balance) : 0,
      },
    });

    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء الحساب" },
      { status: 500 }
    );
  }
}
