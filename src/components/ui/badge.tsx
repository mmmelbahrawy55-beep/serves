import { cn } from "@/lib/utils";

const variantStyles: Record<string, string> = {
  default:
    "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10",
  primary:
    "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
  success:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
  warning:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
  danger:
    "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20",
  outline:
    "border border-gray-300 dark:border-white/20 text-gray-600 dark:text-gray-400",
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
