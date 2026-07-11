"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2, ArrowRight, Plus, Edit3,
  ChevronDown, ChevronLeft,
} from "lucide-react";
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

type Client = {
  id: string;
  name: string;
  company: string | null;
};

type Manager = {
  id: string;
  name: string;
  email: string;
};

type Task = {
  id: string;
  name: string;
  description: string | null;
  assignedTo: string | null;
  assignee: { id: string; name: string; email: string } | null;
  status: string;
  priority: string;
  dueDate: string | null;
};

type Project = {
  id: string;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  status: string;
  budget: number;
  client: Client | null;
  manager: Manager | null;
  _count?: { tasks: number };
};

const statusConfig: Record<string, { variant: "primary" | "warning" | "success" | "danger" | "default"; label: string }> = {
  PLANNING: { variant: "primary", label: "تخطيط" },
  IN_PROGRESS: { variant: "warning", label: "قيد التنفيذ" },
  ON_HOLD: { variant: "default", label: "معلق" },
  COMPLETED: { variant: "success", label: "مكتمل" },
  CANCELLED: { variant: "danger", label: "ملغي" },
};

const priorityConfig: Record<string, { variant: "success" | "warning" | "danger" | "default"; label: string }> = {
  LOW: { variant: "success", label: "منخفضة" },
  MEDIUM: { variant: "warning", label: "متوسطة" },
  HIGH: { variant: "danger", label: "عالية" },
  URGENT: { variant: "default", label: "عاجلة" },
};

