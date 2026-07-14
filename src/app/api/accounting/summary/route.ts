import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح بالوصول" }, { status: 401 });
    }

    const [accounts, recentEntries] = await Promise.all([
      prisma.account.findMany({ orderBy: { code: "asc" } }),
      prisma.journalEntry.findMany({
        take: 5,
        orderBy: { date: "desc" },
        include: {
          lines: {
            include: { account: { select: { name: true, code: true } } },
          },
          createdBy: { select: { name: true } },
        },
      }),
    ]);

    const totalAssets = accounts
      .filter((a) => a.type === "ASSET")
      .reduce((sum, a) => sum + a.balance, 0);
    const totalLiabilities = accounts
      .filter((a) => a.type === "LIABILITY")
      .reduce((sum, a) => sum + a.balance, 0);
    const totalEquity = accounts
      .filter((a) => a.type === "EQUITY")
      .reduce((sum, a) => sum + a.balance, 0);
    const totalIncome = accounts
      .filter((a) => a.type === "INCOME")
      .reduce((sum, a) => sum + a.balance, 0);
    const totalExpenses = accounts
      .filter((a) => a.type === "EXPENSE")
      .reduce((sum, a) => sum + a.balance, 0);

    return NextResponse.json({
      summary: {
        totalAssets,
        totalLiabilities,
        totalEquity,
        totalIncome,
        totalExpenses,
        netBalance: totalAssets - totalLiabilities,
      },
      recentEntries: recentEntries.map((entry) => ({
        id: entry.id,
        date: entry.date.toISOString(),
        description: entry.description,
        reference: entry.reference,
        createdByName: entry.createdBy.name,
        lineCount: entry.lines.length,
        totalDebit: entry.lines.reduce((s, l) => s + l.debit, 0),
        totalCredit: entry.lines.reduce((s, l) => s + l.credit, 0),
      })),
    }, { status: 200, headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59" } });
  } catch {
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب البيانات المالية" },
      { status: 500 }
    );
  }
}