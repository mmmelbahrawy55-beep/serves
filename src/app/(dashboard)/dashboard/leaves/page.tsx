"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Check, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
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
import { formatDate } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";

type Employee = { id: string; name: string; email: string; department: string | null };

type Leave = {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  type: string;
  reason: string | null;
  status: string;
  employee: { id: string; name: string; email: string; department: string | null };
};

const leaveTypeLabels: Record<string, string> = {
  SICK: "مرضي",
  ANNUAL: "سنوي",
  EMERGENCY: "طارئ",
  PERSONAL: "شخصي",
};

const statusConfig: Record<string, { variant: "success" | "danger" | "warning" | "primary" | "default"; label: string }> = {
  PENDING: { variant: "warning", label: "قيد الانتظار" },
  APPROVED: { variant: "success", label: "معتمدة" },
  REJECTED: { variant: "danger", label: "مرفوضة" },
};

const emptyForm = {
  employeeId: "",
  startDate: "",
  endDate: "",
  type: "SICK",
  reason: "",
};

export default function LeavesPage() {
  const router = useRouter();
  const currentUser = useAppStore((s) => s.currentUser);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("");

  const isAdmin = currentUser?.role === "ADMIN";

  const fetchLeaves = async () => {
    try {
      const params = new URLSearchParams();
      if (filter) params.set("status", filter);
      const res = await fetch(`/api/leaves?${params}`);
      const data = await res.json();
      setLeaves(Array.isArray(data) ? data : []);
    } catch {
      toast.error("فشل تحميل الإجازات");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/leaves").then(r => r.json()),
      fetch("/api/employees").then(r => r.json()),
    ]).then(([leavesData, employeesData]) => {
      setLeaves(Array.isArray(leavesData) ? leavesData : []);
      setEmployees(Array.isArray(employeesData) ? employeesData : []);
    }).catch(() => {
      toast.error("فشل تحميل البيانات");
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/leaves", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      toast.success(status === "APPROVED" ? "تم اعتماد الإجازة" : "تم رفض الإجازة");
      fetchLeaves();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleAdd = async () => {
    if (!formData.employeeId || !formData.startDate || !formData.endDate) {
      toast.error("جميع الحقول مطلوبة");
      return;
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast.error("تاريخ النهاية يجب أن يكون بعد تاريخ البداية");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      toast.success("تم إضافة طلب الإجازة");
      setModalOpen(false);
      setFormData(emptyForm);
      fetchLeaves();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredLeaves = filter ? leaves.filter(l => l.status === filter) : leaves;

  const statusBadge = (status: string) => {
    const config = statusConfig[status] || { variant: "default" as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">الإجازات</h1>
          <p className="text-gray-500 mt-1">إدارة طلبات الإجازات والموافقة عليها</p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" />
          إضافة إجازة
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              options={[
                { value: "", label: "جميع الإجازات" },
                { value: "PENDING", label: "قيد الانتظار" },
                { value: "APPROVED", label: "معتمدة" },
                { value: "REJECTED", label: "مرفوضة" },
              ]}
              className="w-44"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : filteredLeaves.length === 0 ? (
            <p className="text-gray-500 text-center py-8">لا توجد إجازات</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الموظف</TableHead>
                  <TableHead>القسم</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>من</TableHead>
                  <TableHead>إلى</TableHead>
                  <TableHead>الأيام</TableHead>
                  <TableHead>السبب</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeaves.map((leave) => {
                  const days = Math.ceil(
                    (new Date(leave.endDate).getTime() - new Date(leave.startDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  ) + 1;
                  return (
                    <TableRow
                      key={leave.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => router.push(`/dashboard/leaves/${leave.id}`)}
                    >
                      <TableCell className="font-medium">{leave.employee.name}</TableCell>
                      <TableCell>{leave.employee.department || "—"}</TableCell>
                      <TableCell>
                        <Badge variant="default">{leaveTypeLabels[leave.type] || leave.type}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(leave.startDate)}</TableCell>
                      <TableCell>{formatDate(leave.endDate)}</TableCell>
                      <TableCell>{days}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{leave.reason || "—"}</TableCell>
                      <TableCell>{statusBadge(leave.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/leaves/${leave.id}`); }}>
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button>
                          {leave.status === "PENDING" && isAdmin && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); handleStatusChange(leave.id, "APPROVED"); }}
                              >
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); handleStatusChange(leave.id, "REJECTED"); }}
                              >
                                <X className="h-4 w-4 text-red-600" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setFormData(emptyForm); }}
        title="إضافة إجازة جديدة"
      >
        <div className="space-y-4">
          <Select
            label="الموظف"
            value={formData.employeeId}
            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            options={[
              { value: "", label: "اختر موظف..." },
              ...employees.map((emp) => ({
                value: emp.id,
                label: `${emp.name}${emp.department ? ` (${emp.department})` : ""}`,
              })),
            ]}
          />
          <Select
            label="النوع"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={[
              { value: "SICK", label: "مرضي" },
              { value: "ANNUAL", label: "سنوي" },
              { value: "EMERGENCY", label: "طارئ" },
              { value: "PERSONAL", label: "شخصي" },
            ]}
          />
          <Input
            label="تاريخ البداية"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
          <Input
            label="تاريخ النهاية"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
          <Input
            label="السبب"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => { setModalOpen(false); setFormData(emptyForm); }}>
              إلغاء
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleAdd} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "إضافة"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
