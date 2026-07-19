import { cn } from "@/lib/utils";

const variantStyles: Record<string, string> = {
  default:
    "bg-white/[0.06] text-[#d0cbc2] border border-white/[0.06]",
  primary:
    "bg-amber-500/10 text-amber-400 border border-amber-500/15",
  success:
    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15",
  warning:
    "bg-amber-500/10 text-amber-400 border border-amber-500/15",
  danger:
    "bg-red-500/10 text-red-400 border border-red-500/15",
  outline:
    "border border-white/[0.1] text-[#9a948a]",
};

export interface BadgeProps {
  variant?: keyof typeof variantStyles;
  className?: string;
  children?: React.ReactNode;
}

export function Badge({ variant = "default", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
