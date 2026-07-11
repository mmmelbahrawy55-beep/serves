"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { INVOICE_STATUS_COLORS } from "@/lib/definitions";

type Invoice = {
  id: string;
  number: string;
  clientName: string;
  createdAt: string;
  total: number;
  status: string;
};

const statusLabels: Record<string, string> = {
  DRAFT: "مسودة",
  SENT: "مرسلة",
  PAID: "مدفوعة",
  CANCELLED: "ملغية",
  OVERDUE: "متأخرة",
};

export default function SalesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/invoices?${params}`);
      const data = await res.json();
      setInvoices(data.invoices || []);
    } catch {
      toast.error("فشل تحميل الفواتير");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [search]);

  const statusBadge = (status: string) => {
    const colorClass = INVOICE_STATUS_COLORS[status] || "bg-gray-100 text-gray-700";
    return (
      <Badge className={colorClass}>
        {statusLabels[status] || status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المبيعات</h1>
          <p className="text-gray-500 mt-1">إدارة الفواتير والمبيعات</p>
        </div>
        <Button
          variant="primary"
          onClick={() => router.push("/sales/invoices/new")}
        >
          <Plus className="h-4 w-4" />
          إنشاء فاتورة
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              className="flex h-10 w-full rounded-lg border border-gray-200 bg-white pr-10 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="بحث عن فاتورة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : invoices.length === 0 ? (
            <p className="text-gray-500 text-center py-8">لا توجد فواتير</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الفاتورة</TableHead>
                  <TableHead>العميل</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الإجمالي</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow
                    key={invoice.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/sales/invoices/${invoice.id}`)}
                  >
                    <TableCell className="font-medium">
                      {invoice.number}
                    </TableCell>
                    <TableCell>{invoice.clientName}</TableCell>
                    <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                    <TableCell>{formatCurrency(invoice.total)}</TableCell>
                    <TableCell>{statusBadge(invoice.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            router.push(
                              `/sales/invoices/${invoice.id}`
                            );
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
