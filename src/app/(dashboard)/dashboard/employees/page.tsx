"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { formatCurrency } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { toast } from "sonner";

type Employee = { id: string; name: string; email: string; department: string; position: string; salary: number; status: string };
type EmployeeForm = { name: string; email: string; password?: string; department: string; position: string; salary: number; status: string };

const emptyForm: EmployeeForm = {
  name: "", email: "", password: "", department: "", position: "", salary: 0, status: "ACTIVE",
};

export default function EmployeesPage() {
  const router = useRouter();
  const currentUser = useAppStore((s) => s.currentUser);
  const isAdmin = currentUser?.role === "ADMIN";
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchEmployees = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/employees?${params}`);
      setEmployees(Array.isArray(await res.json()) ? await res.json() : []);
    } catch { toast.error("فشل تحميل البيانات"); } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchEmployees(); }, [search]);

  const openAdd = () => { setEditing(null); setFormData(emptyForm); setModalOpen(true); };

  const openEdit = (emp: Employee) => {
    setEditing(emp);
    setFormData({
      name: emp.name, email: emp.email, department: emp.department,
      position: emp.position, salary: emp.salary, status: emp.status,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = editing
        ? await fetch(`/api/employees/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) })
        : await fetch("/api/employees", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      if (!res.ok) throw new Error();
      toast.success(editing ? "تم تحديث البيانات" : "تم إضافة الموظف");
      setModalOpen(false);
      fetchEmployees();
    } catch { toast.error("فشل حفظ البيانات"); } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    try {
      const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("تم حذف الموظف");
      fetchEmployees();
    } catch { toast.error("فشل الحذف"); }
  };

  const badgeStatus = (status: string) => {
    const map: Record<string, { v: "success" | "danger" | "warning"; l: string }> = {
      ACTIVE: { v: "success", l: "نشط" }, INACTIVE: { v: "danger", l: "غير نشط" }, TERMINATED: { v: "warning", l: "منتهي" },
    };
    const m = map[status] || { v: "default" as const, l: status };
    return <Badge variant={m.v}>{m.l}</Badge>;
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">الموظفين</h1>
          <p className="mt-0.5 text-sm text-gray-500">إدارة بيانات الموظفين</p>
        </div>
        {isAdmin && (
          <Button variant="primary" onClick={openAdd}>
            <Plus className="h-4 w-4" />
            إضافة موظف
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="relative w-full max-w-xs">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              className="form-input pr-10"
              placeholder="بحث..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-0">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : employees.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-500">لا يوجد موظفين</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">الاسم</TableHead>
                    <TableHead className="whitespace-nowrap">البريد</TableHead>
                    <TableHead className="whitespace-nowrap">القسم</TableHead>
                    <TableHead className="whitespace-nowrap">الوظيفة</TableHead>
                    <TableHead className="whitespace-nowrap">الراتب</TableHead>
                    <TableHead className="whitespace-nowrap">الحالة</TableHead>
                    <TableHead className="whitespace-nowrap text-center">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((emp) => (
                    <TableRow key={emp.id}>
                      <TableCell className="font-medium whitespace-nowrap">{emp.name}</TableCell>
                      <TableCell className="whitespace-nowrap text-xs text-gray-500">{emp.email}</TableCell>
                      <TableCell className="whitespace-nowrap">{emp.department}</TableCell>
                      <TableCell className="whitespace-nowrap">{emp.position}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatCurrency(emp.salary)}</TableCell>
                      <TableCell>{badgeStatus(emp.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/employees/${emp.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {isAdmin && (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => openEdit(emp)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(emp.id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "تعديل موظف" : "إضافة موظف جديد"}>
        <div className="space-y-4">
          <Input label="الاسم" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <Input label="البريد الإلكتروني" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          {!editing && <Input label="كلمة المرور" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />}
          <Input label="القسم" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
          <Input label="الوظيفة" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} />
          <Input label="الراتب" type="number" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })} />
          <Select label="الحالة" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} options={[
            { value: "ACTIVE", label: "نشط" }, { value: "INACTIVE", label: "غير نشط" }, { value: "TERMINATED", label: "منتهي" },
          ]} />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>إلغاء</Button>
            <Button variant="primary" className="flex-1" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editing ? "حفظ" : "إضافة"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
