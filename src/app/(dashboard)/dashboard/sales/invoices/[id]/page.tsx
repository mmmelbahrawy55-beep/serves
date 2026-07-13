"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowRight, Printer, FileSignature } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  product?: { id: string; name: string; sku: string } | null;
};

type ClientInfo = {
  id: string;
  name: string;
  company: string | null;
};

type Invoice = {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string | null;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  totalAmount: number;
  status: string;
  notes: string | null;
  client: ClientInfo | null;
  items: InvoiceItem[];
};

const statusLabels: Record<string, string> = {
  DRAFT: "مسودة",
  SENT: "مرسلة",
  PAID: "مدفوعة",
  CANCELLED: "ملغية",
  OVERDUE: "متأخرة",
};

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  SENT: "bg-blue-100 text-blue-700",
  PAID: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  OVERDUE: "bg-orange-100 text-orange-700",
};

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchInvoice = useCallback(async () => {
    try {
      const res = await fetch(`/api/sales/invoices/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setInvoice(data);
    } catch {
      toast.error("فشل تحميل الفاتورة");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInvoice();
  }, [fetchInvoice]);

  const handlePrint = () => {
    window.print();
  };

  const handleStatusChange = async (newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/sales/invoices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      toast.success("تم تغيير حالة الفاتورة");
      fetchInvoice();
    } catch {
      toast.error("فشل تغيير الحالة");
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">الفاتورة غير موجودة</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/sales")}>
          <ArrowRight className="h-4 w-4" />
          العودة للمبيعات
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/sales")}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">فاتورة #{invoice.invoiceNumber}</h1>
            <p className="text-gray-500 mt-1">عرض تفاصيل الفاتورة</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4" />
            طباعة
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-sm print:shadow-none print:border print:border-gray-200">
        <CardHeader className="print:pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">فاتورة #{invoice.invoiceNumber}</CardTitle>
              <CardDescription>تفاصيل الفاتورة</CardDescription>
            </div>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                statusColors[invoice.status] || "bg-gray-100 text-gray-700"
              }`}
            >
              {statusLabels[invoice.status] || invoice.status}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">رقم الفاتورة</p>
              <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">التاريخ</p>
              <p className="font-medium text-gray-900">{formatDate(invoice.date)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">تاريخ الاستحقاق</p>
              <p className="font-medium text-gray-900">
                {invoice.dueDate ? formatDate(invoice.dueDate) : "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">الحالة</p>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  statusColors[invoice.status] || "bg-gray-100 text-gray-700"
                }`}
              >
                {statusLabels[invoice.status] || invoice.status}
              </span>
            </div>
          </div>

          {invoice.client && (
            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs text-gray-500 mb-1">العميل</p>
              <p className="font-medium text-gray-900">{invoice.client.name}</p>
              {invoice.client.company && (
                <p className="text-sm text-gray-500">{invoice.client.company}</p>
              )}
            </div>
          )}

          <div className="border-t border-gray-200 pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الوصف</TableHead>
                  <TableHead className="text-center">الكمية</TableHead>
                  <TableHead className="text-center">السعر</TableHead>
                  <TableHead className="text-center">الإجمالي</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.description}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-center">{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell className="text-center">{formatCurrency(item.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="border-t border-gray-200 pt-4 flex flex-col items-end gap-2">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">المجموع الفرعي</span>
                <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
              </div>
              {invoice.taxRate > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">الضريبة ({invoice.taxRate}%)</span>
                  <span className="font-medium">{formatCurrency(invoice.taxAmount)}</span>
                </div>
              )}
              {invoice.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">الخصم</span>
                  <span className="font-medium text-red-600">-{formatCurrency(invoice.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2">
                <span>الإجمالي</span>
                <span className="text-blue-600">{formatCurrency(invoice.totalAmount)}</span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="border-t border-gray-200 pt-4">
              <p className="text-xs text-gray-500 mb-1">ملاحظات</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="print:hidden border-t border-gray-200 pt-4 gap-3">
          <Select
            value={invoice.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            options={[
              { value: "DRAFT", label: "مسودة" },
              { value: "SENT", label: "مرسلة" },
              { value: "PAID", label: "مدفوعة" },
              { value: "CANCELLED", label: "ملغية" },
            ]}
            disabled={updatingStatus}
          />
          {updatingStatus && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
        </CardFooter>
      </Card>
    </div>
  );
}
