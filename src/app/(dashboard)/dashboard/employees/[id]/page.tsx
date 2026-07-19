"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowRight, Pencil, User, Calendar, Plane, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Modal } from "@/components/ui/modal";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { toast } from "sonner";

type Attendance = {
  id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
};

type Leave = {
  id: string;
  startDate: string;
  endDate: string;
  type: string;
  status: string;
};

type Payroll = {
  id: string;
  month: number;
  year: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: string;
};

type Employee = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  department: string | null;
  position: string | null;
  salary: number | null;
  hireDate: string;
  status: string;
  attendances: Attendance[];
  leaves: Leave[];
};

type TabId = "info" | "attendance" | "leaves" | "payroll";

const tabs: { id: TabId; label: string; icon: typeof User }[] = [
  { id: "info", label: "المعلومات الشخصية", icon: User },
  { id: "attendance", label: "سجل الحضور", icon: Calendar },
  { id: "leaves", label: "الإجازات", icon: Plane },
  { id: "payroll", label: "الرواتب", icon: Wallet },
];

const statusBadge = (status: string) => {
  const map: Record<string, { variant: "success" | "danger" | "warning" | "default"; label: string }> = {
    ACTIVE: { variant: "success", label: "نشط" },
    INACTIVE: { variant: "danger", label: "غير نشط" },
    TERMINATED: { variant: "warning", label: "منتهي" },
    PRESENT: { variant: "success", label: "حاضر" },
    ABSENT: { variant: "danger", label: "غائب" },
    LATE: { variant: "warning", label: "متأخر" },
    HOLIDAY: { variant: "default", label: "إجازة رسمية" },
    LEAVE: { variant: "default", label: "إجازة" },
    PENDING: { variant: "warning", label: "قيد الانتظار" },
    APPROVED: { variant: "success", label: "معتمدة" },
    REJECTED: { variant: "danger", label: "مرفوضة" },
    PAID: { variant: "success", label: "مدفوع" },
    CANCELLED: { variant: "danger", label: "ملغي" },
  };
  const item = map[status] || { variant: "default" as const, label: status };
  return <Badge variant={item.variant}>{item.label}</Badge>;
};

const leaveTypeLabel: Record<string, string> = {
  SICK: "مرضي",
  ANNUAL: "سنوي",
  EMERGENCY: "طارئ",
  PERSONAL: "شخصي",
};

