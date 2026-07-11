"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClientForm } from "@/components/forms";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients");
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingClient(null);
    setIsFormOpen(true);
  };

  const handleEdit = (client: any) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العميل؟")) return;
    
    try {
      await fetch(`/api/clients/${id}`, { method: "DELETE" });
      fetchClients();
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const url = editingClient 
        ? `/api/clients/${editingClient.id}`
        : "/api/clients";
      
      const method = editingClient ? "PUT" : "POST";
      
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      setIsFormOpen(false);
      fetchClients();
    } catch (error) {
      console.error("Error saving client:", error);
    }
  };

  if (loading) {
    return <div className="p-6">جاري التحميل...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">العملاء</h1>
        <Button onClick={handleAdd} variant="primary">
          <Plus className="w-4 h-4 ml-2" />
          إضافة عميل
        </Button>
      </div>

      <Table
        columns={[
          { header: "الاسم", accessor: "name" },
          { header: "البريد الإلكتروني", accessor: "email" },
          { header: "الهاتف", accessor: "phone" },
          { header: "الشركة", accessor: "company" },
          { 
            header: "النوع", 
            accessor: "type",
            render: (value: string) => (
              <Badge variant="default">
                {value === "LEAD" ? "عميل محتمل" : value === "CUSTOMER" ? "عميل" : "شريك"}
              </Badge>
            )
          },
          { 
            header: "الحالة", 
            accessor: "status",
            render: (value: string) => (
              <Badge variant={value === "ACTIVE" ? "default" : "secondary"}>
                {value === "ACTIVE" ? "نشط" : "غير نشط"}
              </Badge>
            )
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
        data={clients}
      />

      <ClientForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingClient}
      />
    </div>
  );
}
