"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProjectForm } from "@/components/forms";
import { Plus, Pencil, Trash2, FolderKanban } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, clientsRes, employeesRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/clients"),
        fetch("/api/employees"),
      ]);
      
      const projectsData = await projectsRes.json();
      const clientsData = await clientsRes.json();
      const employeesData = await employeesRes.json();
      
      setProjects(projectsData);
      setClients(clientsData);
      setEmployees(employeesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProject(null);
    setIsFormOpen(true);
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المشروع؟")) return;
    
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const url = editingProject 
        ? `/api/projects/${editingProject.id}`
        : "/api/projects";
      
      const method = editingProject ? "PUT" : "POST";
      
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      setIsFormOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  if (loading) {
    return <div className="p-6">جاري التحميل...</div>;
  }

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === "IN_PROGRESS").length;
  const completedProjects = projects.filter(p => p.status === "COMPLETED").length;
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">المشاريع</h1>
        <Button onClick={handleAdd} variant="primary">
          <Plus className="w-4 h-4 ml-2" />
          إضافة مشروع
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي المشاريع</p>
              <p className="text-2xl font-bold text-gray-900">{totalProjects}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FolderKanban className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">قيد التنفيذ</p>
              <p className="text-2xl font-bold text-yellow-600">{activeProjects}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <FolderKanban className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">مكتملة</p>
              <p className="text-2xl font-bold text-green-600">{completedProjects}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FolderKanban className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">إجمالي الميزانية</p>
              <p className="text-2xl font-bold text-purple-600">{totalBudget.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FolderKanban className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">قائمة المشاريع</h2>
        <Table
          columns={[
            { header: "اسم المشروع", accessor: "name" },
            { header: "العميل", accessor: "client", render: (client: any) => client?.name || "-" },
            { header: "مدير المشروع", accessor: "manager", render: (manager: any) => manager?.name || "-" },
            { header: "تاريخ البدء", accessor: "startDate", render: (date: string) => new Date(date).toLocaleDateString('ar-EG') },
            { header: "تاريخ الانتهاء", accessor: "endDate", render: (date: string) => date ? new Date(date).toLocaleDateString('ar-EG') : "-" },
            { header: "الميزانية", accessor: "budget" },
            { 
              header: "الحالة", 
              accessor: "status",
              render: (value: string) => {
                const variants: Record<string, any> = {
                  PLANNING: "secondary",
                  IN_PROGRESS: "default",
                  COMPLETED: "default",
                  ON_HOLD: "secondary",
                  CANCELLED: "destructive",
                };
                const labels: Record<string, string> = {
                  PLANNING: "تخطيط",
                  IN_PROGRESS: "قيد التنفيذ",
                  COMPLETED: "مكتمل",
                  ON_HOLD: "معلق",
                  CANCELLED: "ملغي",
                };
                return <Badge variant={variants[value] || "default"}>{labels[value] || value}</Badge>;
              }
            },
            {
              header: "الإجراءات",
              render: (row: any) => (
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handleEdit(row)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(row.id)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ),
            },
          ]}
          data={projects}
        />
      </div>

      <ProjectForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingProject}
        clients={clients}
        employees={employees}
      />
    </div>
  );
}
