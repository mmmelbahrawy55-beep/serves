"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Building2,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Loader2,
} from "lucide-react";
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
import type { DashboardStats } from "@/lib/definitions";

type Employee = {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  status: string;
};

type Invoice = {
  id: string;
  number: string;
  clientName: string;
  total: number;
  status: string;
  createdAt: string;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [recentEmployees, setRecentEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/dashboard/stats");
        const data = await response.json();
        setStats(data.stats);
        setRecentInvoices(data.recentInvoices || []);
        setRecentEmployees(data.recentEmployees || []);
      } catch {
        console.error("Failed to fetch dashboard data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const statCards = [
    {
      title: "إجمالي الموظفين",
      value: stats?.totalEmployees ?? 0,
      icon: Users,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "إجمالي العملاء",
      value: stats?.totalClients ?? 0,
      icon: Building2,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "الفواتير النشطة",
      value: stats?.pendingInvoices ?? 0,
      icon: FileText,
      color: "bg-amber-500",
      bgColor: "bg-amber-50",
      textColor: "text-amber-600",
    },
    {
      title: "إجمالي الإيرادات",
      value: stats?.totalRevenue ?? 0,
      icon: DollarSign,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      isCurrency: true,
    },
  ];

  const statusBadge = (status: string) => {
    const variants: Record<string, "success" | "warning" | "danger" | "primary" | "default"> = {
      PAID: "success",
      SENT: "primary",
      DRAFT: "default",
      CANCELLED: "danger",
      OVERDUE: "warning",
      نشط: "success",
      غير_نشط: "danger",
      ACTIVE: "success",
      INACTIVE: "danger",
    };
    const statusLabels: Record<string, string> = {
      PAID: "مدفوعة",
      SENT: "مرسلة",
      DRAFT: "مسودة",
      CANCELLED: "ملغية",
      OVERDUE: "متأخرة",
      ACTIVE: "نشط",
      INACTIVE: "غير نشط",
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {statusLabels[status] || status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
        <p className="text-gray-500 mt-1">نظرة عامة على أداء الشركة</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.title} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {card.isCurrency
                      ? formatCurrency(card.value as number)
                      : card.value}
                  </p>
                </div>
                <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center`}>
                  <card.icon className={`h-6 w-6 ${card.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>آخر الفواتير</CardTitle>
            <CardDescription>آخر 5 فواتير مسجلة</CardDescription>
          </CardHeader>
          <CardContent>
            {recentInvoices.length === 0 ? (
              <p className="text-gray-500 text-center py-4">لا توجد فواتير</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم الفاتورة</TableHead>
                    <TableHead>العميل</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الإجمالي</TableHead>
                    <TableHead>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.number}</TableCell>
                      <TableCell>{invoice.clientName}</TableCell>
                      <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                      <TableCell>{formatCurrency(invoice.total)}</TableCell>
                      <TableCell>{statusBadge(invoice.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>آخر الموظفين</CardTitle>
            <CardDescription>آخر 5 موظفين مضافين</CardDescription>
          </CardHeader>
          <CardContent>
            {recentEmployees.length === 0 ? (
              <p className="text-gray-500 text-center py-4">لا يوجد موظفين</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاسم</TableHead>
                    <TableHead>القسم</TableHead>
                    <TableHead>الوظيفة</TableHead>
                    <TableHead>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{statusBadge(employee.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">نمو الإيرادات</p>
                <p className="text-lg font-bold text-green-600">+12.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">المصروفات</p>
                <p className="text-lg font-bold text-red-600">-3.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
