"use client";

import { usePathname, useRouter } from "next/navigation";
import { Menu, Bell, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Badge } from "@/components/ui/badge";
import { Dropdown } from "@/components/ui/dropdown";
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
  "/dashboard/accounting/journal": "قيود اليومية",
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
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm px-4 lg:px-6 shadow-sm">
      <button
        type="button"
        onClick={toggleSidebar}
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-gray-900 tracking-tight">{pageTitle}</span>
      </div>

      <div className="flex flex-1" />

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
        >
          <Bell className="h-5 w-5" />
          <Badge variant="danger" className="absolute -top-0.5 -right-0.5 flex h-5 min-w-[20px] items-center justify-center px-1 text-[10px]">
            3
          </Badge>
        </button>

        <Dropdown
          align="end"
          trigger={
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl p-1.5 text-sm transition-colors hover:bg-gray-100 hover:shadow-sm"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-sm">
                {currentUser?.name?.charAt(0) || "U"}
              </div>
              <span className="hidden font-semibold text-gray-700 sm:block">
                {currentUser?.name || "مستخدم"}
              </span>
              <ChevronDown className="hidden h-4 w-4 text-gray-400 sm:block" />
            </button>
          }
          items={userDropdownItems}
        />
      </div>
    </header>
  );
}
