"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "start" | "end";
}

export function Dropdown({ trigger, items, align = "start" }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            "absolute top-full mt-2 z-50 min-w-[200px] overflow-hidden rounded-xl border shadow-lg animate-fade-in",
            align === "end" ? "left-0" : "right-0"
          )}
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border-primary)",
            boxShadow: "var(--shadow-card-hover)",
          }}
        >
          <div className="py-1">
            {items.map((item, i) => (
              <button
                key={i}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                  item.danger
                    ? "text-red-500 hover:bg-red-500/10"
                    : "hover:bg-blue-500/5",
                  item.disabled && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => {
                  if (!item.disabled) { item.onClick(); setOpen(false); }
                }}
                disabled={item.disabled}
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
