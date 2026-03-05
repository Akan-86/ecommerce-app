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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-brand-200 bg-white p-10 text-center shadow-card"
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 text-brand-600">
        {icon}
      </div>

      <h3 className="text-lg font-semibold text-brand-900">{title}</h3>

      {description && (
        <p className="mt-2 max-w-sm text-sm text-gray-500">{description}</p>
      )}

      {(primaryAction || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {primaryAction}
          {secondaryAction}
        </div>
      )}
    </motion.div>
  );
}
