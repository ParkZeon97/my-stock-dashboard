"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";

const BASE_COLOR = [59, 130, 246]; // blue

function getShade(index: number, total: number) {
  const opacity = 0.4 + (index / total) * 0.6;
  return `rgba(${BASE_COLOR.join(",")}, ${opacity})`;
}

export function AllocationStockPie({ data }: { data: any[] }) {
  const [mode, setMode] = useState<"cost" | "pnl">("cost");

  return (
    <div className="p-4 rounded-2xl border">
      {/* 🔘 Mode Switch */}
      <div className="mb-3 flex gap-2">
        <button onClick={() => setMode("cost")}>Cost</button>
        <button onClick={() => setMode("pnl")}>Return</button>
      </div>

      <div className="flex">
        {/* 🔵 LEFT PIE */}
        <div className="w-1/2 h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="percent"
                nameKey="symbol"
                outerRadius={80}
                label={({ payload }) =>
                  `${payload.symbol} (${payload.percent.toFixed(1)}%)`
                }
              >
                {data.map((entry, i) => {
                  const color =
                    mode === "cost"
                      ? getShade(i, data.length)
                      : entry.pnl >= 0
                        ? "#22c55e"
                        : "#ef4444";

                  return <Cell key={i} fill={color} />;
                })}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 🟣 RIGHT PANEL */}
        <div className="w-1/2 pl-4 text-sm">
          {data.map((item, i) => (
            <div key={i} className="mb-2">
              <div className="font-medium">{item.symbol}</div>

              {mode === "cost" ? (
                <div>${item.cost.toFixed(2)}</div>
              ) : (
                <div
                  className={item.pnl >= 0 ? "text-green-500" : "text-red-500"}
                >
                  {item.pnl >= 0 ? "+" : "-"}${Math.abs(item.pnl).toFixed(2)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const SECTOR_COLORS: Record<string, string> = {
  Technology: "#3b82f6",
  Healthcare: "#22c55e",
  Financials: "#eab308",
  Energy: "#f97316",
  Materials: "#a855f7",
  Industrials: "#06b6d4",
  "Consumer Discretionary": "#ef4444",
  "Consumer Staples": "#84cc16",
  "Communication Services": "#6366f1",
  Utilities: "#14b8a6",
  "Real Estate": "#f43f5e",
  Other: "#64748b",
};

export function AllocationSectorPie({ data }: { data: any[] }) {
  return (
    <div className="p-4 rounded-2xl border">
      <div className="flex">
        {/* LEFT PIE */}
        <div className="w-1/2 h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="percent"
                nameKey="sector"
                outerRadius={80}
                label={({ percent = 0 }) => `${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={SECTOR_COLORS[entry.sector] || "#999"} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* RIGHT LEGEND */}
        <div className="w-1/2 pl-4 text-sm">
          {data.map((item, i) => (
            <div key={i} className="flex items-center mb-2">
              <div
                className="w-3 h-3 mr-2 rounded-sm"
                style={{
                  backgroundColor: SECTOR_COLORS[item.sector] || "#999",
                }}
              />
              <div>{item.sector}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
