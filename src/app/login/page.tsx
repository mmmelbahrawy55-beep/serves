"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  const setCurrentUser = useAppStore((state) => state.setCurrentUser);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.user) router.replace("/dashboard");
    });
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "فشل تسجيل الدخول");
        return;
      }

      if (result.user) {
        setCurrentUser(result.user);
      }

      toast.success("تم تسجيل الدخول بنجاح");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("حدث خطأ في الاتصال بالخادم");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-gold opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gold-500/20 blur-2xl rounded-full" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-gold-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gold-500/30 animate-float">
              <Building2 className="w-10 h-10 text-dark-900" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gold-400 to-yellow-500 bg-clip-text text-transparent">
            نظام إدارة الشركات
          </h1>
          <p className="text-gray-400 mt-2">تسجيل الدخول إلى حسابك</p>
        </div>

        <Card className="border border-white/5 shadow-2xl shadow-gold-500/5 bg-dark-800/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-center text-white text-xl">
              <Sparkles className="h-5 w-5 text-gold-500 inline-block ml-2" />
              مرحباً بعودتك
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              أدخل بريدك الإلكتروني وكلمة المرور
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="البريد الإلكتروني"
                type="email"
                placeholder="example@company.com"
                error={errors.email?.message}
                {...register("email")}
              />
              <Input
                label="كلمة المرور"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register("password")}
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-500">ليس لديك حساب؟ </span>
              <Link
                href="/register"
                className="text-gold-400 hover:text-gold-300 font-medium transition-colors"
              >
                إنشاء حساب جديد
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
