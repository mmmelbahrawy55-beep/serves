import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
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
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey="theme"
        >
          <Toaster
            position="top-center"
            toastOptions={{
              className: "!font-sans !text-sm !rtl",
              style: {
                background: "var(--bg-card)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-primary)",
              },
            }}
          />
          <ClientInit user={user}>{children}</ClientInit>
        </ThemeProvider>
      </body>
    </html>
  );
}
