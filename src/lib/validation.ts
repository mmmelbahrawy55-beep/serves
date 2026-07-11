import { z } from 'zod';

// User validation schemas
export const userSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().optional(),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  department: z.string().optional(),
  position: z.string().optional(),
  salary: z.number().min(0).optional(),
  role: z.enum(['EMPLOYEE', 'MANAGER', 'ADMIN']).default('EMPLOYEE'),
});

export const userUpdateSchema = userSchema.partial().extend({
  password: z.string().min(6).optional(),
});

// Client validation schemas
export const clientSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional().or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().optional(),
  type: z.enum(['LEAD', 'CUSTOMER', 'PARTNER']).default('LEAD'),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  notes: z.string().optional(),
});

// Product validation schemas
export const productSchema = z.object({
  name: z.string().min(2, 'اسم المنتج يجب أن يكون حرفين على الأقل'),
  description: z.string().optional(),
  sku: z.string().min(1, 'رمز المنتج مطلوب'),
  categoryId: z.string().optional(),
  unitPrice: z.number().min(0, 'سعر الوحدة يجب أن يكون رقماً موجباً'),
  costPrice: z.number().min(0).optional(),
  quantity: z.number().int().min(0, 'الكمية يجب أن تكون رقماً صحيحاً'),
  minStock: z.number().int().min(0).optional(),
  supplierId: z.string().optional(),
});

// Project validation schemas
export const projectSchema = z.object({
  name: z.string().min(2, 'اسم المشروع يجب أن يكون حرفين على الأقل'),
  description: z.string().optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional(),
  status: z.enum(['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED']).default('PLANNING'),
  budget: z.number().min(0).optional(),
  clientId: z.string().optional(),
  managerId: z.string().optional(),
});

// Supplier validation schemas
export const supplierSchema = z.object({
  name: z.string().min(2, 'اسم المورد يجب أن يكون حرفين على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صحيح').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

// Helper function to validate data
export function validateData<T>(schema: z.ZodSchema<T>, data: any): {
  success: boolean;
  data?: T;
  errors?: any;
} {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return { success: false, errors };
    }
    return { success: false, errors: [{ message: 'خطأ في التحقق من البيانات' }] };
  }
}
