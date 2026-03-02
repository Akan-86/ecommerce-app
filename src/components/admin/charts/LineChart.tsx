"use client";

import React, { useMemo, useState } from "react";

interface LineChartDataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: LineChartDataPoint[];
}

export default function LineChart({ data }: LineChartProps) {
  const width = 700;
  const height = 260;
  const padding = 50;

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const maxValue = useMemo(
    () => Math.max(...data.map((d) => d.value), 1),
    [data]
  );

  const chartPoints = useMemo(() => {
    return data.map((d, i) => {
      const x =
        padding + (i * (width - padding * 2)) / Math.max(data.length - 1, 1);
      const y =
        height - padding - (d.value / maxValue) * (height - padding * 2);
      return { x, y };
    });
  }, [data, maxValue]);

  const pointsString = chartPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-72"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid */}
        {[0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = height - padding - ratio * (height - padding * 2);
          return (
            <line
              key={ratio}
              x1={padding}
              x2={width - padding}
              y1={y}
              y2={y}
              stroke="currentColor"
              strokeOpacity="0.06"
            />
          );
        })}

        {/* Gradient */}
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area */}
        <polygon
          points={`${padding},${height - padding} ${pointsString} ${
            width - padding
          },${height - padding}`}
          fill="url(#areaGradient)"
          className="transition-all duration-700 ease-out"
        />

        {/* Line */}
        <polyline
          fill="none"
          stroke="#6366f1"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={pointsString}
          className="transition-all duration-700 ease-out"
        />

        {/* Points + Tooltip */}
        {chartPoints.map((point, i) => (
          <g
            key={i}
            onMouseEnter={() => setHoverIndex(i)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            <circle
              cx={point.x}
              cy={point.y}
              r={hoverIndex === i ? 6 : 4}
              fill="#6366f1"
              className="transition-all duration-200 cursor-pointer"
            />

            {hoverIndex === i && (
              <g>
                <rect
                  x={point.x - 45}
                  y={point.y - 40}
                  width="90"
                  height="28"
                  rx="8"
                  fill="#111318"
                  stroke="#ffffff20"
                />
                <text
                  x={point.x}
                  y={point.y - 22}
                  textAnchor="middle"
                  className="text-xs fill-white"
                >
                  €{data[i].value.toFixed(2)}
                </text>
              </g>
            )}
          </g>
        ))}

        {/* X Labels */}
        {chartPoints.map((point, i) => (
          <text
            key={i}
            x={point.x}
            y={height - padding + 20}
            textAnchor="middle"
            className="text-xs fill-current opacity-40"
          >
            {data[i].label}
          </text>
        ))}
      </svg>
    </div>
  );
}
