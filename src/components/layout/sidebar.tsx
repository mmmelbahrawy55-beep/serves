"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import type { FC } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarRange,
  DollarSign,
  Handshake,
  Warehouse,
  ShoppingCart,
  Receipt,
  BookOpen,
  Briefcase,
  BarChart3,
  Settings,
  LogOut,
  Building2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

type MenuItemRole = "all" | "admin" | "admin_manager";

const menuItems: (MenuItem & { role?: MenuItemRole })[] = [
  { label: "الرئيسية", icon: LayoutDashboard, path: "/dashboard" },
  { label: "الموظفين", icon: Users, path: "/dashboard/employees", role: "admin_manager" },
  { label: "الحضور", icon: CalendarCheck, path: "/dashboard/attendance" },
  { label: "الإجازات", icon: CalendarRange, path: "/dashboard/leaves" },
  { label: "الرواتب", icon: DollarSign, path: "/dashboard/payroll", role: "admin_manager" },
  { label: "العملاء", icon: Handshake, path: "/dashboard/clients" },
  { label: "المخازن", icon: Warehouse, path: "/dashboard/inventory" },
  { label: "المشتريات", icon: ShoppingCart, path: "/dashboard/inventory", tab: "purchases" },
  { label: "المبيعات", icon: Receipt, path: "/dashboard/sales" },
  { label: "الحسابات", icon: BookOpen, path: "/dashboard/accounting" },
  { label: "المشاريع", icon: Briefcase, path: "/dashboard/projects" },
  { label: "التقارير", icon: BarChart3, path: "/dashboard/reports" },
  { label: "الإعدادات", icon: Settings, path: "/dashboard/settings", role: "admin" },
];

type MenuItem = {
  label: string;
  icon: FC<{ className?: string }>;
  path: string;
  tab?: string;
};

const roleLabels: Record<string, string> = {
  ADMIN: "مدير النظام",
  MANAGER: "مدير",
  EMPLOYEE: "موظف",
};

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen, currentUser, setCurrentUser } = useAppStore();
  const userRole = currentUser?.role;

  const visibleItems = menuItems.filter((item) => {
    if (!item.role) return true;
    if (item.role === "admin") return userRole === "ADMIN";
    if (item.role === "admin_manager") return userRole === "ADMIN" || userRole === "MANAGER";
    return true;
  });

  const isActive = (item: typeof menuItems[number]) => {
    if (item.path === "/") return pathname === "/";
    if (item.tab) return pathname.startsWith(item.path) && searchParams.get("tab") === item.tab;
    return pathname.startsWith(item.path);
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed right-0 top-0 z-50 flex h-screen flex-col bg-dark-950 text-white shadow-2xl transition-all duration-300 ease-in-out",
          "lg:sticky lg:top-0 lg:shadow-none",
          sidebarOpen ? "w-[280px]" : "w-16 hidden lg:flex"
        )}
      >
        <div className="flex h-full w-[280px] flex-shrink-0 flex-col overflow-hidden">
          <div className="relative flex h-16 flex-shrink-0 items-center border-b border-white/5 px-4">
            <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 to-transparent" />
            <Link href="/" className={cn("flex items-center gap-3 z-10", !sidebarOpen && "mx-auto")}>
              <div className="relative">
                <div className="absolute inset-0 bg-gold-500/20 blur-xl rounded-full" />
                <Building2 className="h-8 w-8 text-gold-500 relative z-10" />
              </div>
              {sidebarOpen && (
                <div>
                  <span className="text-lg font-bold bg-gradient-to-r from-gold-400 to-yellow-500 bg-clip-text text-transparent">
                    نظام الإدارة
                  </span>
                  <p className="text-[10px] text-gray-500 -mt-0.5">Enterprise Suite</p>
                </div>
              )}
            </Link>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto py-4 px-2 scrollbar-thin">
            {visibleItems.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.label}
                  href={item.tab ? `${item.path}?tab=${item.tab}` : item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={cn(
                    "sidebar-link",
                    sidebarOpen ? "mx-1" : "mx-auto w-fit",
                    active ? "sidebar-link-active" : "sidebar-link-inactive"
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <item.icon className={cn("h-5 w-5 flex-shrink-0 transition-transform", active && "scale-110")} />
                  {sidebarOpen && (
                    <span className="transition-opacity duration-150">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex-shrink-0 border-t border-white/5">
            <div className={cn("flex items-center gap-3 px-4 py-4", !sidebarOpen && "justify-center")}>
              <div className="relative">
                <div className="absolute inset-0 bg-gold-500/30 blur-md rounded-full" />
                <div className="relative h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-gold-500 to-yellow-600 text-dark-900 font-bold text-sm shadow-lg shadow-gold-500/20">
                  {currentUser?.name?.charAt(0) || "U"}
                </div>
              </div>
              {sidebarOpen && (
                <div className="flex flex-1 items-center gap-3 overflow-hidden transition-opacity duration-150">
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-white">{currentUser?.name || "مستخدم"}</p>
                    <p className="truncate text-xs text-gray-500">{currentUser?.email || ""}</p>
                    <p className="truncate text-[10px] text-gold-400/80 mt-0.5 font-medium">
                      <Sparkles className="h-3 w-3 inline-block ml-0.5" />
                      {roleLabels[currentUser?.role || ""] || "موظف"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      await fetch("/api/auth/logout", { method: "POST" });
                      setCurrentUser(null);
                      router.push("/login");
                      router.refresh();
                    }}
                    className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-gray-500 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20"
                    title="تسجيل الخروج"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {sidebarOpen && (
            <div className="px-4 pb-3">
              <div className="divider" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
