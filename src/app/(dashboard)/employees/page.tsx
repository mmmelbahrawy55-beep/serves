"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EmployeeForm } from "@/components/forms";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees");
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingEmployee(null);
    setIsFormOpen(true);
  };

  const handleEdit = (employee: any) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الموظف؟")) return;
    
    try {
      await fetch(`/api/employees/${id}`, { method: "DELETE" });
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const url = editingEmployee 
        ? `/api/employees/${editingEmployee.id}`
        : "/api/employees";
      
      const method = editingEmployee ? "PUT" : "POST";
      
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      setIsFormOpen(false);
      fetchEmployees();
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

  if (loading) {
    return <div className="p-6">جاري التحميل...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">الموظفون</h1>
        <Button onClick={handleAdd} variant="primary">
          <Plus className="w-4 h-4 ml-2" />
          إضافة موظف
        </Button>
      </div>

      <Table
        columns={[
          { header: "الاسم", accessor: "name" },
          { header: "البريد الإلكتروني", accessor: "email" },
          { header: "الهاتف", accessor: "phone" },
          { header: "القسم", accessor: "department" },
          { header: "المسمى الوظيفي", accessor: "position" },
          { 
            header: "الدور", 
            accessor: "role",
            render: (value: string) => (
              <Badge variant={value === "ADMIN" ? "destructive" : "default"}>
                {value === "ADMIN" ? "مسؤول" : value === "MANAGER" ? "مدير" : "موظف"}
              </Badge>
            )
          },
          { header: "الراتب", accessor: "salary" },
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
        data={employees}
      />

      <EmployeeForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingEmployee}
      />
    </div>
  );
}
