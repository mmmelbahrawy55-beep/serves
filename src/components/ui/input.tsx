import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ className, label, error, id, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "form-input",
          error && "!border-red-400 !ring-red-500/20",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mr-1">{error}</p>}
    </div>
  );
}