const payrollStatusLabel: Record<string, string> = {
  PENDING: "قيد الانتظار",
  PAID: "مدفوع",
  CANCELLED: "ملغي",
};

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("info");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    salary: 0,
    status: "ACTIVE",
  });

  const fetchEmployee = useCallback(async () => {
    try {
      const res = await fetch(`/api/employees/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEmployee(data);
      setFormData({
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        department: data.department || "",
        position: data.position || "",
        salary: data.salary || 0,
        status: data.status,
      });
    } catch {
      toast.error("فشل تحميل بيانات الموظف");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const fetchPayrolls = useCallback(async () => {
    try {
      const res = await fetch(`/api/payroll`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setPayrolls(data.filter((p: any) => p.employeeId === id));
      }
    } catch {
      // silent
    }
  }, [id]);

  useEffect(() => {
    fetchEmployee();
    fetchPayrolls();
  }, [fetchEmployee, fetchPayrolls]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/employees/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      toast.success("تم تحديث بيانات الموظف");
      setEditModalOpen(false);
      fetchEmployee();
    } catch {
      toast.error("فشل حفظ البيانات");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">الموظف غير موجود</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/dashboard/employees")}>
          <ArrowRight className="h-4 w-4" />
          العودة للموظفين
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/employees")}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{employee.name}</h1>
            <p className="text-gray-500 mt-1">{employee.position || "—"}</p>
          </div>
        </div>
        <Button variant="primary" onClick={() => setEditModalOpen(true)}>
          <Pencil className="h-4 w-4" />
          تعديل البيانات
        </Button>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "info" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs text-gray-500 mb-1">الاسم</p>
              <p className="font-medium text-gray-900 dark:text-white">{employee.name}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs text-gray-500 mb-1">البريد الإلكتروني</p>
              <p className="font-medium text-gray-900 dark:text-white dir-ltr text-left">{employee.email}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs text-gray-500 mb-1">الهاتف</p>
              <p className="font-medium text-gray-900 dark:text-white">{employee.phone || "—"}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs text-gray-500 mb-1">القسم</p>
              <p className="font-medium text-gray-900 dark:text-white">{employee.department || "—"}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs text-gray-500 mb-1">الوظيفة</p>
              <p className="font-medium text-gray-900 dark:text-white">{employee.position || "—"}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs text-gray-500 mb-1">الراتب</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {employee.salary ? formatCurrency(employee.salary) : "—"}
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs text-gray-500 mb-1">تاريخ التعيين</p>
              <p className="font-medium text-gray-900 dark:text-white">{formatDate(employee.hireDate)}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs text-gray-500 mb-1">الحالة</p>
              <div>{statusBadge(employee.status)}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "attendance" && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>سجل الحضور</CardTitle>
            <CardDescription>آخر 30 يوم</CardDescription>
          </CardHeader>
          <CardContent>
            {employee.attendances.length === 0 ? (
              <p className="text-gray-500 text-center py-8">لا توجد سجلات حضور</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الحضور</TableHead>
                    <TableHead>الانصراف</TableHead>
                    <TableHead>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employee.attendances.map((att) => (
                    <TableRow key={att.id}>
                      <TableCell className="font-medium">{formatDate(att.date)}</TableCell>
                      <TableCell>{att.checkIn ? formatDateTime(att.checkIn) : "—"}</TableCell>
                      <TableCell>{att.checkOut ? formatDateTime(att.checkOut) : "—"}</TableCell>
                      <TableCell>{statusBadge(att.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "leaves" && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>الإجازات</CardTitle>
            <CardDescription>آخر 10 إجازات</CardDescription>
          </CardHeader>
          <CardContent>
            {employee.leaves.length === 0 ? (
              <p className="text-gray-500 text-center py-8">لا توجد إجازات</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>من</TableHead>
                    <TableHead>إلى</TableHead>
                    <TableHead>النوع</TableHead>
                    <TableHead>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employee.leaves.map((leave) => (
                    <TableRow key={leave.id}>
                      <TableCell className="font-medium">{formatDate(leave.startDate)}</TableCell>
                      <TableCell>{formatDate(leave.endDate)}</TableCell>
                      <TableCell>{leaveTypeLabel[leave.type] || leave.type}</TableCell>
                      <TableCell>{statusBadge(leave.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "payroll" && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>الرواتب</CardTitle>
            <CardDescription>سجل الرواتب</CardDescription>
          </CardHeader>
          <CardContent>
            {payrolls.length === 0 ? (
              <p className="text-gray-500 text-center py-8">لا توجد سجلات رواتب</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الشهر</TableHead>
                    <TableHead>السنة</TableHead>
                    <TableHead>الأساسي</TableHead>
                    <TableHead>الصافي</TableHead>
                    <TableHead>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrolls.map((p) => {
                    const monthNames = [
                      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
                      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
                    ];
                    return (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{monthNames[p.month - 1]}</TableCell>
                        <TableCell>{p.year}</TableCell>
                        <TableCell>{formatCurrency(p.basicSalary)}</TableCell>
                        <TableCell>{formatCurrency(p.netSalary)}</TableCell>
                        <TableCell>{statusBadge(p.status)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="تعديل بيانات الموظف"
      >
        <div className="space-y-4">
          <Input
            label="الاسم"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="البريد الإلكتروني"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="الهاتف"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Input
            label="القسم"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          />
          <Input
            label="الوظيفة"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
          />
          <Input
            label="الراتب"
            type="number"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
          />
          <Select
            label="الحالة"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: "ACTIVE", label: "نشط" },
              { value: "INACTIVE", label: "غير نشط" },
              { value: "TERMINATED", label: "منتهي" },
            ]}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setEditModalOpen(false)}>
              إلغاء
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "حفظ التعديلات"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
