"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";
import { Package, FileText, Hash, Tag, DollarSign, Box, AlertTriangle, Truck } from "lucide-react";

type ProductFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  categories?: any[];
  suppliers?: any[];
};

export function ProductForm({ isOpen, onClose, onSubmit, initialData, categories = [], suppliers = [] }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    sku: initialData?.sku || "",
    categoryId: initialData?.categoryId || "",
    unitPrice: initialData?.unitPrice || "",
    costPrice: initialData?.costPrice || "",
    quantity: initialData?.quantity || "",
    minStock: initialData?.minStock || "",
    supplierId: initialData?.supplierId || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      toast.success(initialData ? "تم تحديث بيانات المنتج بنجاح" : "تم إضافة المنتج بنجاح", {
        description: initialData ? "تم حفظ التغييرات" : "تمت إضافة المنتج الجديد إلى المخزون",
        icon: "✅",
      });
      onClose();
    } catch (error) {
      toast.error("حدث خطأ", {
        description: "فشلت العملية، يرجى المحاولة مرة أخرى",
        icon: "❌",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "تعديل منتج" : "إضافة منتج جديد"}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <div className="relative">
            <Package className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="اسم المنتج"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full pr-10 pl-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <div className="relative">
            <FileText className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            <textarea
              placeholder="وصف المنتج"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full pr-10 pl-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[80px] resize-none"
            />
          </div>
        </div>

        <div>
          <div className="relative">
            <Hash className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="رمز المنتج (SKU)"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              required
              className="w-full pr-10 pl-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="relative">
              <Tag className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full pr-10 pl-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="">اختر الفئة</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="relative">
              <Truck className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              <select
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                className="w-full pr-10 pl-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer"
              >
                <option value="">اختر المورد</option>
                {suppliers.map((sup) => (
                  <option key={sup.id} value={sup.id}>
                    {sup.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="relative">
              <DollarSign className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="number"
                placeholder="سعر الوحدة"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                required
                className="w-full pr-10 pl-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <DollarSign className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="number"
                placeholder="سعر التكلفة"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                className="w-full pr-10 pl-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="relative">
              <Box className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="number"
                placeholder="الكمية"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
                className="w-full pr-10 pl-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <AlertTriangle className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="number"
                placeholder="الحد الأدنى للمخزون"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                className="w-full pr-10 pl-4 py-3 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                جاري الحفظ...
              </span>
            ) : (
              initialData ? "تحديث" : "إضافة"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isSubmitting}
          >
            إلغاء
          </Button>
        </div>
      </form>
    </Modal>
  );
}