const taskStatusConfig: Record<string, { variant: "default" | "warning" | "primary" | "success"; label: string }> = {
  TODO: { variant: "default", label: "للتنفيذ" },
  IN_PROGRESS: { variant: "warning", label: "قيد التنفيذ" },
  REVIEW: { variant: "primary", label: "مراجعة" },
  DONE: { variant: "success", label: "منتهية" },
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [taskForm, setTaskForm] = useState({
    name: "",
    description: "",
    assignedTo: "",
    priority: "MEDIUM",
    dueDate: "",
  });

  const fetchData = useCallback(async () => {
    try {
      const [projectsRes, tasksRes, employeesRes] = await Promise.all([
        fetch("/api/projects"),
        fetch(`/api/tasks?projectId=${id}`),
        fetch("/api/employees"),
      ]);
      const projectsData = await projectsRes.json();
      const tasksData = await tasksRes.json();
      const employeesData = await employeesRes.json();

      const projects = Array.isArray(projectsData) ? projectsData : projectsData.projects || [];
      const found = projects.find((p: any) => p.id === id);
      if (!found) throw new Error("المشروع غير موجود");

      setProject(found);
      setTasks(Array.isArray(tasksData) ? tasksData : []);
      setEmployees(
        Array.isArray(employeesData)
          ? employeesData.map((e: any) => ({ id: e.id, name: e.name }))
          : (employeesData.employees || []).map((e: any) => ({ id: e.id, name: e.name }))
      );
    } catch (err: any) {
      toast.error(err.message || "فشل تحميل المشروع");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddTask = async () => {
    if (!taskForm.name.trim()) {
      toast.error("اسم المهمة مطلوب");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: id,
          name: taskForm.name,
          description: taskForm.description,
          assignedTo: taskForm.assignedTo || undefined,
          priority: taskForm.priority,
          dueDate: taskForm.dueDate || undefined,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("تم إضافة المهمة بنجاح");
      setTaskModalOpen(false);
      setTaskForm({ name: "", description: "", assignedTo: "", priority: "MEDIUM", dueDate: "" });
      const tasksRes = await fetch(`/api/tasks?projectId=${id}`);
      const tasksData = await tasksRes.json();
      setTasks(Array.isArray(tasksData) ? tasksData : []);
    } catch {
      toast.error("فشل إضافة المهمة");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskId, status: newStatus }),
      });
      if (!res.ok) throw new Error();
      toast.success("تم تحديث حالة المهمة");
      const tasksRes = await fetch(`/api/tasks?projectId=${id}`);
      const tasksData = await tasksRes.json();
      setTasks(Array.isArray(tasksData) ? tasksData : []);
    } catch {
      toast.error("فشل تحديث المهمة");
    }
  };

  const groupedTasks = tasks.reduce<Record<string, Task[]>>((acc, t) => {
    if (!acc[t.status]) acc[t.status] = [];
    acc[t.status].push(t);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">المشروع غير موجود</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/projects")}>
          <ArrowRight className="h-4 w-4" />
          العودة للمشاريع
        </Button>
      </div>
    );
  }

  const projectStatusBadge = (status: string) => {
    const config = statusConfig[status] || { variant: "default" as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const kanbanColumns = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];
  const kanbanLabels: Record<string, string> = {
    TODO: "للتنفيذ",
    IN_PROGRESS: "قيد التنفيذ",
    REVIEW: "مراجعة",
    DONE: "منتهية",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/projects")}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
              {projectStatusBadge(project.status)}
            </div>
            <p className="text-gray-500 mt-1">{project.description || "—"}</p>
          </div>
        </div>
        <Button variant="primary" onClick={() => setTaskModalOpen(true)}>
          <Plus className="h-4 w-4" />
          إضافة مهمة
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">الميزانية</p>
            <p className="font-medium text-gray-900">{formatCurrency(project.budget)}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">تاريخ البدء</p>
            <p className="font-medium text-gray-900">{formatDate(project.startDate)}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">تاريخ الانتهاء</p>
            <p className="font-medium text-gray-900">{project.endDate ? formatDate(project.endDate) : "—"}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">المهام</p>
            <p className="font-medium text-gray-900">{tasks.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">العميل</p>
            <p className="font-medium text-gray-900">{project.client?.name || "—"}</p>
            {project.client?.company && (
              <p className="text-sm text-gray-500">{project.client.company}</p>
            )}
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-1">مدير المشروع</p>
            <p className="font-medium text-gray-900">{project.manager?.name || "—"}</p>
            {project.manager?.email && (
              <p className="text-sm text-gray-500">{project.manager.email}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>المهام</CardTitle>
              <CardDescription>إدارة مهام المشروع</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setTaskModalOpen(true)}>
              <Plus className="h-4 w-4" />
              إضافة مهمة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {kanbanColumns.map((col) => {
              const colTasks = groupedTasks[col] || [];
              return (
                <div key={col} className="bg-gray-50 rounded-lg p-3 min-h-[200px]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      {kanbanLabels[col]}
                    </span>
                    <span className="text-xs text-gray-400 bg-white rounded-full px-2 py-0.5">
                      {colTasks.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {colTasks.map((task) => (
                      <div key={task.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-gray-900">{task.name}</p>
                          <Badge
                            variant={priorityConfig[task.priority]?.variant || "default"}
                            className="text-[10px]"
                          >
                            {priorityConfig[task.priority]?.label || task.priority}
                          </Badge>
                        </div>
                        {task.assignee && (
                          <p className="text-xs text-gray-500 mt-1">{task.assignee.name}</p>
                        )}
                        {task.dueDate && (
                          <p className="text-xs text-gray-400 mt-1">{formatDate(task.dueDate)}</p>
                        )}
                        <div className="mt-2">
                          <Select
                            value={task.status}
                            onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                            options={[
                              { value: "TODO", label: "للتنفيذ" },
                              { value: "IN_PROGRESS", label: "قيد التنفيذ" },
                              { value: "REVIEW", label: "مراجعة" },
                              { value: "DONE", label: "منتهية" },
                            ]}
                          />
                        </div>
                      </div>
                    ))}
                    {colTasks.length === 0 && (
                      <p className="text-xs text-gray-400 text-center py-4">لا توجد مهام</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>جدول المهام</CardTitle>
          <CardDescription>عرض جميع المهام في جدول</CardDescription>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">لا توجد مهام</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المهمة</TableHead>
                  <TableHead>المسؤول</TableHead>
                  <TableHead>الأولوية</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ الاستحقاق</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-medium">{task.name}</TableCell>
                    <TableCell>{task.assignee?.name || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={priorityConfig[task.priority]?.variant || "default"}>
                        {priorityConfig[task.priority]?.label || task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={taskStatusConfig[task.status]?.variant || "default"}>
                        {taskStatusConfig[task.status]?.label || task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{task.dueDate ? formatDate(task.dueDate) : "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setTaskForm({ name: "", description: "", assignedTo: "", priority: "MEDIUM", dueDate: "" });
        }}
        title="إضافة مهمة جديدة"
      >
        <div className="space-y-4">
          <Input
            label="اسم المهمة"
            value={taskForm.name}
            onChange={(e) => setTaskForm({ ...taskForm, name: e.target.value })}
          />
          <Input
            label="الوصف"
            value={taskForm.description}
            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
          />
          <Select
            label="المسؤول"
            value={taskForm.assignedTo}
            onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
            options={[
              { value: "", label: "بدون" },
              ...employees.map((emp) => ({ value: emp.id, label: emp.name })),
            ]}
          />
          <Select
            label="الأولوية"
            value={taskForm.priority}
            onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
            options={[
              { value: "LOW", label: "منخفضة" },
              { value: "MEDIUM", label: "متوسطة" },
              { value: "HIGH", label: "عالية" },
              { value: "URGENT", label: "عاجلة" },
            ]}
          />
          <Input
            label="تاريخ الاستحقاق"
            type="date"
            value={taskForm.dueDate}
            onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
          />
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setTaskModalOpen(false);
                setTaskForm({ name: "", description: "", assignedTo: "", priority: "MEDIUM", dueDate: "" });
              }}
            >
              إلغاء
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleAddTask} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "إضافة"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
