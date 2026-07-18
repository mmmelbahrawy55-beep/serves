import Link from "next/link";
import { Building2, Users, Handshake, FileText, BarChart3, Sparkles } from "lucide-react";

const features = [
  { label: "إدارة الموظفين", icon: Users, desc: "بيانات الموظفين والحضور والإجازات" },
  { label: "إدارة العملاء", icon: Handshake, desc: "قاعدة بيانات العملاء والمبيعات" },
  { label: "الفواتير", icon: FileText, desc: "إنشاء وإدارة الفواتير" },
  { label: "التقارير", icon: BarChart3, desc: "تحليلات وتقارير شاملة" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-gold opacity-20" />
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-3xl" />

      <div className="text-center px-6 relative z-10 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gold-500/20 blur-3xl rounded-full" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-gold-500 to-yellow-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-gold-500/30 animate-float">
              <Building2 className="w-12 h-12 text-dark-900" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-gold-400 via-yellow-400 to-gold-500 bg-clip-text text-transparent">
              نظام إدارة الشركات
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            نظام متكامل لإدارة الموظفين، العملاء، المخازن، المبيعات، الحسابات، والمشاريع
            <br />
            <span className="text-gold-500/80">تصميم عصري • أداء عالي • تجربة مستخدم فريدة</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/login"
            className="btn-gold inline-flex items-center justify-center px-10 py-3.5 text-lg shadow-lg shadow-gold-500/30 hover:shadow-gold-500/40"
          >
            <Sparkles className="h-5 w-5 ml-2" />
            تسجيل الدخول
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-10 py-3.5 rounded-xl font-semibold text-lg border border-gold-500/30 text-gold-400 hover:bg-gold-500/10 transition-all duration-200 hover:border-gold-500/50"
          >
            إنشاء حساب
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((item) => (
            <div
              key={item.label}
              className="group card-glow p-5 text-right hover:border-gold-500/30"
            >
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center mb-3 group-hover:bg-gold-500/20 transition-colors">
                <item.icon className="h-6 w-6 text-gold-500" />
              </div>
              <h3 className="text-white font-bold mb-1">{item.label}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} نظام إدارة الشركات. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </div>
  );
}
