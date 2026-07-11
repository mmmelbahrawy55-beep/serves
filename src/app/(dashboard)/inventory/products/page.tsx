"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProductForm } from "@/components/forms";
import { Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes, suppliersRes] = await Promise.all([
        fetch("/api/inventory/products"),
        fetch("/api/inventory/categories"),
        fetch("/api/inventory/suppliers"),
      ]);
      
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      const suppliersData = await suppliersRes.json();
      
      setProducts(productsData);
      setCategories(categoriesData);
      setSuppliers(suppliersData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
    
    try {
      await fetch(`/api/inventory/products/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const url = editingProduct 
        ? `/api/inventory/products/${editingProduct.id}`
        : "/api/inventory/products";
      
      const method = editingProduct ? "PUT" : "POST";
      
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      setIsFormOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  if (loading) {
    return <div className="p-6">جاري التحميل...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">المنتجات</h1>
        <Button onClick={handleAdd} variant="primary">
          <Plus className="w-4 h-4 ml-2" />
          إضافة منتج
        </Button>
      </div>

      <Table
        columns={[
          { header: "الاسم", accessor: "name" },
          { header: "رمز المنتج", accessor: "sku" },
          { header: "الفئة", accessor: "category", render: (cat: any) => cat?.name || "-" },
          { header: "سعر الوحدة", accessor: "unitPrice" },
          { header: "سعر التكلفة", accessor: "costPrice" },
          { header: "الكمية", accessor: "quantity" },
          { header: "الحد الأدنى", accessor: "minStock" },
          { 
            header: "الحالة", 
            accessor: "quantity",
            render: (value: number, row: any) => (
              <Badge variant={value <= row.minStock ? "destructive" : "default"}>
                {value <= row.minStock ? (
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    منخفض
                  </span>
                ) : "متوفر"}
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
        data={products}
      />

      <ProductForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingProduct}
        categories={categories}
        suppliers={suppliers}
      />
    </div>
  );
}
