"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Search, Loader2 } from "lucide-react";
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
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

type Project = {
  id: string;
  name: string;
  status: string;
  budget: number;
  startDate: string;
  endDate: string | null;
  clientName: string | null;
};

const emptyProject = {
  name: "",
  status: "PLANNING",
  budget: 0,
  startDate: "",
  endDate: "",
  clientId: "",
};

const statusConfig: Record<
  string,
  { variant: "primary" | "warning" | "success" | "danger" | "default"; label: string }
> = {
  PLANNING: { variant: "primary", label: "تخطيط" },
  IN_PROGRESS: { variant: "warning", label: "قيد التنفيذ" },
  ON_HOLD: { variant: "default", label: "معلق" },
  COMPLETED: { variant: "success", label: "مكتمل" },
  CANCELLED: { variant: "danger", label: "ملغي" },
};

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptyProject);
  const [saving, setSaving] = useState(false);

  const fetchProjects = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/projects?${params}`);
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch {
      toast.error("فشل تحميل المشاريع");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [search]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      toast.success("تم إضافة المشروع بنجاح");
      setModalOpen(false);
      setFormData(emptyProject);
      fetchProjects();
    } catch {
      toast.error("فشل إضافة المشروع");
    } finally {
      setSaving(false);
    }
  };

  const statusBadge = (status: string) => {
    const config = statusConfig[status] || {
      variant: "default" as const,
      label: status,
    };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">المشاريع</h1>
          <p className="text-gray-500 mt-1">إدارة ومتابعة المشاريع</p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" />
          إضافة مشروع
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              className="flex h-10 w-full rounded-lg border border-gray-200 bg-white pr-10 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="بحث عن مشروع..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : projects.length === 0 ? (
            <p className="text-gray-500 text-center py-8">لا توجد مشاريع</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم المشروع</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الميزانية</TableHead>
                  <TableHead>تاريخ البدء</TableHead>
                  <TableHead>تاريخ الانتهاء</TableHead>
                  <TableHead>العميل</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow
                    key={project.id}
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(`/projects/${project.id}`)
                    }
                  >
                    <TableCell className="font-medium">
                      {project.name}
                    </TableCell>
                    <TableCell>{statusBadge(project.status)}</TableCell>
                    <TableCell>
                      {project.budget
                        ? formatCurrency(project.budget)
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {project.startDate
                        ? formatDate(project.startDate)
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {project.endDate
                        ? formatDate(project.endDate)
                        : "—"}
                    </TableCell>
                    <TableCell>{project.clientName || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="إضافة مشروع جديد"
      >
        <div className="space-y-4">
          <Input
            label="اسم المشروع"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
          <Select
            label="الحالة"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            options={[
              { value: "PLANNING", label: "تخطيط" },
              { value: "IN_PROGRESS", label: "قيد التنفيذ" },
              { value: "ON_HOLD", label: "معلق" },
              { value: "COMPLETED", label: "مكتمل" },
              { value: "CANCELLED", label: "ملغي" },
            ]}
          />
          <Input
            label="الميزانية"
            type="number"
            value={formData.budget}
            onChange={(e) =>
              setFormData({
                ...formData,
                budget: Number(e.target.value),
              })
            }
          />
          <Input
            label="تاريخ البدء"
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
          />
          <Input
            label="تاريخ الانتهاء"
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
          />
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setModalOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "إضافة"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
