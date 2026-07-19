"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2, ArrowRight, Pencil, Plus, Info, MessageSquareText, FileText,
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
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { toast } from "sonner";

type Interaction = {
  id: string;
  type: string;
  description: string;
  date: string;
  createdBy: { id: string; name: string };
};

type Invoice = {
  id: string;
  invoiceNumber: string;
  date: string;
  totalAmount: number;
  status: string;
};

type Client = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  type: string;
  status: string;
  notes: string | null;
  interactions: Interaction[];
  invoices: Invoice[];
};

type TabId = "info" | "interactions" | "invoices";

const tabs: { id: TabId; label: string; icon: typeof Info }[] = [
  { id: "info", label: "المعلومات", icon: Info },
  { id: "interactions", label: "التفاعلات", icon: MessageSquareText },
  { id: "invoices", label: "الفواتير", icon: FileText },
];

const statusBadge = (type: string) => {
  const map: Record<string, { variant: "success" | "danger" | "primary" | "default" | "warning"; label: string }> = {
    ACTIVE: { variant: "success", label: "نشط" },
    INACTIVE: { variant: "danger", label: "غير نشط" },
    LEAD: { variant: "default", label: "عميل محتمل" },
    CUSTOMER: { variant: "primary", label: "عميل" },
    CALL: { variant: "primary", label: "اتصال" },
    EMAIL: { variant: "default", label: "بريد إلكتروني" },
    MEETING: { variant: "warning", label: "اجتماع" },
    NOTE: { variant: "default", label: "ملاحظة" },
    DRAFT: { variant: "default", label: "مسودة" },
    SENT: { variant: "primary", label: "مرسلة" },
    PAID: { variant: "success", label: "مدفوعة" },
    CANCELLED: { variant: "danger", label: "ملغية" },
    OVERDUE: { variant: "warning", label: "متأخرة" },
  };
  const item = map[type] || { variant: "default" as const, label: type };
  return <Badge variant={item.variant}>{item.label}</Badge>;
};

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("info");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [interactionModalOpen, setInteractionModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    type: "LEAD",
    status: "ACTIVE",
    notes: "",
  });
  const [interactionForm, setInteractionForm] = useState({
    type: "NOTE",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const fetchClient = useCallback(async () => {
    try {
      const res = await fetch(`/api/clients/${id}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setClient(data);
      setFormData({
        name: data.name,
        email: data.email || "",
        phone: data.phone || "",
        company: data.company || "",
        type: data.type,
        status: data.status,
        notes: data.notes || "",
      });
    } catch {
      toast.error("فشل تحميل بيانات العميل");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/clients", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...formData }),
      });
      if (!res.ok) throw new Error();
      toast.success("تم تحديث بيانات العميل");
      setEditModalOpen(false);
      fetchClient();
    } catch {
      toast.error("فشل حفظ البيانات");
    } finally {
      setSaving(false);
    }
  };

  const handleAddInteraction = async () => {
    if (!interactionForm.description.trim()) {
      toast.error("الوصف مطلوب");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/clients/interactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: id,
          type: interactionForm.type,
          description: interactionForm.description,
          date: interactionForm.date,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("تم إضافة التفاعل");
      setInteractionModalOpen(false);
      setInteractionForm({
        type: "NOTE",
        description: "",
        date: new Date().toISOString().split("T")[0],
      });
      fetchClient();
    } catch {
      toast.error("فشل إضافة التفاعل");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">العميل غير موجود</p>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/dashboard/clients")}>
          <ArrowRight className="h-4 w-4" />
          العودة للعملاء
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/clients")}>
            <ArrowRight className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{client.name}</h1>
            <p className="text-gray-500 mt-1">{client.company || "—"}</p>
          </div>
        </div>
        <Button variant="primary" onClick={() => setEditModalOpen(true)}>
          <Pencil className="h-4 w-4" />
          تعديل البيانات
        </Button>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "info" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs text-gray-500 mb-1">الاسم</p>
              <p className="font-medium text-gray-900 dark:text-white">{client.name}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs text-gray-500 mb-1">البريد الإلكتروني</p>
              <p className="font-medium text-gray-900 dark:text-white dir-ltr text-left">{client.email || "—"}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs text-gray-500 mb-1">الهاتف</p>
              <p className="font-medium text-gray-900 dark:text-white">{client.phone || "—"}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs text-gray-500 mb-1">الشركة</p>
              <p className="font-medium text-gray-900 dark:text-white">{client.company || "—"}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs text-gray-500 mb-1">النوع</p>
              <div>{statusBadge(client.type)}</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs text-gray-500 mb-1">الحالة</p>
              <div>{statusBadge(client.status)}</div>
            </CardContent>
          </Card>
          {client.notes && (
            <Card className="border-0 shadow-sm md:col-span-2 lg:col-span-3">
              <CardContent className="p-5">
                <p className="text-xs text-gray-500 mb-1">ملاحظات</p>
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{client.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === "interactions" && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>التفاعلات</CardTitle>
                <CardDescription>سجل التواصل مع العميل</CardDescription>
              </div>
              <Button variant="primary" size="sm" onClick={() => setInteractionModalOpen(true)}>
                <Plus className="h-4 w-4" />
                إضافة تفاعل
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {client.interactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">لا توجد تفاعلات</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>النوع</TableHead>
                    <TableHead>الوصف</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>بواسطة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {client.interactions.map((interaction) => (
                    <TableRow key={interaction.id}>
                      <TableCell>{statusBadge(interaction.type)}</TableCell>
                      <TableCell className="max-w-xs truncate">{interaction.description}</TableCell>
                      <TableCell>{formatDateTime(interaction.date)}</TableCell>
                      <TableCell>{interaction.createdBy.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "invoices" && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>الفواتير</CardTitle>
            <CardDescription>فواتير العميل</CardDescription>
          </CardHeader>
          <CardContent>
            {client.invoices.length === 0 ? (
              <p className="text-gray-500 text-center py-8">لا توجد فواتير</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>رقم الفاتورة</TableHead>
                    <TableHead>التاريخ</TableHead>
                    <TableHead>الإجمالي</TableHead>
                    <TableHead>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {client.invoices.map((inv) => (
                    <TableRow
                      key={inv.id}
                      className="cursor-pointer"
                      onClick={() => router.push(`/dashboard/sales/invoices/${inv.id}`)}
                    >
                      <TableCell className="font-medium">{inv.invoiceNumber}</TableCell>
                      <TableCell>{formatDate(inv.date)}</TableCell>
                      <TableCell>{formatCurrency(inv.totalAmount)}</TableCell>
                      <TableCell>{statusBadge(inv.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="تعديل بيانات العميل"
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
            label="الهاتف"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
              { value: "LEAD", label: "عميل محتمل" },
              { value: "CUSTOMER", label: "عميل" },
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
          <Input
            label="ملاحظات"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setEditModalOpen(false)}>
              إلغاء
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "حفظ التعديلات"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={interactionModalOpen}
        onClose={() => setInteractionModalOpen(false)}
        title="إضافة تفاعل جديد"
      >
        <div className="space-y-4">
          <Select
            label="النوع"
            value={interactionForm.type}
            onChange={(e) => setInteractionForm({ ...interactionForm, type: e.target.value })}
            options={[
              { value: "CALL", label: "اتصال" },
              { value: "EMAIL", label: "بريد إلكتروني" },
              { value: "MEETING", label: "اجتماع" },
              { value: "NOTE", label: "ملاحظة" },
            ]}
          />
          <Input
            label="الوصف"
            value={interactionForm.description}
            onChange={(e) => setInteractionForm({ ...interactionForm, description: e.target.value })}
          />
          <Input
            label="التاريخ"
            type="date"
            value={interactionForm.date}
            onChange={(e) => setInteractionForm({ ...interactionForm, date: e.target.value })}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setInteractionModalOpen(false)}>
              إلغاء
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleAddInteraction} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "إضافة"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
