interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  legend: string;
  options: RadioOption[];
  value: string | null;
  onChange: (value: string) => void;
  error?: string;
  layout?: "row" | "column";
}

export function RadioGroup({ name, legend, options, value, onChange, error, layout = "row" }: RadioGroupProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium text-ink dark:text-white/90">{legend}</legend>
      <div className={`flex gap-3 ${layout === "column" ? "flex-col" : "flex-wrap"}`}>
        {options.map((opt) => {
          const inputId = `${name}-${opt.value}`;
          const checked = value === opt.value;
          return (
            <label
              key={opt.value}
              htmlFor={inputId}
              className={`flex cursor-pointer items-center gap-2 rounded-card border px-3 py-2 text-sm transition-colors ${
                checked
                  ? "border-clinical-400 bg-clinical-50 text-clinical-700 dark:border-clinical-500 dark:bg-clinical-900/40 dark:text-clinical-200"
                  : "border-border text-ink dark:border-border-dark dark:text-white/80"
              }`}
            >
              <input
                type="radio"
                id={inputId}
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                className="h-4 w-4 accent-clinical-500"
              />
              {opt.label}
            </label>
          );
        })}
      </div>
      {error && <p className="text-xs text-pulse-500">{error}</p>}
    </fieldset>
  );
}
