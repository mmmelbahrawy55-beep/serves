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
    const supplierId = searchParams.get("supplierId");
    const status = searchParams.get("status");

    const where: any = {};

    if (supplierId) {
      where.supplierId = supplierId;
    }

    if (status) {
      where.status = status;
    }

    const purchases = await prisma.purchase.findMany({
      where,
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(purchases, { status: 200, headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59" } });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب المشتريات" },
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
    const { supplierId, date, items, notes } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "عناصر المشتريات مطلوبة" },
        { status: 400 }
      );
    }

    const purchaseItems = items.map((item: any) => ({
      productId: item.productId,
      description: item.description,
      quantity: parseInt(item.quantity),
      unitPrice: parseFloat(item.unitPrice),
      total: parseInt(item.quantity) * parseFloat(item.unitPrice),
    }));

    const totalAmount = purchaseItems.reduce((sum: number, item: any) => sum + item.total, 0);

    const purchase = await prisma.$transaction(async (tx) => {
      for (const item of purchaseItems) {
        if (item.productId) {
          await tx.product.upsert({
            where: { id: item.productId },
            update: {
              quantity: { increment: item.quantity },
            },
            create: {
              id: item.productId,
              name: item.description,
              sku: `TEMP-${Date.now()}`,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              costPrice: item.unitPrice,
            },
          });
        }
      }

      return tx.purchase.create({
        data: {
          supplierId,
          date: date ? new Date(date) : new Date(),
          totalAmount,
          notes,
          createdById: user.id,
          items: {
            create: purchaseItems,
          },
        },
        include: {
          supplier: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                },
              },
            },
          },
        },
      });
    });

    return NextResponse.json(purchase, { status: 201 });
  } catch (error: any) {
    const message = error.message || "حدث خطأ أثناء إنشاء المشتريات";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
