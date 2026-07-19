import Link from "next/link";
import { Building2, Users, BarChart3, ShieldCheck, Clock, ArrowLeft, CheckCircle2, Layers } from "lucide-react";

const features = [
  { icon: Users, label: "الموظفين", desc: "إدارة كاملة لبيانات الموظفين والحضور والرواتب والإجازات" },
  { icon: Building2, label: "العملاء", desc: "قاعدة بيانات العملاء والفواتير والمبيعات والتفاعلات" },
  { icon: BarChart3, label: "التقارير", desc: "تحليلات دقيقة وإحصائيات شاملة لأداء الشركة" },
  { icon: ShieldCheck, label: "الصلاحيات", desc: "نظام أدوار متكامل للتحكم بصلاحيات المستخدمين" },
  { icon: Layers, label: "المشاريع", desc: "إدارة المشاريع والمهام وتوزيعها على الفريق" },
  { icon: Clock, label: "الحضور", desc: "تسجيل الحضور والانصراف مع تقارير يومية" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-950 overflow-x-hidden">
      {/* HERO */}
      <section className="relative flex min-h-[90vh] items-center justify-center px-4 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-gradient-dark" />
        <div className="pointer-events-none absolute inset-0 bg-radial-blue" />

        <div className="relative z-10 mx-auto w-full max-w-3xl">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-2xl shadow-blue-600/30 ring-2 ring-blue-400/10 sm:h-20 sm:w-20">
              <Building2 className="h-8 w-8 text-white sm:h-10 sm:w-10" />
            </div>
          </div>

          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
              منصة إدارة مؤسسية
            </div>
          </div>

          <h1 className="mb-4 text-center text-3xl font-black leading-[1.3] text-white sm:text-4xl md:text-5xl lg:text-6xl">
            نظام إدارة
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              الشركات
            </span>
          </h1>

          <p className="mx-auto mb-8 max-w-lg text-center text-sm leading-relaxed text-gray-400 sm:text-base">
            حل متكامل لإدارة الموظفين والعملاء والمخازن والمبيعات والحسابات والمشاريع
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition-all duration-200 hover:bg-blue-500 hover:shadow-blue-500/30 sm:w-auto"
            >
              ابدأ الآن
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/register"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-8 py-3.5 text-sm font-semibold text-gray-300 transition-all duration-200 hover:border-white/20 hover:bg-white/5 hover:text-white sm:w-auto"
            >
              إنشاء حساب
            </Link>
          </div>

          <div className="mx-auto mt-12 grid max-w-lg grid-cols-2 gap-2 md:grid-cols-4">
            {[
              ["٢٠+", "وحدة رئيسية"],
              ["نظام", "متكامل"],
              ["عربي", "واجهة ١٠٠٪"],
              ["مجاني", "للتجربة"],
            ].map(([val, label]) => (
              <div key={label} className="rounded-2xl border border-white/5 bg-white/[0.02] p-3 text-center">
                <div className="text-base font-black text-blue-400 sm:text-lg">{val}</div>
                <div className="mt-0.5 text-xs text-gray-600">{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="flex justify-center rounded-full border border-white/10 px-2 py-1.5">
            <div className="h-1 w-2 animate-pulse rounded-full bg-blue-500/60" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative px-4 py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900/30 to-dark-950" />
        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="mb-10 text-center sm:mb-14">
            <div className="mb-4 flex justify-center">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                كل ما تحتاجه
              </div>
            </div>
            <h2 className="mb-2 text-2xl font-black text-white sm:text-3xl">
              مميزات <span className="text-blue-500">متكاملة</span>
            </h2>
            <p className="mx-auto max-w-md text-sm text-gray-500">
              أدوات احترافية لإدارة شركتك بكفاءة عالية في مكان واحد
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feat) => (
              <div
                key={feat.label}
                className="group rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all duration-300 hover:border-blue-500/10 hover:bg-white/[0.04] hover:shadow-glow-blue sm:p-6"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 transition-colors group-hover:bg-blue-600/20">
                  <feat.icon className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="mb-1 text-sm font-bold text-white">{feat.label}</h3>
                <p className="text-xs leading-relaxed text-gray-500 sm:text-sm">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-4 py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-dark-950 to-dark-900/50" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-lg text-center">
          <h2 className="mb-3 text-2xl font-black leading-tight text-white sm:text-3xl">
            جاهز لتطوير شركتك؟
          </h2>
          <p className="mx-auto mb-7 max-w-sm text-sm text-gray-400 sm:text-base">
            ابدأ اليوم واستفد من جميع المميزات بدون أي التزامات
          </p>

          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition-all duration-200 hover:bg-blue-500 sm:w-auto"
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

          <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600 sm:gap-6 sm:text-sm">
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
      <footer className="border-t border-white/5 px-4 py-5">
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
