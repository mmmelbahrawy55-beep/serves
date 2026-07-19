"use client";

import { useState, useEffect } from "react";
import {
  Users, Building2, FileText, DollarSign,
  TrendingUp, TrendingDown, Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { DashboardStats } from "@/lib/definitions";

type Employee = { id: string; name: string; email: string; department: string; position: string; status: string };
type Invoice = { id: string; number: string; clientName: string; total: number; status: string; createdAt: string };

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [recentEmployees, setRecentEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard/stats");
        const data = await res.json();
        setStats(data.stats);
        setRecentInvoices(data.recentInvoices || []);
        setRecentEmployees(data.recentEmployees || []);
      } catch { /* ignore */ } finally { setIsLoading(false); }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const statCards = [
    { title: "إجمالي الموظفين", value: stats?.totalEmployees ?? 0, icon: Users, color: "bg-blue-500", bgColor: "bg-blue-50/50 dark:bg-blue-500/10", textColor: "text-blue-600" },
    { title: "إجمالي العملاء", value: stats?.totalClients ?? 0, icon: Building2, color: "bg-emerald-500", bgColor: "bg-emerald-50/50 dark:bg-emerald-500/10", textColor: "text-emerald-600" },
    { title: "الفواتير النشطة", value: stats?.pendingInvoices ?? 0, icon: FileText, color: "bg-violet-500", bgColor: "bg-violet-50/50 dark:bg-violet-500/10", textColor: "text-violet-600" },
    { title: "إجمالي الإيرادات", value: stats?.totalRevenue ?? 0, icon: DollarSign, color: "bg-purple-500", bgColor: "bg-purple-50/50 dark:bg-purple-500/10", textColor: "text-purple-600", isCurrency: true },
  ];

  const statusBadge = (status: string) => {
    const variants: Record<string, "success" | "warning" | "danger" | "primary" | "default"> = {
      PAID: "success", SENT: "primary", DRAFT: "default", CANCELLED: "danger", OVERDUE: "warning",
      ACTIVE: "success", INACTIVE: "danger",
    };
    const labels: Record<string, string> = {
      PAID: "مدفوعة", SENT: "مرسلة", DRAFT: "مسودة", CANCELLED: "ملغية", OVERDUE: "متأخرة",
      ACTIVE: "نشط", INACTIVE: "غير نشط",
    };
    return <Badge variant={variants[status] || "default"}>{labels[status] || status}</Badge>;
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">لوحة التحكم</h1>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">نظرة عامة على أداء الشركة</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
                  <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                    {card.isCurrency ? formatCurrency(card.value as number) : card.value}
                  </p>
                </div>
                <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${card.bgColor}`}>
                  <card.icon className={`h-5 w-5 ${card.textColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {[
          { title: "آخر الفواتير", desc: "آخر 5 فواتير مسجلة", empty: "لا توجد فواتير", data: recentInvoices, cols: ["رقم الفاتورة", "العميل", "التاريخ", "الإجمالي", "الحالة"] },
          { title: "آخر الموظفين", desc: "آخر 5 موظفين مضافين", empty: "لا يوجد موظفين", data: recentEmployees, cols: ["الاسم", "القسم", "الوظيفة", "الحالة"] },
        ].map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>{section.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              {section.data.length === 0 ? (
                <p className="py-4 text-center text-sm text-gray-500">{section.empty}</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {section.cols.map((col) => (
                          <TableHead key={col}>{col}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {"number" in section.data[0]
                        ? (section.data as Invoice[]).map((inv) => (
                            <TableRow key={inv.id}>
                              <TableCell className="font-medium">{inv.number}</TableCell>
                              <TableCell>{inv.clientName}</TableCell>
                              <TableCell className="whitespace-nowrap">{formatDate(inv.createdAt)}</TableCell>
                              <TableCell>{formatCurrency(inv.total)}</TableCell>
                              <TableCell>{statusBadge(inv.status)}</TableCell>
                            </TableRow>
                          ))
                        : (section.data as Employee[]).map((emp) => (
                            <TableRow key={emp.id}>
                              <TableCell className="font-medium">{emp.name}</TableCell>
                              <TableCell>{emp.department}</TableCell>
                              <TableCell>{emp.position}</TableCell>
                              <TableCell>{statusBadge(emp.status)}</TableCell>
                            </TableRow>
                          ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {[
          { icon: TrendingUp, label: "نمو الإيرادات", value: "+12.5%", color: "text-emerald-600", bg: "bg-emerald-50/50 dark:bg-emerald-500/10" },
          { icon: TrendingDown, label: "المصروفات", value: "-3.2%", color: "text-red-600", bg: "bg-red-50/50 dark:bg-red-500/10" },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg}`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                  <p className={`text-base font-bold ${item.color}`}>{item.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
