"use client";

import React, { useMemo, useState } from "react";

interface BarChartDataPoint {
  label: string;
  value: number;
}

interface BarChartProps {
  data: BarChartDataPoint[];
}

export default function BarChart({ data }: BarChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const maxValue = useMemo(
    () => Math.max(...data.map((d) => d.value), 1),
    [data]
  );

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-end gap-8 h-72 min-w-[600px]">
        {data.map((d, i) => {
          const heightPercent = (d.value / maxValue) * 100;
          const isActive = hoverIndex === i;

          return (
            <div
              key={i}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
              className="flex-1 flex flex-col items-center justify-end relative group"
            >
              {/* Tooltip */}
              {isActive && (
                <div className="absolute -top-10 px-3 py-1.5 rounded-lg bg-[#111318] border border-white/10 text-xs shadow-lg">
                  €{d.value.toFixed(2)}
                </div>
              )}

              {/* Bar Container */}
              <div className="relative w-full flex items-end justify-center">
                <div
                  className={`w-12 rounded-2xl bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-xl transition-all duration-500 ease-out ${
                    isActive ? "scale-105 from-indigo-500 to-indigo-300" : ""
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              {/* Label */}
              <div
                className={`mt-4 text-xs transition-all duration-200 ${
                  isActive ? "opacity-100 text-white" : "opacity-50"
                }`}
              >
                {d.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
