"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#3b82f6", // blue
  "#22c55e", // green
  "#f59e0b", // yellow
  "#ef4444", // red
  "#a855f7", // purple
  "#06b6d4", // cyan
];

export default function SectorPieChart({ data }: { data: any[] }) {
  return (
    <div className="mt-6 p-4 bg-slate-900 rounded-2xl border border-blue-900">
      <h3 className="text-sm text-slate-400 mb-3">Sector Allocation</h3>

      <div className="w-full h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="sector"
              outerRadius={80}
              label={({ percent = 0 }) => `${percent.toFixed(2)}%`}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              content={({ payload }) => {
                if (!payload || !payload.length) return null;

                const data = payload[0].payload;

                return (
                  <div className="bg-slate-800 p-3 rounded-lg border border-slate-600 text-xs">
                    <div className="font-semibold mb-1">{data.sector}</div>

                    <div>Total: ${data.value.toFixed(2)}</div>

                    <div className="mt-2 space-y-1">
                      {data.stocks
                        ?.sort((a: any, b: any) => b.cost - a.cost)
                        .map((s: any) => (
                          <div key={s.symbol}>
                            {s.symbol}: ${s.cost.toFixed(2)}
                          </div>
                        ))}
                    </div>
                  </div>
                );
              }}
            />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
