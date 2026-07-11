"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, Trash2 } from "lucide-react";
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
import { Modal } from "@/components/ui/modal";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

type Account = {
  id: string;
  code: string;
  name: string;
};

type JournalLine = {
  id: string;
  debit: number;
  credit: number;
  description: string | null;
  account: Account;
};

type JournalEntry = {
  id: string;
  date: string;
  description: string;
  reference: string | null;
  createdBy: { id: string; name: string };
  lines: JournalLine[];
};

type LineForm = {
  accountId: string;
  debit: number;
  credit: number;
  description: string;
};

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    reference: "",
  });
  const [lines, setLines] = useState<LineForm[]>([
    { accountId: "", debit: 0, credit: 0, description: "" },
    { accountId: "", debit: 0, credit: 0, description: "" },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [entriesRes, accountsRes] = await Promise.all([
        fetch("/api/accounting/journal"),
        fetch("/api/accounting/accounts"),
      ]);
      const entriesData = await entriesRes.json();
      const accountsData = await accountsRes.json();
      setEntries(Array.isArray(entriesData) ? entriesData : []);
      setAccounts(Array.isArray(accountsData) ? accountsData : []);
    } catch {
      toast.error("فشل تحميل البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  const addLine = () => {
    setLines([...lines, { accountId: "", debit: 0, credit: 0, description: "" }]);
  };

  const removeLine = (index: number) => {
    if (lines.length <= 2) {
      toast.error("يجب وجود سطرين على الأقل");
      return;
    }
    setLines(lines.filter((_, i) => i !== index));
  };

  const updateLine = (index: number, field: keyof LineForm, value: string | number) => {
    const updated = [...lines];
    (updated[index] as any)[field] = value;
    setLines(updated);
  };

  const totalDebit = lines.reduce((sum, l) => sum + (l.debit || 0), 0);
  const totalCredit = lines.reduce((sum, l) => sum + (l.credit || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  const accountOptions = accounts.map((a) => ({
    value: a.id,
    label: `${a.code} - ${a.name}`,
  }));

  const handleSave = async () => {
    if (!formData.description.trim()) {
      toast.error("البيان مطلوب");
      return;
    }
    if (lines.some((l) => !l.accountId)) {
      toast.error("جميع الحسابات مطلوبة");
      return;
    }
    if (lines.some((l) => l.debit === 0 && l.credit === 0)) {
      toast.error("يجب أن يكون لكل سطر قيمة مدين أو دائن");
      return;
    }
    if (!isBalanced) {
      toast.error("مجموع المدين يجب أن يساوي مجموع الدائن");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/accounting/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: formData.date,
          description: formData.description,
          reference: formData.reference || undefined,
          lines: lines.map((l) => ({
            accountId: l.accountId,
            debit: l.debit,
            credit: l.credit,
            description: l.description,
          })),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "فشل إنشاء القيد");
      }
      toast.success("تم إضافة قيد اليومية بنجاح");
      setModalOpen(false);
      setFormData({
        date: new Date().toISOString().split("T")[0],
        description: "",
        reference: "",
      });
      setLines([
        { accountId: "", debit: 0, credit: 0, description: "" },
        { accountId: "", debit: 0, credit: 0, description: "" },
      ]);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "فشل إنشاء القيد");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">قيود اليومية</h1>
          <p className="text-gray-500 mt-1">تسجيل وعرض قيود اليومية المحاسبية</p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" />
          إضافة قيد
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>سجل القيود</CardTitle>
          <CardDescription>جميع قيود اليومية المسجلة</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : entries.length === 0 ? (
            <p className="text-gray-500 text-center py-8">لا توجد قيود يومية</p>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => {
                const entryTotalDebit = entry.lines.reduce((s, l) => s + l.debit, 0);
                const entryTotalCredit = entry.lines.reduce((s, l) => s + l.credit, 0);
                return (
                  <div key={entry.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(entry.date)}
                        </span>
                        <span className="text-sm text-gray-500">{entry.description}</span>
                        {entry.reference && (
                          <span className="text-xs text-gray-400 font-mono">#{entry.reference}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500">{entry.createdBy.name}</span>
                      </div>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>الحساب</TableHead>
                          <TableHead>البيان</TableHead>
                          <TableHead className="text-left">مدين</TableHead>
                          <TableHead className="text-left">دائن</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {entry.lines.map((line) => (
                          <TableRow key={line.id}>
                            <TableCell className="font-medium">
                              {line.account.code} - {line.account.name}
                            </TableCell>
                            <TableCell className="text-gray-500">{line.description || "—"}</TableCell>
                            <TableCell className="text-left font-mono text-red-600">
                              {line.debit > 0 ? formatCurrency(line.debit) : "—"}
                            </TableCell>
                            <TableCell className="text-left font-mono text-green-600">
                              {line.credit > 0 ? formatCurrency(line.credit) : "—"}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-gray-50 font-medium">
                          <TableCell colSpan={2}>الإجمالي</TableCell>
                          <TableCell className="text-left font-mono text-red-600">
                            {formatCurrency(entryTotalDebit)}
                          </TableCell>
                          <TableCell className="text-left font-mono text-green-600">
                            {formatCurrency(entryTotalCredit)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
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
          setLines([
            { accountId: "", debit: 0, credit: 0, description: "" },
            { accountId: "", debit: 0, credit: 0, description: "" },
          ]);
        }}
        title="إضافة قيد يومية جديد"
        className="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="التاريخ"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
            <Input
              label="المرجع"
              placeholder="اختياري"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
            />
          </div>
          <Input
            label="البيان"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>الحساب</TableHead>
                  <TableHead>البيان</TableHead>
                  <TableHead className="text-left">مدين</TableHead>
                  <TableHead className="text-left">دائن</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lines.map((line, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Select
                        value={line.accountId}
                        onChange={(e) => updateLine(index, "accountId", e.target.value)}
                        options={accountOptions}
                        placeholder="اختر حساب"
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="وصف"
                        value={line.description}
                        onChange={(e) => updateLine(index, "description", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="number"
                        className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left font-mono"
                        value={line.debit || ""}
                        onChange={(e) => updateLine(index, "debit", Number(e.target.value))}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="number"
                        className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-left font-mono"
                        value={line.credit || ""}
                        onChange={(e) => updateLine(index, "credit", Number(e.target.value))}
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => removeLine(index)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm" onClick={addLine}>
              <Plus className="h-4 w-4" />
              إضافة سطر
            </Button>
            <div className="flex items-center gap-4 text-sm">
              <span className={`font-medium ${isBalanced ? "text-green-600" : "text-red-600"}`}>
                المدين: {formatCurrency(totalDebit)}
              </span>
              <span className={`font-medium ${isBalanced ? "text-green-600" : "text-red-600"}`}>
                الدائن: {formatCurrency(totalCredit)}
              </span>
              {!isBalanced && (
                <span className="text-xs text-red-500">غير متوازن!</span>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setModalOpen(false);
                setLines([
                  { accountId: "", debit: 0, credit: 0, description: "" },
                  { accountId: "", debit: 0, credit: 0, description: "" },
                ]);
              }}
            >
              إلغاء
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleSave}
              disabled={saving || !isBalanced}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "حفظ القيد"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
