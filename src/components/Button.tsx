import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-clinical-500 text-white hover:bg-clinical-600 focus-visible:ring-clinical-400 disabled:bg-clinical-300",
  secondary:
    "bg-transparent text-clinical-600 border border-clinical-300 hover:bg-clinical-50 dark:text-clinical-200 dark:border-clinical-700 dark:hover:bg-clinical-900/40",
  ghost:
    "bg-transparent text-ink-light hover:bg-black/5 dark:text-white/70 dark:hover:bg-white/5",
  danger:
    "bg-pulse-500 text-white hover:bg-pulse-600 focus-visible:ring-pulse-400 disabled:bg-pulse-300",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", isLoading, disabled, className = "", children, ...rest }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={disabled || isLoading ? undefined : { y: -1 }}
        whileTap={disabled || isLoading ? undefined : { scale: 0.97 }}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center gap-2 rounded-card px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
        {...rest}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";
