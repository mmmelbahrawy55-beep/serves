"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

type Client = { id: string; name: string; company: string | null };
type Product = { id: string; name: string; sku: string; unitPrice: number; quantity: number };
type LineItem = { productId: string; description: string; quantity: number; unitPrice: number };

export default function NewInvoicePage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [clientId, setClientId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("");
  const [taxRate, setTaxRate] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<LineItem[]>([
    { productId: "", description: "", quantity: 1, unitPrice: 0 },
  ]);

  useEffect(() => {
    Promise.all([
      fetch("/api/clients").then((r) => r.json()),
      fetch("/api/inventory/products").then((r) => r.json()),
    ])
      .then(([clientsData, productsData]) => {
        setClients(Array.isArray(clientsData) ? clientsData : []);
        setProducts(Array.isArray(productsData) ? productsData : []);
      })
      .catch(() => toast.error("فشل تحميل البيانات"))
      .finally(() => setIsLoading(false));
  }, []);

  const selectedProduct = (index: number) =>
    products.find((p) => p.id === items[index]?.productId);

  const addItem = () => {
    setItems([...items, { productId: "", description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length <= 1) {
      toast.error("يجب وجود عنصر واحد على الأقل");
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updated = [...items];
    (updated[index] as any)[field] = value;

    if (field === "productId") {
      const prod = products.find((p) => p.id === value);
      if (prod) {
        updated[index].unitPrice = prod.unitPrice;
        updated[index].description = prod.name;
      }
    }

    setItems(updated);
  };

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const taxAmount = subtotal * (taxRate / 100);
  const totalAmount = subtotal + taxAmount - discount;

  const handleSubmit = async () => {
    if (!clientId) {
      toast.error("يرجى اختيار عميل");
      return;
    }
    if (items.some((item) => !item.description)) {
      toast.error("يرجى إدخال وصف لكل عنصر");
      return;
    }
    if (items.some((item) => item.quantity < 1)) {
      toast.error("الكمية يجب أن تكون 1 على الأقل");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/sales/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: clientId || undefined,
          date,
          dueDate: dueDate || undefined,
          taxRate,
          discount,
          notes,
          items: items.map((item) => ({
            productId: item.productId || undefined,
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "فشل إنشاء الفاتورة");
      }

      toast.success("تم إنشاء الفاتورة بنجاح");
      router.push("/dashboard/sales");
    } catch (err: any) {
      toast.error(err.message);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/sales")}>
          <ArrowRight className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">إنشاء فاتورة جديدة</h1>
          <p className="text-gray-500 mt-1">إدخال بيانات الفاتورة وعناصرها</p>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>بيانات الفاتورة</CardTitle>
          <CardDescription>العميل والتواريخ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="العميل"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              options={[
                { value: "", label: "اختر عميل..." },
                ...clients.map((c) => ({
                  value: c.id,
                  label: `${c.name}${c.company ? ` (${c.company})` : ""}`,
                })),
              ]}
            />
            <Input
              label="التاريخ"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Input
              label="تاريخ الاستحقاق"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>عناصر الفاتورة</CardTitle>
              <CardDescription>المنتجات والخدمات المفوترة</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={addItem}>
              <Plus className="h-4 w-4" />
              إضافة عنصر
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المنتج</TableHead>
                <TableHead>الوصف</TableHead>
                <TableHead className="text-center">الكمية</TableHead>
                <TableHead className="text-left">السعر</TableHead>
                <TableHead className="text-left">الإجمالي</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => {
                const product = selectedProduct(index);
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <Select
                        value={item.productId}
                        onChange={(e) => updateItem(index, "productId", e.target.value)}
                        options={[
                          { value: "", label: "بدون" },
                          ...products.map((p) => ({
                            value: p.id,
                            label: `${p.name} (${p.sku})`,
                          })),
                        ]}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        className="flex h-10 w-full rounded-lg border border-gray-200 bg-white dark:bg-dark-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="وصف الصنف"
                        value={item.description}
                        onChange={(e) => updateItem(index, "description", e.target.value)}
                      />
                    </TableCell>
                    <TableCell className="w-24">
                      <input
                        type="number"
                        min="1"
                        className="flex h-10 w-full rounded-lg border border-gray-200 bg-white dark:bg-dark-700 px-3 py-2 text-sm text-gray-900 dark:text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, "quantity", Math.max(1, parseInt(e.target.value) || 1))}
                      />
                    </TableCell>
                    <TableCell className="w-32">
                      <input
                        type="number"
                        step="0.01"
                        className="flex h-10 w-full rounded-lg border border-gray-200 bg-white dark:bg-dark-700 px-3 py-2 text-sm text-gray-900 dark:text-white text-left font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(index, "unitPrice", parseFloat(e.target.value) || 0)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-left">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => removeItem(index)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>ملاحظات</CardTitle>
            <CardDescription>إضافة ملاحظات للفاتورة</CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              className="flex min-h-[100px] w-full rounded-lg border border-gray-200 bg-white dark:bg-dark-700 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ملاحظات..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>الإجماليات</CardTitle>
            <CardDescription>الضريبة والخصم والإجمالي النهائي</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="نسبة الضريبة (%)"
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              />
              <Input
                label="الخصم"
                type="number"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">المجموع الفرعي</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">الضريبة ({taxRate}%)</span>
                <span className="font-medium text-red-600">+{formatCurrency(taxAmount)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">الخصم</span>
                  <span className="font-medium text-green-600">-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2">
                <span>الإجمالي النهائي</span>
                <span className="text-blue-600">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={() => router.push("/dashboard/sales")}>
          إلغاء
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {saving ? "جاري الإنشاء..." : "إنشاء الفاتورة"}
        </Button>
      </div>
    </div>
  );
}
