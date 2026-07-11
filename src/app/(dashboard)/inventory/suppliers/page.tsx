"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { SupplierForm } from "@/components/forms";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await fetch("/api/inventory/suppliers");
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingSupplier(null);
    setIsFormOpen(true);
  };

  const handleEdit = (supplier: any) => {
    setEditingSupplier(supplier);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المورد؟")) return;
    
    try {
      await fetch(`/api/inventory/suppliers/${id}`, { method: "DELETE" });
      fetchSuppliers();
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const url = editingSupplier 
        ? `/api/inventory/suppliers/${editingSupplier.id}`
        : "/api/inventory/suppliers";
      
      const method = editingSupplier ? "PUT" : "POST";
      
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      setIsFormOpen(false);
      fetchSuppliers();
    } catch (error) {
      console.error("Error saving supplier:", error);
    }
  };

  if (loading) {
    return <div className="p-6">جاري التحميل...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">الموردون</h1>
        <Button onClick={handleAdd} variant="primary">
          <Plus className="w-4 h-4 ml-2" />
          إضافة مورد
        </Button>
      </div>

      <Table
        columns={[
          { header: "الاسم", accessor: "name" },
          { header: "البريد الإلكتروني", accessor: "email" },
          { header: "الهاتف", accessor: "phone" },
          { header: "العنوان", accessor: "address" },
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
        data={suppliers}
      />

      <SupplierForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingSupplier}
      />
    </div>
  );
}
