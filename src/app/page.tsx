"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Users, BarChart3, ShieldCheck, Clock, ArrowLeft, CheckCircle2, Layers, Sparkles, ChevronDown } from "lucide-react";

const features = [
  { icon: Users, label: "الموظفين", desc: "إدارة كاملة لبيانات الموظفين والحضور والرواتب والإجازات" },
  { icon: Building2, label: "العملاء", desc: "قاعدة بيانات العملاء والفواتير والمبيعات والتفاعلات" },
  { icon: BarChart3, label: "التقارير", desc: "تحليلات دقيقة وإحصائيات شاملة لأداء الشركة" },
  { icon: ShieldCheck, label: "الصلاحيات", desc: "نظام أدوار متكامل للتحكم بصلاحيات المستخدمين" },
  { icon: Layers, label: "المشاريع", desc: "إدارة المشاريع والمهام وتوزيعها على الفريق" },
  { icon: Clock, label: "الحضور", desc: "تسجيل الحضور والانصراف مع تقارير يومية" },
];

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-dark-950">
      {/* NAV */}
      <header className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${isScrolled ? "bg-dark-950/90 backdrop-blur-xl border-b border-white/5" : "bg-transparent"}`}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg shadow-blue-600/20">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white">نظام الإدارة</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white">
              دخول
            </Link>
            <Link href="/register" className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-500">
              بدء تجربة
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-16">
        <div className="pointer-events-none absolute inset-0 bg-gradient-dark" />
        <div className="pointer-events-none absolute inset-0 bg-radial-blue" />
        <div className="pointer-events-none absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-500/3 blur-[120px]" />

        {/* Floating orbs */}
        <div className="pointer-events-none absolute left-[10%] top-[20%] h-4 w-4 rounded-full bg-blue-500/20 blur-sm" />
        <div className="pointer-events-none absolute right-[15%] top-[35%] h-6 w-6 rounded-full bg-purple-500/20 blur-sm" />
        <div className="pointer-events-none absolute left-[20%] bottom-[30%] h-3 w-3 rounded-full bg-blue-400/20 blur-sm" />

        <div className="relative z-10 mx-auto w-full max-w-3xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-2xl shadow-blue-600/30 ring-2 ring-blue-400/10 sm:h-24 sm:w-24">
              <Building2 className="h-10 w-10 text-white sm:h-12 sm:w-12" />
            </div>
          </div>

          <div className="mb-5 flex justify-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
              <Sparkles className="h-3 w-3" />
              منصة إدارة مؤسسية متكاملة
            </div>
          </div>

          <h1 className="mb-4 text-center text-3xl font-black leading-[1.2] text-white sm:text-5xl md:text-6xl lg:text-7xl">
            نظام إدارة
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              الشركات
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-xl text-center text-sm leading-relaxed text-gray-400 sm:text-base md:text-lg">
            حل متكامل لإدارة الموظفين والعملاء والمخازن والمبيعات والحسابات والمشاريع في مكان واحد
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition-all duration-200 hover:bg-blue-500 hover:shadow-blue-500/30 hover:-translate-y-0.5 sm:w-auto"
            >
              ابدأ الآن
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/register"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-8 py-3.5 text-sm font-semibold text-gray-300 transition-all duration-200 hover:border-white/20 hover:bg-white/5 hover:text-white hover:-translate-y-0.5 sm:w-auto"
            >
              إنشاء حساب
            </Link>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-14 grid max-w-lg grid-cols-2 gap-2 md:grid-cols-4">
            {[
              ["٢٠+", "وحدة رئيسية"],
              ["متكامل", "نظام شامل"],
              ["عربي", "واجهة ١٠٠٪"],
              ["مجاني", "للتجربة"],
            ].map(([val, label]) => (
              <div key={label} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-3.5 text-center backdrop-blur-sm transition-all hover:border-white/[0.08]">
                <div className="text-base font-black text-blue-400 sm:text-lg">{val}</div>
                <div className="mt-0.5 text-xs text-gray-600">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-5 w-5 text-gray-500" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative px-4 py-20 sm:py-28" id="features">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900/30 to-dark-950" />

        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="mb-12 text-center sm:mb-16">
            <div className="mb-4 flex justify-center">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                كل ما تحتاجه
              </div>
            </div>
            <h2 className="mb-3 text-2xl font-black text-white sm:text-3xl md:text-4xl">
              مميزات <span className="text-blue-500">متكاملة</span>
            </h2>
            <p className="mx-auto max-w-lg text-sm text-gray-500 sm:text-base">
              أدوات احترافية لإدارة شركتك بكفاءة عالية في مكان واحد
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feat) => (
              <div
                key={feat.label}
                className="group rounded-2xl border border-white/[0.04] bg-white/[0.02] p-6 transition-all duration-300 hover:border-blue-500/10 hover:bg-white/[0.04] hover:shadow-glow-blue"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-800/10 transition-all group-hover:from-blue-600/30 group-hover:to-blue-800/20">
                  <feat.icon className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="mb-2 text-base font-bold text-white">{feat.label}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-4 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-dark-950 to-dark-900/50" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-lg text-center">
          <h2 className="mb-3 text-2xl font-black leading-tight text-white sm:text-3xl md:text-4xl">
            جاهز لتطوير شركتك؟
          </h2>
          <p className="mx-auto mb-8 max-w-sm text-sm text-gray-400 sm:text-base">
            ابدأ اليوم واستفد من جميع المميزات بدون أي التزامات
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition-all duration-200 hover:bg-blue-500 hover:shadow-blue-500/30 hover:-translate-y-0.5 sm:w-auto"
            >
              إنشاء حساب مجاني
            </Link>
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-8 py-3.5 text-sm font-semibold text-gray-300 transition-all duration-200 hover:border-white/20 hover:bg-white/5 hover:text-white sm:w-auto"
            >
              تسجيل الدخول
            </Link>
          </div>

          <div className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600 sm:gap-6 sm:text-sm">
            {["بدون بطاقة", "إلغاء مجاني", "دعم فني"].map((text) => (
              <span key={text} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-blue-500/60" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 px-4 py-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 sm:flex-row">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-bold text-white">نظام إدارة الشركات</span>
          </div>
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
}
