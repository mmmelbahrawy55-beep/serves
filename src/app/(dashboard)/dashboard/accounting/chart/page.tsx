"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, ChevronDown, ChevronLeft } from "lucide-react";
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
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

type Account = {
  id: string;
  code: string;
  name: string;
  type: string;
  balance: number;
  parentId: string | null;
  isActive: boolean;
};

const accountTypeLabels: Record<string, string> = {
  ASSET: "أصول",
  LIABILITY: "خصوم",
  EQUITY: "حقوق ملكية",
  INCOME: "إيرادات",
  EXPENSE: "مصروفات",
};

const accountTypeColors: Record<string, "primary" | "success" | "warning" | "default" | "danger"> = {
  ASSET: "primary",
  LIABILITY: "warning",
  EQUITY: "success",
  INCOME: "default",
  EXPENSE: "danger",
};

const emptyForm = {
  code: "",
  name: "",
  type: "ASSET",
  parentId: "",
  balance: 0,
};

export default function ChartOfAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>({
    ASSET: true,
    LIABILITY: true,
    EQUITY: true,
    INCOME: true,
    EXPENSE: true,
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/accounting/accounts");
      const data = await res.json();
      setAccounts(Array.isArray(data) ? data : []);
    } catch {
      toast.error("فشل تحميل الحسابات");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleType = (type: string) => {
    setExpandedTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSave = async () => {
    if (!formData.code || !formData.name) {
      toast.error("رمز الحساب والاسم مطلوبان");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/accounting/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: formData.code,
          name: formData.name,
          type: formData.type,
          parentId: formData.parentId || undefined,
          balance: formData.balance,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "فشل إنشاء الحساب");
      }
      toast.success("تم إضافة الحساب بنجاح");
      setModalOpen(false);
      setFormData(emptyForm);
      fetchAccounts();
    } catch (err: any) {
      toast.error(err.message || "فشل إنشاء الحساب");
    } finally {
      setSaving(false);
    }
  };

  const groupedAccounts = accounts.reduce<Record<string, Account[]>>((acc, acct) => {
    if (!acc[acct.type]) acc[acct.type] = [];
    acc[acct.type].push(acct);
    return acc;
  }, {});

  const typeOrder = ["ASSET", "LIABILITY", "EQUITY", "INCOME", "EXPENSE"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">دليل الحسابات</h1>
          <p className="text-gray-500 mt-1">إدارة حسابات الشركة</p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" />
          إضافة حساب
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>قائمة الحسابات</CardTitle>
          <CardDescription>عرض جميع حسابات الشركة مصنفة حسب النوع</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : accounts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">لا توجد حسابات</p>
          ) : (
            <div className="space-y-4">
              {typeOrder.map((type) => {
                const typeAccounts = groupedAccounts[type] || [];
                const totalBalance = typeAccounts.reduce((sum, a) => sum + a.balance, 0);
                const isExpanded = expandedTypes[type];

                return (
                  <div key={type} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleType(type)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 transition-colors text-right"
                    >
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        ) : (
                          <ChevronLeft className="h-4 w-4 text-gray-400" />
                        )}
                        <Badge variant={accountTypeColors[type] || "default"}>
                          {accountTypeLabels[type] || type}
                        </Badge>
                        <span className="text-sm text-gray-500">({typeAccounts.length})</span>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {formatCurrency(totalBalance)}
                      </span>
                    </button>
                    {isExpanded && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>الكود</TableHead>
                            <TableHead>الاسم</TableHead>
                            <TableHead>النوع</TableHead>
                            <TableHead className="text-left">الرصيد</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {typeAccounts.map((acct) => (
                            <TableRow key={acct.id}>
                              <TableCell className="font-mono text-sm text-gray-500">
                                {acct.code}
                              </TableCell>
                              <TableCell className="font-medium">{acct.name}</TableCell>
                              <TableCell>
                                <Badge variant={accountTypeColors[acct.type] || "default"}>
                                  {accountTypeLabels[acct.type] || acct.type}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-left font-mono">
                                {formatCurrency(acct.balance)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setFormData(emptyForm);
        }}
        title="إضافة حساب جديد"
      >
        <div className="space-y-4">
          <Input
            label="رمز الحساب"
            placeholder="مثال: 1001"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
          <Input
            label="اسم الحساب"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Select
            label="النوع"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={[
              { value: "ASSET", label: "أصول" },
              { value: "LIABILITY", label: "خصوم" },
              { value: "EQUITY", label: "حقوق ملكية" },
              { value: "INCOME", label: "إيرادات" },
              { value: "EXPENSE", label: "مصروفات" },
            ]}
          />
          <Select
            label="الحساب الأب"
            value={formData.parentId}
            onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
            options={[
              { value: "", label: "بدون (حساب رئيسي)" },
              ...accounts.map((a) => ({ value: a.id, label: `${a.code} - ${a.name}` })),
            ]}
          />
          <Input
            label="الرصيد الافتتاحي"
            type="number"
            value={formData.balance}
            onChange={(e) => setFormData({ ...formData, balance: Number(e.target.value) })}
          />
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setModalOpen(false);
                setFormData(emptyForm);
              }}
            >
              إلغاء
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "إضافة"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
