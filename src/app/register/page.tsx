"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const registerSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  email: z.string().min(1, "البريد الإلكتروني مطلوب").email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
}).refine((d) => d.password === d.confirmPassword, { message: "كلمة المرور غير متطابقة", path: ["confirmPassword"] });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      if (d.user) router.replace("/dashboard");
    });
  }, [router]);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      });
      let result;
      try { result = await res.json(); } catch { result = {}; }
      if (!res.ok) { toast.error(result.error || "فشل إنشاء الحساب"); return; }
      toast.success("تم إنشاء الحساب، يمكنك تسجيل الدخول الآن");
      setTimeout(() => router.push("/login"), 1500);
    } catch { toast.error("حدث خطأ في الاتصال"); } finally { setIsLoading(false); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#08080f] p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-xl shadow-amber-500/20">
            <Building2 className="h-7 w-7 text-[#08080f]" />
          </div>
          <h1 className="text-2xl font-bold text-[#e8e4dd]">إنشاء حساب</h1>
          <p className="mt-1 text-sm text-[#9a948a]">أدخل بياناتك لإنشاء حساب جديد</p>
        </div>

        <div className="rounded-2xl border border-white/[0.04] bg-white/[0.015] p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="الاسم" placeholder="الاسم الكامل" error={errors.name?.message} {...register("name")} />
            <Input label="البريد الإلكتروني" type="email" placeholder="example@company.com" error={errors.email?.message} {...register("email")} />
            <Input label="كلمة المرور" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />
            <Input label="تأكيد كلمة المرور" type="password" placeholder="••••••••" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" /> جاري...</> : "إنشاء حساب"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-[#6b6560]">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" className="font-medium text-amber-400 transition-colors hover:text-amber-300">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
