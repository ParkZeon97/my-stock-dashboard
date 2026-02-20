"use client";

import { Plus, RefreshCw } from "lucide-react";

interface Props {
  searchInput: string;
  setSearchInput: (v: string) => void;
  onAdd: (e: React.FormEvent) => void;
  onRefresh: () => void;
  loading: boolean;
}

export default function DashboardHeader({
  searchInput,
  setSearchInput,
  onAdd,
  onRefresh,
  loading,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold">
          SMART PORTFOLIO MONITOR
        </h1>
        <p className="text-slate-500 text-sm">
          Real-time Tracking & AI Analysis
        </p>
      </div>

      <div className="flex gap-3">
        <form onSubmit={onAdd} className="relative">
          <Plus
            className="absolute left-3 top-2.5 text-slate-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Add Ticker..."
            className="border rounded-xl py-2 pl-10 pr-4 w-48 text-sm"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>

        <button
          onClick={onRefresh}
          className="p-2 border rounded-xl"
        >
          <RefreshCw
            className={loading ? "animate-spin" : ""}
            size={20}
          />
        </button>
      </div>
    </div>
  );
}