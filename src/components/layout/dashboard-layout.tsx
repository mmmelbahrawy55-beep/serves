"use client";

import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-secondary" dir="rtl">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="flex-1 p-4 lg:p-6 bg-dot-gold">
          {children}
        </main>
      </div>
    </div>
  );
}
