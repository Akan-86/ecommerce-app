"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
}

export default function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-black/10 bg-white px-8 py-12 text-center"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-black/5 text-black">
        {icon}
      </div>

      <h3 className="text-xl font-medium tracking-tight text-black">{title}</h3>

      {description && (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-500">
          {description}
        </p>
      )}

      {(primaryAction || secondaryAction) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          {primaryAction}
          {secondaryAction}
        </div>
      )}
    </motion.div>
  );
}
