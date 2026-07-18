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

const registerSchema = z
  .object({
    name: z.string().min(1, "الاسم مطلوب"),
    email: z.string().min(1, "البريد الإلكتروني مطلوب").email("البريد الإلكتروني غير صالح"),
    password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
    confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمة المرور غير متطابقة",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(d => {
      if (d.user) router.replace("/dashboard");
    });
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      let result;
      try {
        result = await response.json();
      } catch {
        result = {};
      }

      if (!response.ok) {
        toast.error(result.error || "فشل إنشاء الحساب");
        return;
      }

      toast.success("تم إنشاء الحساب بنجاح، يمكنك تسجيل الدخول الآن");
      setTimeout(() => router.push("/login"), 1500);
    } catch {
      toast.error("حدث خطأ في الاتصال بالخادم");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-gold opacity-30" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />

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
          <p className="text-gray-400 mt-2">إنشاء حساب جديد</p>
        </div>

        <Card className="border border-white/5 shadow-2xl shadow-gold-500/5 bg-dark-800/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-center text-white text-xl">
              <Sparkles className="h-5 w-5 text-gold-500 inline-block ml-2" />
              إنشاء حساب
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              أدخل بياناتك لإنشاء حساب جديد
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="الاسم"
                placeholder="الاسم الكامل"
                error={errors.name?.message}
                {...register("name")}
              />
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
              <Input
                label="تأكيد كلمة المرور"
                type="password"
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
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
                    جاري إنشاء الحساب...
                  </>
                ) : (
                  "إنشاء حساب"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-500">لديك حساب بالفعل؟ </span>
              <Link
                href="/login"
                className="text-gold-400 hover:text-gold-300 font-medium transition-colors"
              >
                تسجيل الدخول
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
