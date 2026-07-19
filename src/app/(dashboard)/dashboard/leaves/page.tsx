"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, Check, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { formatDate } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";

type Emp = { id: string; name: string; email: string; department: string | null };
type Leave = { id: string; employeeId: string; startDate: string; endDate: string; type: string; reason: string | null; status: string; employee: Emp };

const typeLabels: Record<string, string> = { SICK: "مرضي", ANNUAL: "سنوي", EMERGENCY: "طارئ", PERSONAL: "شخصي" };
const statusConfig: Record<string, { v: "success" | "danger" | "warning" | "primary"; l: string }> = {
  PENDING: { v: "warning", l: "قيد الانتظار" }, APPROVED: { v: "success", l: "معتمدة" }, REJECTED: { v: "danger", l: "مرفوضة" },
};

const emptyForm = { employeeId: "", startDate: "", endDate: "", type: "SICK", reason: "" };

export default function LeavesPage() {
  const router = useRouter();
  const currentUser = useAppStore((s) => s.currentUser);
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [employees, setEmployees] = useState<Emp[]>([]);
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
      setLeaves(Array.isArray(await res.json()) ? await res.json() : []);
    } catch { toast.error("فشل التحميل"); }
  };

  const fetchEmployees = async () => {
    try { const res = await fetch("/api/employees"); setEmployees(Array.isArray(await res.json()) ? await res.json() : []); } catch { /* ignore */ }
  };

  useEffect(() => {
    Promise.all([fetchLeaves(), fetchEmployees()]).finally(() => setIsLoading(false));
  }, [filter]);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/leaves/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "APPROVED" }) });
      if (!res.ok) throw new Error();
      toast.success("تم اعتماد الإجازة");
      fetchLeaves();
    } catch { toast.error("فشل الاعتماد"); }
  };

  const handleReject = async (id: string) => {
    try {
      const res = await fetch(`/api/leaves/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "REJECTED" }) });
      if (!res.ok) throw new Error();
      toast.success("تم رفض الإجازة");
      fetchLeaves();
    } catch { toast.error("فشل الرفض"); }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/leaves", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (!res.ok) throw new Error();
      toast.success("تم تقديم طلب الإجازة");
      setModalOpen(false);
      fetchLeaves();
    } catch { toast.error("فشل تقديم الطلب"); } finally { setSaving(false); }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">الإجازات</h1>
          <p className="mt-0.5 text-sm text-gray-500">إدارة طلبات الإجازات</p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" />
          طلب إجازة
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              options={[
                { value: "", label: "الكل" },
                { value: "PENDING", label: "قيد الانتظار" },
                { value: "APPROVED", label: "معتمدة" },
                { value: "REJECTED", label: "مرفوضة" },
              ]}
              className="w-40"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-0">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : leaves.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-500">لا توجد إجازات</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">الموظف</TableHead>
                    <TableHead className="whitespace-nowrap">النوع</TableHead>
                    <TableHead className="whitespace-nowrap">من</TableHead>
                    <TableHead className="whitespace-nowrap">إلى</TableHead>
                    <TableHead className="whitespace-nowrap">المدة</TableHead>
                    <TableHead className="whitespace-nowrap">الحالة</TableHead>
                    <TableHead className="whitespace-nowrap text-center">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaves.map((l) => {
                    const start = new Date(l.startDate);
                    const end = new Date(l.endDate);
                    const days = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
                    const sc = statusConfig[l.status];
                    return (
                      <TableRow key={l.id}>
                        <TableCell className="font-medium whitespace-nowrap">{l.employee?.name}</TableCell>
                        <TableCell className="whitespace-nowrap">{typeLabels[l.type] || l.type}</TableCell>
                        <TableCell className="whitespace-nowrap">{formatDate(l.startDate)}</TableCell>
                        <TableCell className="whitespace-nowrap">{formatDate(l.endDate)}</TableCell>
                        <TableCell className="whitespace-nowrap">{days} يوم</TableCell>
                        <TableCell><Badge variant={sc?.v}>{sc?.l || l.status}</Badge></TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/leaves/${l.id}`)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {isAdmin && l.status === "PENDING" && (
                              <>
                                <Button variant="ghost" size="sm" onClick={() => handleApprove(l.id)}>
                                  <Check className="h-4 w-4 text-emerald-500" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleReject(l.id)}>
                                  <X className="h-4 w-4 text-red-500" />
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
            </div>
          )}
        </CardContent>
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="طلب إجازة جديدة">
        <div className="space-y-4">
          <Select
            label="الموظف"
            value={formData.employeeId}
            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            options={employees.map((e) => ({ value: e.id, label: e.name }))}
            placeholder="اختر موظفاً"
          />
          <Input label="من تاريخ" type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
          <Input label="إلى تاريخ" type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
          <Select label="نوع الإجازة" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} options={[
            { value: "SICK", label: "مرضي" }, { value: "ANNUAL", label: "سنوي" }, { value: "EMERGENCY", label: "طارئ" }, { value: "PERSONAL", label: "شخصي" },
          ]} />
          <Input label="السبب" value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>إلغاء</Button>
            <Button variant="primary" className="flex-1" onClick={handleSubmit} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "إرسال الطلب"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
