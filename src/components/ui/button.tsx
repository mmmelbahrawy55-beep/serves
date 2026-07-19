import { cn } from "@/lib/utils";

const variantStyles: Record<string, string> = {
  default:
    "bg-gray-100 dark:bg-white/[0.06] text-gray-700 dark:text-[#d0cbc2] hover:bg-gray-200 dark:hover:bg-white/[0.1] border border-gray-200 dark:border-white/[0.06]",
  primary:
    "bg-gradient-to-r from-amber-500 to-amber-600 text-[#08080f] hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20",
  destructive:
    "bg-red-500/10 text-red-500 dark:text-red-400 hover:bg-red-500/20 border border-red-500/15",
  outline:
    "border border-white/[0.08] text-[#9a948a] hover:bg-white/[0.03] hover:text-white",
  ghost:
    "text-[#9a948a] dark:text-[#9a948a] hover:text-white hover:bg-white/[0.04]",
  secondary:
    "bg-dark-700 text-white hover:bg-dark-600 border border-white/[0.06]",
};

const sizeStyles: Record<string, string> = {
  default: "h-10 px-5 py-2 text-sm",
  sm: "h-8 px-3 text-xs",
  lg: "h-12 px-8 text-base",
  icon: "h-10 w-10",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  asChild?: boolean;
}

export function Button({
  className,
  variant = "default",
  size = "default",
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:ring-offset-1 dark:focus:ring-offset-[#08080f] disabled:opacity-50 disabled:pointer-events-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
