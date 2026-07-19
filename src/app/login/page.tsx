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
import { useAppStore } from "@/store/useAppStore";

const loginSchema = z.object({
  email: z.string().min(1, "البريد الإلكتروني مطلوب").email("البريد الإلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const setCurrentUser = useAppStore((s) => s.setCurrentUser);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      if (d.user) router.replace("/dashboard");
    });
  }, [router]);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) { toast.error(result.error || "فشل تسجيل الدخول"); return; }
      if (result.user) setCurrentUser(result.user);
      toast.success("تم تسجيل الدخول");
      router.push("/dashboard");
      router.refresh();
    } catch { toast.error("حدث خطأ في الاتصال"); } finally { setIsLoading(false); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-950 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-xl shadow-blue-600/20">
            <Building2 className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">تسجيل الدخول</h1>
          <p className="mt-1 text-sm text-gray-500">أدخل بريدك الإلكتروني وكلمة المرور</p>
        </div>

        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="البريد الإلكتروني" type="email" placeholder="example@company.com" error={errors.email?.message} {...register("email")} />
            <Input label="كلمة المرور" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />
            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" /> جاري...</> : "تسجيل الدخول"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            ليس لديك حساب؟{" "}
            <Link href="/register" className="font-medium text-blue-400 transition-colors hover:text-blue-300">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
