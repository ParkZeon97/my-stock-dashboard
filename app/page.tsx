
"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Trash2, Plus, RefreshCw, Search, Activity, Wallet, DollarSign, PieChart } from "lucide-react";

interface PortfolioData {
  qty: number;
  avg: number;
}

interface StockData {
  symbol: string;
  name: string;
  currentPrice: number;
  afterHoursPrice: number;
  changePercent: number;
  isPositive: boolean;
  aiAnalysis: {
    support: number[];
    resistance: number[];
    sentiment: string;
  };
  // ข้อมูลส่วนตัวที่เราจะเพิ่มเข้าไป
  portfolio?: PortfolioData;
}

export default function IntegratedPortfolioDashboard() {
  const [watchlist, setWatchlist] = useState<string[]>(["TSLA", "AAPL", "NVDA"]);
  const [portfolioMap, setPortfolioMap] = useState<Record<string, PortfolioData>>({});
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Load Data จาก LocalStorage
  useEffect(() => {
    const savedWatchlist = localStorage.getItem("my-watchlist-v2");
    const savedPortfolio = localStorage.getItem("my-portfolio-v2");
    if (savedWatchlist) setWatchlist(JSON.parse(savedWatchlist));
    if (savedPortfolio) setPortfolioMap(JSON.parse(savedPortfolio));
  }, []);

  // 2. Save Data & Fetch API
  useEffect(() => {
    localStorage.setItem("my-watchlist-v2", JSON.stringify(watchlist));
    localStorage.setItem("my-portfolio-v2", JSON.stringify(portfolioMap));
    fetchAllStocks();
  }, [watchlist, portfolioMap]);

  const fetchAllStocks = async () => {
    if (watchlist.length === 0) { setStocks([]); return; }
    setLoading(true);
    try {
      const promises = watchlist.map(symbol => 
        fetch(`/api/stock?symbol=${symbol}`).then(res => res.json())
      );
      const results = await Promise.all(promises);
      setStocks(results.filter(s => !s.error).map(s => ({
        ...s,
        portfolio: portfolioMap[s.symbol] || { qty: 0, avg: 0 }
      })));
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePortfolioChange = (symbol: string, field: keyof PortfolioData, value: string) => {
    const numValue = parseFloat(value) || 0;
    setPortfolioMap(prev => ({
      ...prev,
      [symbol]: { ...prev[symbol] || { qty: 0, avg: 0 }, [field]: numValue }
    }));
  };

  const addToWatchlist = (e: React.FormEvent) => {
    e.preventDefault();
    const symbol = searchInput.toUpperCase().trim();
    if (symbol && !watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol]);
      setSearchInput("");
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter(s => s !== symbol));
    const newPortfolio = { ...portfolioMap };
    delete newPortfolio[symbol];
    setPortfolioMap(newPortfolio);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              SMART PORTFOLIO MONITOR
            </h1>
            <p className="text-slate-500 text-sm">Real-time Tracking & AI Analysis</p>
          </div>

          <div className="flex gap-3">
            <form onSubmit={addToWatchlist} className="relative">
              <Plus className="absolute left-3 top-2.5 text-slate-500" size={18} />
              <input 
                type="text" placeholder="Add Ticker..." 
                className="bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 w-48 text-sm focus:border-blue-500 outline-none"
                value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
              />
            </form>
            <button onClick={fetchAllStocks} className="p-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800">
              <RefreshCw className={`${loading ? 'animate-spin' : ''} text-blue-400`} size={20} />
            </button>
          </div>
        </div>

        {/* Portfolio Table */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 text-[10px] uppercase tracking-[0.2em] border-b border-slate-800">
                  <th className="px-6 py-5 font-semibold">Asset Info</th>
                  <th className="px-6 py-5 font-semibold text-right">Market Data</th>
                  <th className="px-6 py-5 font-semibold">Your Position</th>
                  <th className="px-6 py-5 font-semibold text-right">Profit / Loss</th>
                  <th className="px-6 py-5 font-semibold">AI Insight</th>
                  <th className="px-6 py-5 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {stocks.map((stock) => {
                  const qty = portfolioMap[stock.symbol]?.qty || 0;
                  const avg = portfolioMap[stock.symbol]?.avg || 0;
                  const marketValue = qty * stock.currentPrice;
                  const plValue = marketValue - (qty * avg);
                  const plPercent = avg > 0 ? (plValue / (qty * avg)) * 100 : 0;
                  const isProfit = plValue >= 0;

                  return (
                    <tr key={stock.symbol} className="hover:bg-white/[0.02] transition-colors group">
                      {/* Asset Info */}
                      <td className="px-6 py-6">
                        <div className="flex flex-col">
                          <span className="text-xl font-black text-white">{stock.symbol}</span>
                          <span className="text-[11px] text-slate-500 truncate max-w-[150px]">{stock.name}</span>
                        </div>
                      </td>

                      {/* Market Data */}
                      <td className="px-6 py-6 text-right border-x border-slate-800/30">
                        <div className="flex flex-col items-end">
                          <span className="text-xl font-mono text-white">${stock.currentPrice.toFixed(2)}</span>
                          <div className={`flex items-center gap-1 text-xs font-bold ${stock.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {stock.isPositive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                            {Math.abs(stock.changePercent).toFixed(2)}%
                          </div>
                        </div>
                      </td>

                      {/* Your Position (INPUTS) */}
                      <td className="px-6 py-6 min-w-[200px]">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="relative">
                            <span className="absolute left-2 top-1 text-[8px] text-slate-500 uppercase font-bold">Qty</span>
                            <input 
                              type="number" value={qty || ""} placeholder="0"
                              onChange={(e) => handlePortfolioChange(stock.symbol, 'qty', e.target.value)}
                              className="bg-slate-950 border border-slate-800 rounded-lg pt-4 pb-1 px-2 w-full text-xs text-blue-400 focus:border-blue-500 outline-none"
                            />
                          </div>
                          <div className="relative">
                            <span className="absolute left-2 top-1 text-[8px] text-slate-500 uppercase font-bold">Avg</span>
                            <input 
                              type="number" value={avg || ""} placeholder="0.00"
                              onChange={(e) => handlePortfolioChange(stock.symbol, 'avg', e.target.value)}
                              className="bg-slate-950 border border-slate-800 rounded-lg pt-4 pb-1 px-2 w-full text-xs text-amber-400 focus:border-amber-500 outline-none"
                            />
                          </div>
                        </div>
                      </td>

                      {/* Profit / Loss (RESULTS) */}
                      <td className="px-6 py-6 text-right bg-slate-900/20">
                        <div className="flex flex-col items-end">
                          <span className={`text-lg font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isProfit ? '+' : ''}{plValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isProfit ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                            {isProfit ? '+' : ''}{plPercent.toFixed(2)}%
                          </span>
                        </div>
                      </td>

                      {/* AI Insight */}
                      <td className="px-6 py-6 border-l border-slate-800/30">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-slate-500">Support S1:</span>
                            <span className="text-emerald-500 font-mono">${stock.aiAnalysis.support[0]}</span>
                          </div>
                          <div className="flex justify-between text-[10px]">
                            <span className="text-slate-500">Resist R1:</span>
                            <span className="text-rose-500 font-mono">${stock.aiAnalysis.resistance[0]}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-6 text-center">
                        <button onClick={() => removeFromWatchlist(stock.symbol)} className="text-slate-700 hover:text-rose-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}