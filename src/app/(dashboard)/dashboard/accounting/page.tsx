"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Landmark,
  BookOpen,
  ScrollText,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  Loader2,
} from "lucide-react";
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
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

type FinancialSummary = {
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  netBalance: number;
  totalIncome: number;
  totalExpenses: number;
};

type JournalEntry = {
  id: string;
  reference: string;
  description: string;
  date: string;
  totalDebit: number;
  totalCredit: number;
};

export default function AccountingPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/accounting/summary");
        const data = await res.json();
        setSummary(data.summary);
        setRecentEntries(data.recentEntries || []);
      } catch {
        toast.error("فشل تحميل البيانات المالية");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const summaryCards = [
    {
      title: "إجمالي الأصول",
      value: summary?.totalAssets ?? 0,
      icon: TrendingUp,
      color: "bg-blue-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "إجمالي الخصوم",
      value: summary?.totalLiabilities ?? 0,
      icon: TrendingDown,
      color: "bg-red-500",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      title: "حقوق الملكية",
      value: summary?.totalEquity ?? 0,
      icon: DollarSign,
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "صافي الدخل",
      value: summary ? (summary.totalIncome - summary.totalExpenses) : 0,
      icon: PieChart,
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">المحاسبة</h1>
        <p className="text-gray-500 mt-1">النظرة العامة المالية للشركة</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <Card key={card.title} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(card.value)}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center`}
                >
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
            <CardTitle>دفتر الأستاذ</CardTitle>
            <CardDescription>عرض حسابات دفتر الأستاذ</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/accounting/chart")}
            >
              <BookOpen className="h-4 w-4" />
              عرض دليل الحسابات
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>قيود اليومية</CardTitle>
            <CardDescription>تسجيل وعرض قيود اليومية</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/accounting/journal")}
            >
              <ScrollText className="h-4 w-4" />
              إدارة قيود اليومية
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>آخر قيود اليومية</CardTitle>
          <CardDescription>أحدث 5 قيود يومية مسجلة</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : recentEntries.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              لا توجد قيود يومية
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الرقم</TableHead>
                  <TableHead>الوصف</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>مدين</TableHead>
                  <TableHead>دائن</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                      {entry.reference || "—"}
                    </TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell>{formatDate(entry.date)}</TableCell>
                    <TableCell className="text-red-600">
                      {formatCurrency(entry.totalDebit)}
                    </TableCell>
                    <TableCell className="text-green-600">
                      {formatCurrency(entry.totalCredit)}
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
