"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Plus, Eye, Trash2, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";

export default function SalesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [invoicesRes, clientsRes] = await Promise.all([
        fetch("/api/sales/invoices"),
        fetch("/api/clients"),
      ]);
      
      const invoicesData = await invoicesRes.json();
      const clientsData = await clientsRes.json();
      
      setInvoices(invoicesData);
      setClients(clientsData);
    } catch (error) {
      console.error("Error fetching sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الفاتورة؟")) return;
    
    try {
      await fetch(`/api/sales/invoices/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  if (loading) {
    return <div className="p-6">جاري التحميل...</div>;
  }

  const totalSales = invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const paidInvoices = invoices.filter(inv => inv.status === "PAID").length;
  const pendingInvoices = invoices.filter(inv => inv.status === "PENDING").length;
  const draftInvoices = invoices.filter(inv => inv.status === "DRAFT").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">المبيعات</h1>
        <Button variant="primary">
          <Plus className="w-4 h-4 ml-2" />
          فاتورة جديدة
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي المبيعات</p>
              <p className="text-2xl font-bold text-gray-900">{totalSales.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">الفواتير المدفوعة</p>
              <p className="text-2xl font-bold text-green-600">{paidInvoices}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">فواتير معلقة</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingInvoices}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">مسودات</p>
              <p className="text-2xl font-bold text-gray-600">{draftInvoices}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">الفواتير</h2>
        <Table
          columns={[
            { header: "رقم الفاتورة", accessor: "invoiceNumber" },
            { header: "العميل", accessor: "client", render: (client: any) => client?.name || "-" },
            { header: "التاريخ", accessor: "date", render: (date: string) => new Date(date).toLocaleDateString('ar-EG') },
            { header: "تاريخ الاستحقاق", accessor: "dueDate", render: (date: string) => date ? new Date(date).toLocaleDateString('ar-EG') : "-" },
            { header: "المجموع الفرعي", accessor: "subtotal" },
            { header: "الضريبة", accessor: "taxAmount" },
            { header: "الإجمالي", accessor: "totalAmount" },
            { 
              header: "الحالة", 
              accessor: "status",
              render: (value: string) => {
                const variants: Record<string, any> = {
                  DRAFT: "secondary",
                  PENDING: "default",
                  PAID: "default",
                  CANCELLED: "destructive",
                };
                const labels: Record<string, string> = {
                  DRAFT: "مسودة",
                  PENDING: "معلقة",
                  PAID: "مدفوعة",
                  CANCELLED: "ملغاة",
                };
                return <Badge variant={variants[value] || "default"}>{labels[value] || value}</Badge>;
              }
            },
            {
              header: "الإجراءات",
              render: (row: any) => (
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(row.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ),
            },
          ]}
          data={invoices}
        />
      </div>
    </div>
  );
}
