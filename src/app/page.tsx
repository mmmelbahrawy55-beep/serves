import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-center px-6">
        <div className="mb-8">
          <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            نظام إدارة الشركات
          </h1>
          <p className="text-xl text-blue-200/80 max-w-2xl mx-auto">
            نظام متكامل لإدارة الموظفين، العملاء، المخازن، المبيعات، الحسابات، والمشاريع
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-blue-600 text-white rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-white/10 text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-colors border border-white/20"
          >
            إنشاء حساب
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { label: "موظف", icon: "👥" },
            { label: "عميل", icon: "🤝" },
            { label: "فاتورة", icon: "📄" },
            { label: "تقرير", icon: "📊" },
          ].map((item) => (
            <div key={item.label} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-white/70 text-sm">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
