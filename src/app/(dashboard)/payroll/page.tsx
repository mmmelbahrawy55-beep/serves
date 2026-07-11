"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { DollarSign, Calendar, CheckCircle, Clock } from "lucide-react";

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const fetchData = async () => {
    try {
      const [payrollsRes, employeesRes] = await Promise.all([
        fetch(`/api/payroll?month=${selectedMonth}&year=${selectedYear}`),
        fetch("/api/employees"),
      ]);
      
      const payrollsData = await payrollsRes.json();
      const employeesData = await employeesRes.json();
      
      setPayrolls(payrollsData);
      setEmployees(employeesData);
    } catch (error) {
      console.error("Error fetching payroll data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayroll = async (employeeId: string) => {
    try {
      await fetch("/api/payroll/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, month: selectedMonth, year: selectedYear }),
      });
      fetchData();
    } catch (error) {
      console.error("Error processing payroll:", error);
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      await fetch(`/api/payroll/${id}/pay`, { method: "POST" });
      fetchData();
    } catch (error) {
      console.error("Error marking as paid:", error);
    }
  };

  if (loading) {
    return <div className="p-6">جاري التحميل...</div>;
  }

  const totalGross = payrolls.reduce((sum, p) => sum + (p.basicSalary + p.allowances), 0);
  const totalDeductions = payrolls.reduce((sum, p) => sum + p.deductions, 0);
  const totalNet = payrolls.reduce((sum, p) => sum + p.netSalary, 0);
  const paidCount = payrolls.filter(p => p.status === "PAID").length;
  const pendingCount = payrolls.filter(p => p.status === "PENDING").length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">الرواتب</h1>
        <div className="flex items-center gap-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="flex h-10 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="flex h-10 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {[2024, 2025, 2026].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي الرواتب</p>
              <p className="text-2xl font-bold text-gray-900">{totalGross.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">الخصومات</p>
              <p className="text-2xl font-bold text-red-600">{totalDeductions.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">صافي الرواتب</p>
              <p className="text-2xl font-bold text-green-600">{totalNet.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">مدفوعة / معلقة</p>
              <p className="text-2xl font-bold text-gray-900">{paidCount} / {pendingCount}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">قائمة الرواتب</h2>
        <Table
          columns={[
            { header: "الموظف", accessor: "employee", render: (emp: any) => emp?.name || "-" },
            { header: "الراتب الأساسي", accessor: "basicSalary" },
            { header: "البدلات", accessor: "allowances" },
            { header: "الخصومات", accessor: "deductions" },
            { header: "صافي الراتب", accessor: "netSalary" },
            { 
              header: "الحالة", 
              accessor: "status",
              render: (value: string) => (
                <Badge variant={value === "PAID" ? "default" : "secondary"}>
                  {value === "PAID" ? "مدفوع" : "معلق"}
                </Badge>
              )
            },
            { header: "تاريخ الدفع", accessor: "paidDate", render: (date: string) => date ? new Date(date).toLocaleDateString('ar-EG') : "-" },
            {
              header: "الإجراءات",
              render: (row: any) => (
                <div className="flex gap-2">
                  {row.status === "PENDING" && (
                    <Button size="sm" variant="ghost" onClick={() => handleMarkPaid(row.id)}>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </Button>
                  )}
                </div>
              ),
            },
          ]}
          data={payrolls}
        />
      </div>
    </div>
  );
}
