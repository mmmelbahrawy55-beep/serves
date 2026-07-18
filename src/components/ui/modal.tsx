"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeStyles: Record<string, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export function Modal({ isOpen, onClose, title, description, children, size = "md", className }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className={`relative w-full ${sizeStyles[size]} animate-fade-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
          style={{
            backgroundColor: "var(--bg-card)",
            color: "var(--text-primary)",
          }}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/5">
            <div>
              {title && <h2 className="text-xl font-bold">{title}</h2>}
              {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
}
