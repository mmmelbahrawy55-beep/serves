import Link from "next/link";
import {
  Building2, Users, Handshake, FileText, BarChart3, Sparkles,
  ShieldCheck, Clock, TrendingUp, Network, ArrowLeft,
  CheckCircle2, Gem
} from "lucide-react";

const features = [
  { icon: Users, label: "إدارة الموظفين", desc: "بيانات شاملة، حضور، إجازات، رواتب" },
  { icon: Handshake, label: "العملاء والمبيعات", desc: "قاعدة بيانات، فواتير، تفاعلات" },
  { icon: BarChart3, label: "التقارير والتحليلات", desc: "إحصائيات دقيقة ورسوم بيانية" },
  { icon: ShieldCheck, label: "الصلاحيات والأمان", desc: "تحكم كامل بالصلاحيات والأدوار" },
  { icon: Network, label: "المشاريع والمهام", desc: "إدارة المشاريع وتوزيع المهام" },
  { icon: Clock, label: "الحضور والانصراف", desc: "تسجيل الحضور والغياب تلقائياً" },
];

const stats = [
  { value: "١٥+", label: "نظام متكامل" },
  { value: "٩٩%", label: "وقت تشغيل" },
  { value: "٧/٢٤", label: "دعم فني" },
  { value: "مجاني", label: "بدء الاستخدام" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-950 overflow-hidden">
      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* خلفية متحركة */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-dot-gold opacity-20" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gold-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[100px]" />
          <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-gold-500/3 rounded-full blur-[80px]" />
          {/* خطوط زخرفية */}
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/10 to-transparent" />
          <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/5 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto text-center">
          {/* شارة */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-400 text-xs font-medium mb-8 animate-fade-in">
            <Gem className="h-3.5 w-3.5" />
            منصة إدارة مؤسسية متكاملة
          </div>

          {/* أيقونة رئيسية */}
          <div className="relative inline-block mb-8 animate-float">
            <div className="absolute inset-0 bg-gold-500/30 blur-[60px] rounded-full scale-150" />
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 mx-auto rounded-[2rem] bg-gradient-to-br from-gold-500 to-yellow-600 flex items-center justify-center shadow-2xl shadow-gold-500/30 ring-2 ring-gold-400/20">
              <Building2 className="w-10 h-10 sm:w-14 sm:h-14 text-dark-950" />
            </div>
          </div>

          {/* عنوان */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black leading-[1.1] mb-6 animate-slide-up">
            <span className="bg-gradient-to-r from-gold-300 via-gold-500 to-yellow-500 bg-clip-text text-transparent">
              نظام إدارة
            </span>
            <br />
            <span className="text-white">الشركات</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in px-2">
            حل متكامل لإدارة الموظفين، العملاء، المخازن، المبيعات، والمشاريع
            <br className="hidden sm:block" />
            <span className="text-gold-500/70 text-sm sm:text-base">
              واجهة عربية • تصميم عصري • أداء استثنائي
            </span>
          </p>

          {/* الأزرار */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up">
            <Link
              href="/login"
              className="group relative inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 text-base sm:text-lg font-bold rounded-2xl bg-gradient-to-r from-gold-500 to-yellow-500 text-dark-950 shadow-2xl shadow-gold-500/30 hover:shadow-gold-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full sm:w-auto"
            >
              <Sparkles className="h-5 w-5" />
              ابدأ الآن مجاناً
              <ArrowLeft className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 sm:px-10 py-3.5 sm:py-4 text-base sm:text-lg font-semibold rounded-2xl border border-gold-500/30 text-gold-400 hover:bg-gold-500/10 hover:border-gold-500/50 transition-all duration-300 w-full sm:w-auto"
            >
              إنشاء حساب
            </Link>
          </div>

          {/* إحصائيات سريعة */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto animate-fade-in">
            {stats.map((s) => (
              <div key={s.label} className="relative rounded-2xl border border-white/5 bg-white/[0.02] p-4 sm:p-5 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black bg-gradient-to-r from-gold-400 to-yellow-500 bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-5 h-8 rounded-full border border-gold-500/30 flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-gold-500/60 animate-pulse" />
          </div>
        </div>
      </section>

      {/* ===== المميزات ===== */}
      <section className="relative px-4 py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900/50 to-dark-950" />

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-400 text-xs font-medium mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              كل ما تحتاجه في منصة واحدة
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
              مميزات<span className="text-gold-500"> متكاملة</span>
            </h2>
            <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
              أدوات احترافية لإدارة شركتك بكفاءة عالية
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feat) => (
              <div
                key={feat.label}
                className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-6 sm:p-8 transition-all duration-500 hover:border-gold-500/30 hover:bg-gold-500/[0.03] hover:shadow-2xl hover:shadow-gold-500/5 hover:-translate-y-1"
              >
                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-gold-500/5 via-transparent to-transparent" />

                <div className="relative z-10">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gold-500/10 flex items-center justify-center mb-4 sm:mb-5 group-hover:bg-gold-500/20 group-hover:scale-110 transition-all duration-300">
                    <feat.icon className="h-6 w-6 sm:h-7 sm:w-7 text-gold-500" />
                  </div>
                  <h3 className="text-white font-bold text-lg sm:text-xl mb-2 group-hover:text-gold-400 transition-colors">
                    {feat.label}
                  </h3>
                  <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative px-4 py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900/30 to-dark-950" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gold-500/5 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            جهز شركتك للعصر الرقمي
            <br />
            <span className="bg-gradient-to-r from-gold-400 to-yellow-500 bg-clip-text text-transparent">
              ابدأ اليوم
            </span>
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mb-10 max-w-xl mx-auto">
            انضم إلى مئات الشركات التي تثق في نظامنا لإدارة أعمالها
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="btn-gold inline-flex items-center justify-center gap-2 px-10 py-4 text-lg shadow-2xl shadow-gold-500/30 hover:shadow-gold-500/50 w-full sm:w-auto"
            >
              <Sparkles className="h-5 w-5" />
              إنشاء حساب مجاني
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-10 py-4 text-lg rounded-2xl border border-white/10 text-gray-300 hover:bg-white/5 hover:border-gold-500/30 transition-all duration-300 w-full sm:w-auto"
            >
              تسجيل الدخول
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mt-12 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-gold-500/60" /> بدون بطاقة ائتمان
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-gold-500/60" /> إلغاء في أي وقت
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-gold-500/60" /> دعم فني ٢٤/٧
            </span>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative border-t border-white/5 px-4 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-gold-500" />
            <span className="text-white font-bold text-sm">نظام إدارة الشركات</span>
          </div>
          <p className="text-gray-600 text-xs sm:text-sm text-center">
            © {new Date().getFullYear()} جميع الحقوق محفوظة. Enterprise Suite v1.0
          </p>
        </div>
      </footer>
    </div>
  );
}
