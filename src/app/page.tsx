import Link from "next/link";
import {
  Building2, Users, BarChart3, ShieldCheck, Clock, ArrowLeft,
  CheckCircle2, Layers, LucideIcon
} from "lucide-react";

const features: { icon: LucideIcon; label: string; desc: string }[] = [
  { icon: Users, label: "الموظفين", desc: "إدارة كاملة لبيانات الموظفين والحضور والرواتب والإجازات" },
  { icon: Building2, label: "العملاء", desc: "قاعدة بيانات العملاء والفواتير والمبيعات والتفاعلات" },
  { icon: BarChart3, label: "التقارير", desc: "تحليلات دقيقة وإحصائيات شاملة لأداء الشركة" },
  { icon: ShieldCheck, label: "الصلاحيات", desc: "نظام أدوار متكامل للتحكم بصلاحيات المستخدمين" },
  { icon: Layers, label: "المشاريع", desc: "إدارة المشاريع والمهام وتوزيعها على الفريق" },
  { icon: Clock, label: "الحضور", desc: "تسجيل الحضور والانصراف مع تقارير يومية" },
];

const stats = [
  { value: "١٥+", label: "وحدة رئيسية" },
  { value: "نظام", label: "متكامل بالكامل" },
  { value: "عربي", label: "واجهة ١٠٠٪" },
  { value: "مجاني", label: "للتجربة" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-950">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-16 sm:py-24">
        <div className="absolute inset-0 bg-gradient-dark" />
        <div className="absolute inset-0 bg-radial-blue" />
        <div className="absolute h-px w-full top-1/3 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" />

        <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="mb-8 sm:mb-10 animate-fade-in">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-2xl shadow-blue-600/30 ring-2 ring-blue-400/10">
              <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            منصة إدارة مؤسسية
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.15] mb-5 animate-slide-up">
            نظام إدارة
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              الشركات
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed mb-8 animate-fade-in px-2">
            حل متكامل لإدارة الموظفين والعملاء والمخازن والمبيعات والحسابات والمشاريع
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up">
            <Link
              href="/login"
              className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-600/20 hover:shadow-blue-500/30 transition-all duration-200 w-full sm:w-auto"
            >
              ابدأ الآن
              <ArrowLeft className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold rounded-xl border border-white/10 text-gray-300 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-200 w-full sm:w-auto"
            >
              إنشاء حساب
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto mt-14 animate-fade-in">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-4">
                <div className="text-lg sm:text-xl font-black text-blue-400">{s.value}</div>
                <div className="text-xs sm:text-sm text-gray-600 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll down */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div className="w-5 h-8 rounded-full border border-white/10 flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-blue-500/60 animate-pulse" />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative px-4 py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900/30 to-dark-950" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
              كل ما تحتاجه
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              مميزات <span className="text-blue-500">متكاملة</span>
            </h2>
            <p className="text-gray-500 text-sm sm:text-base max-w-lg mx-auto">
              أدوات احترافية لإدارة شركتك بكفاءة عالية في مكان واحد
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feat) => (
              <div
                key={feat.label}
                className="group rounded-2xl border border-white/[0.04] bg-white/[0.02] p-6 transition-all duration-300 hover:bg-white/[0.04] hover:border-blue-500/10 hover:shadow-glow-blue"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-600/10 flex items-center justify-center mb-4 group-hover:bg-blue-600/20 transition-colors">
                  <feat.icon className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="text-white font-bold text-base mb-1.5">{feat.label}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative px-4 py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950 to-dark-900/50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-500/5 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
            جاهز لتطوير شركتك؟
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mb-8 max-w-md mx-auto">
            ابدأ اليوم واستفد من جميع المميزات بدون أي التزامات
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-600/20 transition-all duration-200 w-full sm:w-auto"
            >
              إنشاء حساب مجاني
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold rounded-xl border border-white/10 text-gray-300 hover:text-white hover:border-white/20 transition-all duration-200 w-full sm:w-auto"
            >
              تسجيل الدخول
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-10 text-xs sm:text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-500/60" /> بدون بطاقة
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-500/60" /> إلغاء مجاني
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-500/60" /> دعم فني
            </span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 px-4 py-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-500" />
            <span className="text-white font-bold text-sm">نظام إدارة الشركات</span>
          </div>
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} جميع الحقوق محفوظة
          </p>
        </div>
      </footer>
    </div>
  );
}
