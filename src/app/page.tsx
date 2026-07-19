"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2, Users, BarChart3, ShieldCheck, Clock,
  CheckCircle2, Layers, ArrowLeft, Sparkles, ChevronDown,
} from "lucide-react";

const features = [
  { icon: Users, label: "الموظفين", desc: "إدارة بيانات الموظفين والحضور والرواتب والإجازات" },
  { icon: Building2, label: "العملاء", desc: "قاعدة بيانات العملاء والفواتير والمبيعات" },
  { icon: BarChart3, label: "التقارير", desc: "تحليلات وإحصائيات شاملة لأداء الشركة" },
  { icon: ShieldCheck, label: "الصلاحيات", desc: "نظام أدوار متكامل للتحكم بصلاحيات المستخدمين" },
  { icon: Layers, label: "المشاريع", desc: "إدارة المشاريع والمهام وتوزيعها على الفريق" },
  { icon: Clock, label: "الحضور", desc: "تسجيل الحضور والانصراف مع تقارير يومية" },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#08080f]">
      {/* ───── NAVBAR ───── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#08080f]/90 backdrop-blur-xl border-b border-white/[0.04]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-lg shadow-amber-500/20">
              <Building2 className="h-4.5 w-4.5 text-[#08080f]" />
            </div>
            <span className="text-sm font-bold text-white">نظام الإدارة</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2 text-sm font-medium text-[#9a948a] transition-colors hover:text-white"
            >
              دخول
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 text-sm font-bold text-[#08080f] shadow-lg shadow-amber-500/20 transition-all hover:from-amber-400 hover:to-amber-500 hover:shadow-amber-500/30"
            >
              بدء تجربة
            </Link>
          </div>
        </div>
      </header>

      {/* ───── HERO ───── */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 pt-16">
        <div className="pointer-events-none absolute inset-0 bg-gradient-dark" />
        <div className="pointer-events-none absolute inset-0 bg-radial-gold" />
        <div className="pointer-events-none absolute left-1/2 top-[20%] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-amber-500/[0.03] blur-[120px]" />

        <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
          {/* Logo */}
          <div className="mb-7 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-2xl shadow-amber-500/25 ring-1 ring-amber-400/20 sm:h-24 sm:w-24">
              <Building2 className="h-10 w-10 text-[#08080f] sm:h-12 sm:w-12" />
            </div>
          </div>

          {/* Badge */}
          <div className="mb-5 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/15 bg-amber-500/[0.06] px-4 py-1.5 text-xs font-medium text-amber-400">
              <Sparkles className="h-3 w-3" />
              منصة إدارة مؤسسية متكاملة
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-5 text-4xl font-black leading-tight text-[#e8e4dd] sm:text-5xl md:text-6xl lg:text-7xl">
            نظام إدارة
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              الشركات
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-9 max-w-xl text-sm leading-relaxed text-[#9a948a] sm:text-base md:text-lg">
            حل متكامل لإدارة الموظفين والعملاء والمخازن والمبيعات
            <br className="hidden sm:block" />
            والحسابات والمشاريع في مكان واحد
          </p>

          {/* Buttons */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="group inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-9 py-4 text-sm font-bold text-[#08080f] shadow-xl shadow-amber-500/20 transition-all duration-300 hover:from-amber-400 hover:to-amber-500 hover:shadow-amber-500/30 hover:-translate-y-0.5 sm:w-auto"
            >
              ابدأ الآن
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/register"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/[0.06] px-9 py-4 text-sm font-semibold text-[#9a948a] transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.03] hover:text-white hover:-translate-y-0.5 sm:w-auto"
            >
              إنشاء حساب
            </Link>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-lg grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ["٢٠+", "وحدة رئيسية"],
              ["متكامل", "نظام شامل"],
              ["عربي", "واجهة ١٠٠٪"],
              ["مجاني", "للتجربة"],
            ].map(([val, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/[0.04] bg-white/[0.015] p-4 text-center backdrop-blur-sm transition-all duration-300 hover:border-amber-500/10 hover:bg-white/[0.03]"
              >
                <div className="text-lg font-black text-amber-400">{val}</div>
                <div className="mt-0.5 text-xs text-[#6b6560]">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-5 w-5 text-[#6b6560]" />
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section className="relative px-5 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#08080f] via-[#0a0a12] to-[#08080f]" />

        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <div className="mb-4 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/15 bg-amber-500/[0.06] px-4 py-1.5 text-xs font-medium text-amber-400">
                كل ما تحتاجه
              </div>
            </div>
            <h2 className="mb-3 text-3xl font-black text-[#e8e4dd] sm:text-4xl">
              مميزات <span className="text-amber-400">متكاملة</span>
            </h2>
            <p className="mx-auto max-w-md text-sm text-[#9a948a] sm:text-base">
              أدوات احترافية لإدارة شركتك بكفاءة عالية في مكان واحد
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feat) => (
              <div
                key={feat.label}
                className="group rounded-2xl border border-white/[0.04] bg-white/[0.015] p-6 transition-all duration-300 hover:border-amber-500/10 hover:bg-white/[0.03] hover:shadow-glow-amber"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/15 to-amber-700/10 transition-all duration-300 group-hover:from-amber-500/25 group-hover:to-amber-700/20">
                  <feat.icon className="h-6 w-6 text-amber-400" />
                </div>
                <h3 className="mb-2 text-base font-bold text-[#e8e4dd]">{feat.label}</h3>
                <p className="text-sm leading-relaxed text-[#9a948a]">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="relative px-5 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#08080f] to-[#0a0a12]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/[0.04] blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-lg text-center">
          <h2 className="mb-4 text-3xl font-black leading-tight text-[#e8e4dd] sm:text-4xl">
            جاهز لتطوير شركتك؟
          </h2>
          <p className="mx-auto mb-8 max-w-sm text-sm text-[#9a948a] sm:text-base">
            ابدأ اليوم واستفد من جميع المميزات بدون أي التزامات
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-9 py-4 text-sm font-bold text-[#08080f] shadow-xl shadow-amber-500/20 transition-all duration-300 hover:from-amber-400 hover:to-amber-500 hover:shadow-amber-500/30 hover:-translate-y-0.5 sm:w-auto"
            >
              إنشاء حساب مجاني
            </Link>
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/[0.06] px-9 py-4 text-sm font-semibold text-[#9a948a] transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.03] hover:text-white sm:w-auto"
            >
              تسجيل الدخول
            </Link>
          </div>

          <div className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-[#6b6560] sm:gap-6 sm:text-sm">
            {["بدون بطاقة", "إلغاء مجاني", "دعم فني"].map((text) => (
              <span key={text} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-500/50" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="border-t border-white/[0.04] px-5 py-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 sm:flex-row">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-bold text-[#e8e4dd]">نظام إدارة الشركات</span>
          </div>
          <p className="text-xs text-[#6b6560]">© {new Date().getFullYear()} جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
}
