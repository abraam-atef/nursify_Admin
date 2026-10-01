import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, id, className = "", rows = 3, ...rest }, ref) => {
    const areaId = id ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={areaId} className="text-sm font-medium text-ink dark:text-white/90">
          {label}
        </label>
        <textarea
          ref={ref}
          id={areaId}
          rows={rows}
          aria-invalid={Boolean(error)}
          className={`w-full resize-y rounded-card border bg-panel px-3 py-2 text-sm text-ink placeholder:text-ink-light/60 transition-colors focus-visible:ring-2 disabled:opacity-60 dark:bg-panel-dark dark:text-white ${
            error
              ? "border-pulse-400 focus-visible:ring-pulse-300"
              : "border-border focus-visible:ring-clinical-300 dark:border-border-dark"
          } ${className}`}
          {...rest}
        />
        {error && <p className="text-xs text-pulse-500">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
