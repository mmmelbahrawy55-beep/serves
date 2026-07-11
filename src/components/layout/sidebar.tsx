"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  { label: "الإجازات", icon: CalendarRange, path: "/dashboard/employees", tab: "leave" },
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
  const { sidebarOpen, setSidebarOpen, currentUser } = useAppStore();

  const isActive = (item: (typeof menuItems)[number]) => {
    if (item.path === "/") return pathname === "/";
    if (item.tab) return pathname.startsWith(item.path) && searchParams.get("tab") === item.tab;
    return pathname.startsWith(item.path);
  };

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: sidebarOpen ? 260 : 64 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "fixed right-0 top-0 z-50 flex h-screen flex-col bg-[#1e293b] text-white shadow-xl",
          "lg:sticky lg:top-0 lg:shadow-none",
          sidebarOpen ? "" : "hidden lg:flex"
        )}
      >
        <div className="flex h-full w-[260px] flex-shrink-0 flex-col overflow-hidden">
          <div className="flex h-16 flex-shrink-0 items-center border-b border-white/10 px-4">
            <Link href="/" className={cn("flex items-center gap-2", !sidebarOpen && "mx-auto")}>
              <Building2 className="h-8 w-8 flex-shrink-0 text-blue-500" />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-lg font-bold"
                  >
                    نظام الإدارة
                  </motion.span>
                )}
              </AnimatePresence>
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
                    "flex items-center gap-3 rounded-lg py-3 text-sm transition-colors",
                    sidebarOpen ? "mx-2 px-3" : "mx-auto w-fit px-0",
                    active
                      ? "bg-blue-600/20 text-blue-400"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <AnimatePresence initial={false}>
                    {sidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </nav>

          <div className="flex-shrink-0 border-t border-white/10">
            <div className={cn("flex items-center gap-3 px-4 py-4", !sidebarOpen && "justify-center")}>
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-medium">
                {currentUser?.name?.charAt(0) || "U"}
              </div>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-1 items-center gap-3 overflow-hidden"
                  >
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm font-medium">{currentUser?.name || "مستخدم"}</p>
                      <p className="truncate text-xs text-gray-400">{currentUser?.email || ""}</p>
                    </div>
                    <button
                      type="button"
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
                      title="تسجيل الخروج"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
