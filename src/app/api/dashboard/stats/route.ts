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

    const [
      totalEmployees,
      totalClients,
      totalInvoices,
      revenueResult,
      pendingInvoices,
      lowStockProducts,
      activeProjects,
      recentInvoices,
      recentEmployees,
    ] = await Promise.all([
      prisma.user.count({
        where: { status: "ACTIVE" },
      }),
      prisma.client.count({
        where: { status: "ACTIVE" },
      }),
      prisma.invoice.count(),
      prisma.invoice.aggregate({
        _sum: { totalAmount: true },
        where: { status: "PAID" },
      }),
      prisma.invoice.count({
        where: { status: { in: ["SENT", "OVERDUE"] } },
      }),
      prisma.product.findMany({ select: { quantity: true, minStock: true } }).then(products => products.filter(p => p.quantity <= p.minStock).length),
      prisma.project.count({
        where: { status: "IN_PROGRESS" },
      }),
      prisma.invoice.findMany({
        take: 5,
        orderBy: { date: "desc" },
        include: {
          client: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.user.findMany({
        take: 5,
        where: { status: "ACTIVE" },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          department: true,
          position: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json(
      {
        stats: {
          totalEmployees,
          totalClients,
          totalInvoices,
          totalRevenue: revenueResult._sum.totalAmount ?? 0,
          pendingInvoices,
          lowStockProducts,
          activeProjects,
        },
        recentInvoices: recentInvoices.map((inv) => ({
          id: inv.id,
          number: inv.invoiceNumber,
          clientName: inv.client?.name || "-",
          total: inv.totalAmount,
          status: inv.status,
          createdAt: inv.date.toISOString(),
        })),
        recentEmployees: recentEmployees.map((emp) => ({
          id: emp.id,
          name: emp.name,
          email: emp.email,
          department: emp.department,
          position: emp.position,
          status: emp.status,
        })),
      },
      { status: 200, headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59" } }
    );
  } catch {
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الإحصائيات" },
      { status: 500 }
    );
  }
}
