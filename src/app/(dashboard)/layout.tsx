import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default async function ProtectedDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardLayout>{children}</DashboardLayout>
  );
}
