"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
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
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

type PayrollRecord = {
  id: string;
  employeeId: string;
  employeeName: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: string;
  month: number;
  year: number;
};

const months = [
  { value: "1", label: "يناير" },
  { value: "2", label: "فبراير" },
  { value: "3", label: "مارس" },
  { value: "4", label: "أبريل" },
  { value: "5", label: "مايو" },
  { value: "6", label: "يونيو" },
  { value: "7", label: "يوليو" },
  { value: "8", label: "أغسطس" },
  { value: "9", label: "سبتمبر" },
  { value: "10", label: "أكتوبر" },
  { value: "11", label: "نوفمبر" },
  { value: "12", label: "ديسمبر" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => ({
  value: String(currentYear - i),
  label: String(currentYear - i),
}));

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [month, setMonth] = useState(String(new Date().getMonth() + 1));
  const [year, setYear] = useState(String(currentYear));
  const [generating, setGenerating] = useState(false);

  const fetchPayroll = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/payroll?month=${month}&year=${year}`);
      const data = await res.json();
      setPayrolls(data.payrolls || []);
    } catch {
      toast.error("فشل تحميل بيانات الرواتب");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, [month, year]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/payroll/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month: Number(month), year: Number(year) }),
      });
      if (!res.ok) throw new Error();
      toast.success("تم إنشاء كشف الرواتب");
      fetchPayroll();
    } catch {
      toast.error("فشل إنشاء كشف الرواتب");
    } finally {
      setGenerating(false);
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { variant: "success" | "warning" | "default"; label: string }> = {
      PAID: { variant: "success", label: "مدفوع" },
      PENDING: { variant: "warning", label: "معلق" },
    };
    const item = map[status] || { variant: "default" as const, label: status };
    return <Badge variant={item.variant}>{item.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الرواتب</h1>
          <p className="text-gray-500 mt-1">إدارة رواتب الموظفين</p>
        </div>
        <Button variant="primary" onClick={handleGenerate} disabled={generating}>
          {generating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          إنشاء كشف رواتب
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Select
              label="الشهر"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              options={months}
            />
            <Select
              label="السنة"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              options={years}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : payrolls.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              لا توجد سجلات رواتب لهذا الشهر
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الموظف</TableHead>
                  <TableHead>الراتب الأساسي</TableHead>
                  <TableHead>البدلات</TableHead>
                  <TableHead>الخصومات</TableHead>
                  <TableHead>الصافي</TableHead>
                  <TableHead>الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrolls.map((pr) => (
                  <TableRow key={pr.id}>
                    <TableCell className="font-medium">
                      {pr.employeeName}
                    </TableCell>
                    <TableCell>{formatCurrency(pr.baseSalary)}</TableCell>
                    <TableCell className="text-green-600">
                      +{formatCurrency(pr.allowances)}
                    </TableCell>
                    <TableCell className="text-red-600">
                      -{formatCurrency(pr.deductions)}
                    </TableCell>
                    <TableCell className="font-bold">
                      {formatCurrency(pr.netSalary)}
                    </TableCell>
                    <TableCell>{statusBadge(pr.status)}</TableCell>
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
