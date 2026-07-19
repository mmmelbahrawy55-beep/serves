"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, Pencil, Search, Loader2, AlertTriangle, Package } from "lucide-react";
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

type Product = {
  id: string;
  name: string;
  sku: string;
  category: { id: string; name: string } | null;
  unitPrice: number;
  quantity: number;
  minStock: number;
};

type Supplier = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

type Purchase = {
  id: string;
  supplier: { id: string; name: string; email?: string } | null;
  totalAmount: number;
  status: string;
  createdAt: string;
};

const tabs = [
  { id: "products", label: "المنتجات" },
  { id: "suppliers", label: "الموردين" },
  { id: "purchases", label: "المشتريات" },
];

const emptyProduct = {
  name: "",
  sku: "",
  categoryId: "",
  unitPrice: 0,
  quantity: 0,
  minStock: 5,
};

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["products", "suppliers", "purchases"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "products") {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        const res = await fetch(`/api/inventory/products?${params}`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } else if (activeTab === "suppliers") {
        const res = await fetch("/api/inventory/suppliers");
        const data = await res.json();
        setSuppliers(Array.isArray(data) ? data : []);
      } else {
        const res = await fetch("/api/purchases");
        const data = await res.json();
        setPurchases(Array.isArray(data) ? data : []);
      }
    } catch {
      toast.error("فشل تحميل البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, search]);

  const handleAddProduct = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/inventory/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      toast.success("تم إضافة المنتج بنجاح");
      setModalOpen(false);
      setFormData(emptyProduct);
      fetchData();
    } catch {
      toast.error("فشل إضافة المنتج");
    } finally {
      setSaving(false);
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, { variant: "success" | "warning" | "danger"; label: string }> = {
      ACTIVE: { variant: "success", label: "نشط" },
      INACTIVE: { variant: "danger", label: "غير نشط" },
      COMPLETED: { variant: "success", label: "مكتمل" },
      PENDING: { variant: "warning", label: "معلق" },
    };
    const item = map[status] || { variant: "default" as const, label: status };
    return <Badge variant={item.variant}>{item.label}</Badge>;
  };

  const renderProducts = () => (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            className="flex h-10 w-full rounded-lg border border-gray-200 bg-white dark:bg-dark-700 pr-10 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="بحث عن منتج..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" />
          إضافة منتج
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الصنف</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>الفئة</TableHead>
            <TableHead>السعر</TableHead>
            <TableHead>الكمية</TableHead>
            <TableHead>المخزون الأدنى</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell className="text-gray-500">{product.sku}</TableCell>
              <TableCell>{product.category?.name || "—"}</TableCell>
              <TableCell>{formatCurrency(product.unitPrice)}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {product.quantity <= product.minStock && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  <Badge
                    variant={
                      product.quantity <= product.minStock
                        ? "danger"
                        : "success"
                    }
                  >
                    {product.minStock}
                  </Badge>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );

  const renderSuppliers = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>الاسم</TableHead>
          <TableHead>البريد</TableHead>
          <TableHead>الهاتف</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {suppliers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-gray-500 py-8">
              لا يوجد موردين
            </TableCell>
          </TableRow>
        ) : (
          suppliers.map((supplier) => (
            <TableRow key={supplier.id}>
              <TableCell className="font-medium">{supplier.name}</TableCell>
              <TableCell>{supplier.email}</TableCell>
              <TableCell>{supplier.phone || "—"}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  const renderPurchases = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>المورد</TableHead>
          <TableHead>الإجمالي</TableHead>
          <TableHead>الحالة</TableHead>
          <TableHead>التاريخ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {purchases.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-gray-500 py-8">
              لا توجد مشتريات
            </TableCell>
          </TableRow>
        ) : (
          purchases.map((purchase) => (
            <TableRow key={purchase.id}>
              <TableCell className="font-medium">
                {purchase.supplier?.name || "—"}
              </TableCell>
              <TableCell>{formatCurrency(purchase.totalAmount)}</TableCell>
              <TableCell>{statusBadge(purchase.status)}</TableCell>
              <TableCell>
                {new Date(purchase.createdAt).toLocaleDateString("ar-EG")}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">المخازن</h1>
        <p className="text-gray-500 mt-1">إدارة المنتجات والموردين والمشتريات</p>
      </div>

      <div className="flex gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSearch("");
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-white dark:bg-dark-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : activeTab === "products" ? (
            renderProducts()
          ) : activeTab === "suppliers" ? (
            renderSuppliers()
          ) : (
            renderPurchases()
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="إضافة منتج جديد"
      >
        <div className="space-y-4">
          <Input
            label="اسم المنتج"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
          <Input
            label="SKU"
            value={formData.sku}
            onChange={(e) =>
              setFormData({ ...formData, sku: e.target.value })
            }
          />
          <Input
            label="معرف الفئة"
            value={formData.categoryId}
            onChange={(e) =>
              setFormData({ ...formData, categoryId: e.target.value })
            }
          />
          <Input
            label="سعر الوحدة"
            type="number"
            value={formData.unitPrice}
            onChange={(e) =>
              setFormData({ ...formData, unitPrice: Number(e.target.value) })
            }
          />
          <Input
            label="الكمية"
            type="number"
            value={formData.quantity}
            onChange={(e) =>
              setFormData({ ...formData, quantity: Number(e.target.value) })
            }
          />
          <Input
            label="الحد الأدنى للمخزون"
            type="number"
            value={formData.minStock}
            onChange={(e) =>
              setFormData({ ...formData, minStock: Number(e.target.value) })
            }
          />
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setModalOpen(false)}
            >
              إلغاء
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleAddProduct}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
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
