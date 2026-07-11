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
  "/dashboard/payroll": "الرواتب",
  "/dashboard/clients": "العملاء",
  "/dashboard/inventory": "المخازن",
  "/dashboard/sales": "المبيعات",
  "/dashboard/accounting": "الحسابات",
  "/dashboard/projects": "المشاريع",
  "/dashboard/reports": "التقارير",
  "/dashboard/settings": "الإعدادات",
};

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toggleSidebar, currentUser, setCurrentUser } = useAppStore();

  const pageTitle = breadcrumbMap[pathname] || "الرئيسية";

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
      onClick: () => router.push("/settings"),
    },
    {
      label: "الإعدادات",
      icon: <Settings className="h-4 w-4" />,
      onClick: () => router.push("/settings"),
    },
    {
      label: "تسجيل الخروج",
      icon: <LogOut className="h-4 w-4" />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 lg:px-6">
      <button
        type="button"
        onClick={toggleSidebar}
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium text-gray-900">{pageTitle}</span>
      </div>

      <div className="flex flex-1" />

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100"
        >
          <Bell className="h-5 w-5" />
          <Badge variant="danger" className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center px-1 text-[10px]">
            3
          </Badge>
        </button>

        <Dropdown
          align="end"
          trigger={
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg p-1.5 text-sm transition-colors hover:bg-gray-100"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-medium text-white">
                {currentUser?.name?.charAt(0) || "U"}
              </div>
              <span className="hidden font-medium text-gray-700 sm:block">
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
