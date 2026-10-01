import { ReactNode } from "react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center gap-3 rounded-card border border-dashed border-border px-6 py-14 text-center dark:border-border-dark"
    >
      {icon && <div className="text-clinical-400">{icon}</div>}
      <div className="space-y-1">
        <h3 className="text-base font-semibold">{title}</h3>
        {description && <p className="text-sm text-ink-light dark:text-white/50">{description}</p>}
      </div>
      {action}
    </motion.div>
  );
}
