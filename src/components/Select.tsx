import { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, placeholder, id, className = "", ...rest }, ref) => {
    const selectId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={selectId} className="text-sm font-medium text-ink dark:text-white/90">
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={Boolean(error)}
            className={`w-full appearance-none rounded-card border bg-panel px-3 py-2 pr-9 text-sm text-ink transition-colors focus-visible:ring-2 disabled:opacity-60 dark:bg-panel-dark dark:text-white ${
              error
                ? "border-pulse-400 focus-visible:ring-pulse-300"
                : "border-border focus-visible:ring-clinical-300 dark:border-border-dark"
            } ${className}`}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-light dark:text-white/50" />
        </div>
        {error && <p className="text-xs text-pulse-500">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
