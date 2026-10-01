import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = "", ...rest }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-ink dark:text-white/90">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          className={`w-full rounded-card border bg-panel px-3 py-2 text-sm text-ink placeholder:text-ink-light/60 transition-colors focus-visible:ring-2 disabled:opacity-60 dark:bg-panel-dark dark:text-white ${
            error
              ? "border-pulse-400 focus-visible:ring-pulse-300"
              : "border-border focus-visible:ring-clinical-300 dark:border-border-dark"
          } ${className}`}
          {...rest}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-pulse-500">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={`${inputId}-hint`} className="text-xs text-ink-light dark:text-white/50">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
