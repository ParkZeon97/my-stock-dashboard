"use client";

import { Plus, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

interface Props {
  searchInput: string;
  setSearchInput: (v: string) => void;
  onAddWatchlist: (e: React.FormEvent) => void;
  searchError: string;
  onRefreshStocks: () => void;
  loading: boolean;
}

export default function DashboardHeader({
  searchInput,
  setSearchInput,
  onAddWatchlist,
  onRefreshStocks,
  searchError,
}: Props) {
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchInput.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);

      const res = await fetch(`/api/search?q=${searchInput}`);
      const data = await res.json();

      setSuggestions(data);
      setLoading(false);
    };

    const debounce = setTimeout(fetchSuggestions, 300);

    return () => clearTimeout(debounce);
  }, [searchInput]);
  /* exchange rate */
  const [usdAmount, setUsdAmount] = useState("");
  const [usdThbRate, setUsdThbRate] = useState<number | null>(null);
  const thbAmount =
    usdAmount && usdThbRate ? (Number(usdAmount) * usdThbRate).toFixed(2) : "";
  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((res) => res.json())
      .then((data) => {
        setUsdThbRate(data.rates.THB);
      });
  }, []);

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
      <div>
        <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
          SMART PORTFOLIO MONITOR
        </h1>
        <p className="text-blue-200/70 text-sm mt-2 tracking-wide">
          Real-time Tracking & AI Analysis
        </p>
      </div>

      <div className="flex gap-3">
        {/* exchange rate */}
        <div className="flex items-center gap-3 bg-slate-900 border border-blue-900 rounded-xl px-3 py-2">
          <input
            type="number"
            placeholder="USD"
            value={usdAmount}
            onChange={(e) => setUsdAmount(e.target.value)}
            className="bg-transparent text-white w-20 text-sm outline-none"
          />
          <span className="text-blue-400 text-sm">=</span>
          <span className="text-blue-300 font-semibold text-sm">
            {thbAmount ? `${thbAmount} THB` : "—"}
          </span>
        </div>

        <form onSubmit={onAddWatchlist} className="relative w-52">
          <Plus className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Add Ticker..."
            className="border border-blue-800 text-white rounded-xl py-2 pl-10 pr-4 w-52 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {/* Error Message */}
          {searchError && (
            <p className="text-red-400 text-xs mt-1">{searchError}</p>
          )}

          {/* Autocomplete Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute top-full mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg shadow-lg z-50">
              {suggestions.map((item) => (
                <div
                  key={`${item.symbol}-${item.description}`}
                  onClick={() => {
                    setSearchInput(item.symbol);
                    setSuggestions([]);
                  }}
                  className="px-3 py-2 hover:bg-slate-800 cursor-pointer text-sm"
                >
                  <span className="font-semibold">{item.symbol}</span>
                  <span className="text-slate-400 ml-2">
                    {item.description}
                  </span>
                </div>
              ))}
            </div>
          )}
        </form>

        <button
          onClick={onRefreshStocks}
          className="bg-blue-600/20 border border-blue-700 p-2 rounded-xl hover:bg-blue-600/40 transition"
        >
          <RefreshCw
            className={`{loading ? "animate-spin" : ""} text-blue-300`}
            size={20}
          />
        </button>
      </div>
    </div>
  );
}
