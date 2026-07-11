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
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

type Client = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  type: string;
  status: string;
  createdAt: string;
};

const emptyClient = {
  name: "",
  email: "",
  company: "",
  type: "CLIENT",
  status: "ACTIVE",
};

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState(emptyClient);
  const [saving, setSaving] = useState(false);

  const fetchClients = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      const res = await fetch(`/api/clients?${params}`);
      const data = await res.json();
      setClients(data.clients || []);
    } catch {
      toast.error("فشل تحميل بيانات العملاء");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [search]);

  const openAddModal = () => {
    setEditingClient(null);
    setFormData(emptyClient);
    setModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      company: client.company || "",
      type: client.type,
      status: client.status,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingClient) {
        const res = await fetch(`/api/clients/${editingClient.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error();
        toast.success("تم تحديث بيانات العميل");
      } else {
        const res = await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error();
        toast.success("تم إضافة العميل بنجاح");
      }
      setModalOpen(false);
      fetchClients();
    } catch {
      toast.error("فشل حفظ البيانات");
    } finally {
      setSaving(false);
    }
  };

  const typeBadge = (type: string) => {
    const map: Record<string, { variant: "primary" | "default"; label: string }> = {
      CLIENT: { variant: "primary", label: "عميل" },
      LEAD: { variant: "default", label: "عميل محتمل" },
    };
    const item = map[type] || { variant: "default" as const, label: type };
    return <Badge variant={item.variant}>{item.label}</Badge>;
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { variant: "success" | "danger"; label: string }> = {
      ACTIVE: { variant: "success", label: "نشط" },
      INACTIVE: { variant: "danger", label: "غير نشط" },
    };
    const item = map[status] || { variant: "default" as const, label: status };
    return <Badge variant={item.variant}>{item.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">العملاء</h1>
          <p className="text-gray-500 mt-1">إدارة علاقات العملاء (CRM)</p>
        </div>
        <Button variant="primary" onClick={openAddModal}>
          <Plus className="h-4 w-4" />
          إضافة عميل
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              className="flex h-10 w-full rounded-lg border border-gray-200 bg-white pr-10 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="بحث عن عميل..."
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
          ) : clients.length === 0 ? (
            <p className="text-gray-500 text-center py-8">لا يوجد عملاء</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الاسم</TableHead>
                  <TableHead>البريد</TableHead>
                  <TableHead>الشركة</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>تاريخ التسجيل</TableHead>
                  <TableHead className="text-center">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow
                    key={client.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/clients/${client.id}`)}
                  >
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.company || "—"}</TableCell>
                    <TableCell>{typeBadge(client.type)}</TableCell>
                    <TableCell>{statusBadge(client.status)}</TableCell>
                    <TableCell>{formatDate(client.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            openEditModal(client);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
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
        title={editingClient ? "تعديل عميل" : "إضافة عميل جديد"}
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
            label="الشركة"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
          <Select
            label="النوع"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={[
              { value: "CLIENT", label: "عميل" },
              { value: "LEAD", label: "عميل محتمل" },
            ]}
          />
          <Select
            label="الحالة"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: "ACTIVE", label: "نشط" },
              { value: "INACTIVE", label: "غير نشط" },
            ]}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>
              إلغاء
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : editingClient ? (
                "حفظ التعديلات"
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
