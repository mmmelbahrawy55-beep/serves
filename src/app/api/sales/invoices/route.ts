import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

function generateInvoiceNumber(): string {
  const prefix = "INV";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

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
    const status = searchParams.get("status");
    const clientId = searchParams.get("clientId");

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (clientId) {
      where.clientId = clientId;
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            company: true,
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

    return NextResponse.json(invoices, { status: 200, headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59" } });
  } catch (error) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الفواتير" },
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
    const { clientId, date, dueDate, items, taxRate, discount, notes } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "عناصر الفاتورة مطلوبة" },
        { status: 400 }
      );
    }

    const invoiceItems = items.map((item: any) => ({
      productId: item.productId || null,
      description: item.description || item.name || "",
      quantity: parseInt(item.quantity) || 1,
      unitPrice: parseFloat(item.unitPrice) || 0,
      total: (parseInt(item.quantity) || 1) * (parseFloat(item.unitPrice) || 0),
    }));

    const subtotal = invoiceItems.reduce((sum: number, item: any) => sum + item.total, 0);
    const taxRateValue = taxRate ? parseFloat(taxRate) : 0;
    const taxAmount = subtotal * (taxRateValue / 100);
    const discountValue = discount ? parseFloat(discount) : 0;
    const totalAmount = subtotal + taxAmount - discountValue;

    const invoiceNumber = generateInvoiceNumber();

    const invoice = await prisma.$transaction(async (tx) => {
      for (const item of invoiceItems) {
        if (item.productId) {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });

          if (product && product.quantity < item.quantity) {
            throw new Error(`الكمية غير متوفرة للمنتج: ${product.name}`);
          }

          if (product) {
            await tx.product.update({
              where: { id: item.productId },
              data: { quantity: product.quantity - item.quantity },
            });
          }
        }
      }

      return tx.invoice.create({
        data: {
          invoiceNumber,
          clientId: clientId || null,
          date: date ? new Date(date) : new Date(),
          dueDate: dueDate ? new Date(dueDate) : null,
          subtotal,
          taxRate: taxRateValue,
          taxAmount,
          discount: discountValue,
          totalAmount,
          notes,
          createdById: user.id,
          items: {
            create: invoiceItems,
          },
        },
        include: {
          client: {
            select: {
              id: true,
              name: true,
              company: true,
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

    return NextResponse.json(invoice, { status: 201 });
  } catch (error: any) {
    const message = error.message || "حدث خطأ أثناء إنشاء الفاتورة";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
