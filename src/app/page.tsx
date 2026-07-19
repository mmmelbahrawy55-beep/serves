"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

const stats = [
  { end: 20, suffix: "+", label: "وحدة رئيسية" },
  { end: 100, suffix: "%", label: "واجهة عربية" },
  { end: 24, suffix: "/7", label: "دعم فني" },
];

/* ─── Animated Counter ─── */
function AnimatedCounter({ end, suffix, display }: { end: number; suffix: string; display?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (display) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1500;
          const steps = 60;
          const increment = end / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= end) { setCount(end); clearInterval(timer); }
            else setCount(Math.floor(current));
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, display]);

  return (
    <div ref={ref} className="text-lg font-black text-amber-400 sm:text-xl">
      {display || count}{suffix}
    </div>
  );
}

/* ─── Floating Particles ─── */
function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 162, 78, ${p.opacity})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-0" />;
}

/* ─── 3D Card ─── */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale3d(1.02,1.02,1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)";
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ transition: "transform 0.3s ease" }}
    >
      {children}
    </div>
  );
}

/* ─── Scroll Reveal ─── */
function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Main Page ─── */
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
            <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-[#9a948a] transition-colors hover:text-white">دخول</Link>
            <Link href="/register" className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 text-sm font-bold text-[#08080f] shadow-lg shadow-amber-500/20 transition-all hover:from-amber-400 hover:to-amber-500">بدء تجربة</Link>
          </div>
        </div>
      </header>

      {/* ───── HERO ───── */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 pt-16">
        <div className="pointer-events-none absolute inset-0 bg-gradient-dark" />
        <div className="pointer-events-none absolute inset-0 bg-radial-gold" />
        <div className="pointer-events-none absolute left-1/2 top-[20%] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-amber-500/[0.03] blur-[120px]" />
        <Particles />

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
          <h1 className="mb-2 text-4xl font-black leading-tight text-[#e8e4dd] sm:text-5xl md:text-6xl lg:text-7xl">
            نظام إدارة
          </h1>
          <h2 className="mb-6 mt-4 text-4xl font-black leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              الشركات
            </span>
          </h2>

          {/* Subtitle */}
          <p className="mx-auto mb-9 max-w-xl text-sm leading-relaxed text-[#9a948a] sm:text-base md:text-lg">
            حل متكامل لإدارة الموظفين والعملاء والمخازن والمبيعات
            <br className="hidden sm:block" />
            والحسابات والمشاريع في مكان واحد
          </p>

          {/* Buttons */}
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/login" className="group inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-9 py-4 text-sm font-bold text-[#08080f] shadow-xl shadow-amber-500/20 transition-all duration-300 hover:from-amber-400 hover:to-amber-500 hover:shadow-amber-500/30 hover:-translate-y-0.5 sm:w-auto">
              ابدأ الآن
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/register" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/[0.06] px-9 py-4 text-sm font-semibold text-[#9a948a] transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.03] hover:text-white hover:-translate-y-0.5 sm:w-auto">
              إنشاء حساب
            </Link>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-lg grid-cols-2 gap-3 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/[0.04] bg-white/[0.015] p-4 text-center backdrop-blur-sm transition-all duration-300 hover:border-amber-500/10 hover:bg-white/[0.03]">
                <AnimatedCounter end={s.end} suffix={s.suffix} display={s.display} />
                <div className="mt-0.5 text-xs text-[#6b6560]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-5 w-5 text-[#6b6560]" />
        </div>
      </section>

      {/* ───── FEATURES ───── */}
      <section className="relative px-5 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#08080f] via-[#0a0a12] to-[#08080f]" />

        <div className="relative z-10 mx-auto max-w-5xl">
          <Reveal>
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
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feat, i) => (
              <Reveal key={feat.label} delay={i * 0.1}>
                <TiltCard className="group h-full rounded-2xl border border-white/[0.04] bg-white/[0.015] p-6 transition-all duration-300 hover:border-amber-500/10 hover:bg-white/[0.03] hover:shadow-glow-amber">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/15 to-amber-700/10 transition-all duration-300 group-hover:from-amber-500/25 group-hover:to-amber-700/20">
                    <feat.icon className="h-6 w-6 text-amber-400" />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-[#e8e4dd]">{feat.label}</h3>
                  <p className="text-sm leading-relaxed text-[#9a948a]">{feat.desc}</p>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="relative px-5 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#08080f] to-[#0a0a12]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/[0.04] blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-lg text-center">
          <Reveal>
            <h2 className="mb-4 text-3xl font-black leading-tight text-[#e8e4dd] sm:text-4xl">
              جاهز لتطوير شركتك؟
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mx-auto mb-8 max-w-sm text-sm text-[#9a948a] sm:text-base">
              ابدأ اليوم واستفد من جميع المميزات بدون أي التزامات
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/register" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-9 py-4 text-sm font-bold text-[#08080f] shadow-xl shadow-amber-500/20 transition-all duration-300 hover:from-amber-400 hover:to-amber-500 hover:shadow-amber-500/30 hover:-translate-y-0.5 sm:w-auto">
                إنشاء حساب
              </Link>
              <Link href="/login" className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/[0.06] px-9 py-4 text-sm font-semibold text-[#9a948a] transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.03] hover:text-white sm:w-auto">
                تسجيل الدخول
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-4 text-xs text-[#6b6560] sm:gap-6 sm:text-sm">
              {["بدون بطاقة", "دعم فني", "تحديثات"].map((text) => (
                <span key={text} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-500/50" />
                  {text}
                </span>
              ))}
            </div>
          </Reveal>
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
