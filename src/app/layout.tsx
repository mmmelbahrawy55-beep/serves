import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { ClientInit } from "@/components/ClientInit";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "نظام إدارة الشركات",
  description: "نظام متكامل لإدارة الشركات والمؤسسات",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen">
        <Toaster
          position="top-center"
          toastOptions={{
            className: "!font-sans !text-sm !rtl",
          }}
        />
        <ClientInit user={user}>{children}</ClientInit>
      </body>
    </html>
  );
}
