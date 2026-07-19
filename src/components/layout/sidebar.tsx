"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import type { FC } from "react";
import {
  LayoutDashboard, Users, CalendarCheck, CalendarRange, DollarSign,
  Handshake, Warehouse, ShoppingCart, Receipt, BookOpen,
  Briefcase, BarChart3, Settings, LogOut, Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

type MenuItem = {
  label: string;
  icon: FC<{ className?: string }>;
  path: string;
  tab?: string;
  role?: string;
};

const menuItems: MenuItem[] = [
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

const roleLabels: Record<string, string> = {
  ADMIN: "مدير النظام", MANAGER: "مدير", EMPLOYEE: "موظف",
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

  const isActive = (item: MenuItem) => {
    if (item.path === "/") return pathname === "/";
    if (item.tab) return pathname.startsWith(item.path) && searchParams.get("tab") === item.tab;
    return pathname.startsWith(item.path);
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed right-0 top-0 z-50 flex h-screen flex-col bg-dark-900 text-white shadow-2xl transition-all duration-300 ease-in-out",
          "lg:sticky lg:top-0",
          sidebarOpen ? "w-[260px]" : "w-16 hidden lg:flex"
        )}
      >
        <div className="flex h-full w-[260px] flex-shrink-0 flex-col overflow-hidden">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-white/5 px-4">
            <Link href="/" className={cn("flex items-center gap-2.5", !sidebarOpen && "mx-auto")}>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg shadow-blue-600/20 flex-shrink-0">
                <Building2 className="h-4 w-4 text-white" />
              </div>
              {sidebarOpen && (
                <div className="font-bold text-sm">
                  <span className="text-white">نظام</span>
                  <span className="text-blue-400"> الإدارة</span>
                </div>
              )}
            </Link>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1 overflow-y-auto py-4 px-2 scrollbar-thin">
            {visibleItems.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.label}
                  href={item.tab ? `${item.path}?tab=${item.tab}` : item.path}
                  onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }}
                  className={cn(
                    "sidebar-link",
                    sidebarOpen ? "mx-1" : "mx-auto w-fit",
                    active ? "sidebar-link-active" : "sidebar-link-inactive"
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="border-t border-white/5 px-4 py-3">
            <div className={cn("flex items-center gap-3", !sidebarOpen && "justify-center")}>
              <div className="h-9 w-9 flex-shrink-0 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-sm shadow-sm">
                {currentUser?.name?.charAt(0) || "U"}
              </div>
              {sidebarOpen && (
                <div className="flex flex-1 items-center gap-2 overflow-hidden">
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium text-white">{currentUser?.name || "مستخدم"}</p>
                    <p className="truncate text-[10px] text-gray-500">{roleLabels[currentUser?.role || ""] || "موظف"}</p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      await fetch("/api/auth/logout", { method: "POST" });
                      setCurrentUser(null);
                      router.push("/login");
                      router.refresh();
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
