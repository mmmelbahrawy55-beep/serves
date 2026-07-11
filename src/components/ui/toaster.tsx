"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-left"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        style: {
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: "0.75rem",
          padding: "1rem",
        },
        classNames: {
          success: "border-green-200 bg-green-50",
          error: "border-red-200 bg-red-50",
          warning: "border-yellow-200 bg-yellow-50",
          info: "border-blue-200 bg-blue-50",
        },
      }}
    />
  );
}
