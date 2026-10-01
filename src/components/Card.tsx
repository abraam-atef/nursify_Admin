import { ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: ReactNode;
  className?: string;
  as?: "div";
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={`rounded-card border border-border bg-panel p-4 shadow-soft dark:border-border-dark dark:bg-panel-dark ${className}`}
    >
      {children}
    </motion.div>
  );
}
