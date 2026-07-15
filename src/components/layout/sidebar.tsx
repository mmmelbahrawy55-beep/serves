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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

type MenuItem = {
  label: string;
  icon: FC<{ className?: string }>;
  path: string;
  tab?: string;
};

const menuItems: MenuItem[] = [
  { label: "الرئيسية", icon: LayoutDashboard, path: "/dashboard" },
  { label: "الموظفين", icon: Users, path: "/dashboard/employees" },
  { label: "الحضور", icon: CalendarCheck, path: "/dashboard/attendance" },
  { label: "الإجازات", icon: CalendarRange, path: "/dashboard/employees" },
  { label: "الرواتب", icon: DollarSign, path: "/dashboard/payroll" },
  { label: "العملاء", icon: Handshake, path: "/dashboard/clients" },
  { label: "المخازن", icon: Warehouse, path: "/dashboard/inventory" },
  { label: "المشتريات", icon: ShoppingCart, path: "/dashboard/inventory", tab: "purchases" },
  { label: "المبيعات", icon: Receipt, path: "/dashboard/sales" },
  { label: "الحسابات", icon: BookOpen, path: "/dashboard/accounting" },
  { label: "المشاريع", icon: Briefcase, path: "/dashboard/projects" },
  { label: "التقارير", icon: BarChart3, path: "/dashboard/reports" },
  { label: "الإعدادات", icon: Settings, path: "/dashboard/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen, currentUser, setCurrentUser } = useAppStore();

  const isActive = (item: (typeof menuItems)[number]) => {
    if (item.path === "/") return pathname === "/";
    if (item.tab) return pathname.startsWith(item.path) && searchParams.get("tab") === item.tab;
    return pathname.startsWith(item.path);
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed right-0 top-0 z-50 flex h-screen flex-col bg-gradient-to-b from-[#1a1f3a] to-[#0f1629] text-white shadow-xl transition-all duration-300 ease-in-out",
          "lg:sticky lg:top-0 lg:shadow-none",
          sidebarOpen ? "w-[260px]" : "w-16 hidden lg:flex"
        )}
      >
        <div className="flex h-full w-[260px] flex-shrink-0 flex-col overflow-hidden">
          <div className="flex h-16 flex-shrink-0 items-center border-b border-white/10 px-4">
            <Link href="/" className={cn("flex items-center gap-2", !sidebarOpen && "mx-auto")}>
              <Building2 className="h-8 w-8 flex-shrink-0 text-blue-500" />
              {sidebarOpen && (
                <span className="text-lg font-bold">
                  نظام الإدارة
                </span>
              )}
            </Link>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto py-4">
            {menuItems.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.label}
                  href={item.tab ? `${item.path}?tab=${item.tab}` : item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-xl py-3 text-sm transition-all duration-200",
                    sidebarOpen ? "mx-2 px-3" : "mx-auto w-fit px-0",
                    active
                      ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/10 text-blue-400 shadow-sm border border-blue-500/10"
                      : "text-gray-400 hover:bg-white/5 hover:text-white hover:border-transparent"
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <span className="transition-opacity duration-150">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex-shrink-0 border-t border-white/10">
            <div className={cn("flex items-center gap-3 px-4 py-4", !sidebarOpen && "justify-center")}>
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-medium">
                {currentUser?.name?.charAt(0) || "U"}
              </div>
              {sidebarOpen && (
                <div className="flex flex-1 items-center gap-3 overflow-hidden transition-opacity duration-150">
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium">{currentUser?.name || "مستخدم"}</p>
                    <p className="truncate text-xs text-gray-400">{currentUser?.email || ""}</p>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      await fetch("/api/auth/logout", { method: "POST" });
                      setCurrentUser(null);
                      router.push("/login");
                      router.refresh();
                    }}
                    className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                    title="تسجيل الخروج"
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
