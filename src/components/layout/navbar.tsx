"use client";

import { usePathname, useRouter } from "next/navigation";
import { Menu, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Dropdown } from "@/components/ui/dropdown";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "الرئيسية",
  "/dashboard/employees": "الموظفين",
  "/dashboard/attendance": "الحضور",
  "/dashboard/leaves": "الإجازات",
  "/dashboard/payroll": "الرواتب",
  "/dashboard/clients": "العملاء",
  "/dashboard/inventory": "المخازن",
  "/dashboard/sales": "المبيعات",
  "/dashboard/sales/invoices/new": "فاتورة جديدة",
  "/dashboard/accounting": "الحسابات",
  "/dashboard/accounting/chart": "دليل الحسابات",
  "/dashboard/accounting/journal": "قيد يومية",
  "/dashboard/projects": "المشاريع",
  "/dashboard/reports": "التقارير",
  "/dashboard/settings": "الإعدادات",
};

function getPageTitle(pathname: string): string {
  const direct = breadcrumbMap[pathname];
  if (direct) return direct;
  const parent = pathname.substring(0, pathname.lastIndexOf("/"));
  return breadcrumbMap[parent] || "الرئيسية";
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toggleSidebar, currentUser, setCurrentUser } = useAppStore();
  const pageTitle = getPageTitle(pathname);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        setCurrentUser(null);
        toast.success("تم تسجيل الخروج بنجاح");
        router.push("/login");
        router.refresh();
      }
    } catch {
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    }
  };

  const userDropdownItems = [
    {
      label: "الملف الشخصي",
      icon: <User className="h-4 w-4" />,
      onClick: () => router.push("/dashboard/settings"),
    },
    {
      label: "الإعدادات",
      icon: <Settings className="h-4 w-4" />,
      onClick: () => router.push("/dashboard/settings"),
    },
    {
      label: "تسجيل الخروج",
      icon: <LogOut className="h-4 w-4" />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <header className="glass sticky top-0 z-30 flex h-16 items-center gap-4 px-4 lg:px-6">
      <button
        type="button"
        onClick={toggleSidebar}
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-2">
        <span className="text-sm font-bold tracking-tight">{pageTitle}</span>
      </div>

      <div className="flex flex-1" />

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <NotificationDropdown />

        <div className="h-5 w-px bg-white/5 mx-1" />

        <Dropdown
          align="end"
          trigger={
            <button className="flex items-center gap-2 rounded-xl p-1.5 text-sm transition-colors hover:bg-white/5">
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs shadow-sm">
                {currentUser?.name?.charAt(0) || "U"}
              </div>
              <div className="hidden sm:block text-right">
                <span className="block font-semibold text-sm leading-tight">
                  {currentUser?.name || "مستخدم"}
                </span>
                <span className="block text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                  {currentUser?.role === "ADMIN" ? "مدير النظام" : currentUser?.role === "MANAGER" ? "مدير" : "موظف"}
                </span>
              </div>
              <ChevronDown className="hidden sm:block h-4 w-4 text-gray-400" />
            </button>
          }
          items={userDropdownItems}
        />
      </div>
    </header>
  );
}
