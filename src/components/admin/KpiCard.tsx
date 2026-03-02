"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: number; // percentage change
  variant?: "default" | "success" | "danger";
  loading?: boolean;
}

export default function KpiCard({
  title,
  value,
  icon,
  trend,
  variant = "default",
  loading = false,
}: KpiCardProps) {
  const variantStyles = {
    default: "bg-[#111318] border-white/10",
    success:
      "bg-gradient-to-br from-[#0f1a14] to-[#0c1410] border-green-500/20",
    danger: "bg-gradient-to-br from-[#1a0f12] to-[#140c0e] border-red-500/20",
  };

  const trendPositive = typeof trend === "number" && trend > 0;
  const trendNegative = typeof trend === "number" && trend < 0;

  const trendColor = trendPositive
    ? "text-green-400"
    : trendNegative
      ? "text-red-400"
      : "text-white/40";

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_-20px_rgba(0,0,0,0.6)] ${variantStyles[variant]}`}
    >
      {/* Subtle Gradient Glow */}
      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/5 blur-3xl opacity-40 group-hover:opacity-60 transition-all duration-500" />

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-white/40">
            {title}
          </p>

          {loading ? (
            <div className="mt-4 h-8 w-28 rounded bg-white/10 animate-pulse" />
          ) : (
            <p className="mt-3 text-3xl font-semibold tracking-tight">
              {value}
            </p>
          )}
        </div>

        {icon && (
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-white/70 group-hover:scale-105 transition-transform duration-300">
            {icon}
          </div>
        )}
      </div>

      {typeof trend === "number" && !loading && (
        <div
          className={`mt-5 flex items-center gap-1 text-xs font-medium ${trendColor}`}
        >
          {trendPositive && <ArrowUpRight size={14} />}
          {trendNegative && <ArrowDownRight size={14} />}
          {trend > 0 ? "+" : ""}
          {trend}% vs last period
        </div>
      )}

      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/5 pointer-events-none" />
    </div>
  );
}
