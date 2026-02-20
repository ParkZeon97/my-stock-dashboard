"use client";

import { useState } from "react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useStocks } from "@/hooks/useStocks";

import DashboardHeader from "@/components/dashboard/dashboard-header";
import PortfolioTable from "@/components/dashboard/portfolio-table";

export default function DashboardPage() {
  const { watchlist, setWatchlist } = useWatchlist();
  const { portfolioMap, setPortfolioMap } = usePortfolio();
  const { stocks, loading, refetch } = useStocks(watchlist);
  const [searchInput, setSearchInput] = useState("");
  const addToWatchlist = (e: React.FormEvent) => {
    e.preventDefault();
    const symbol = searchInput.toUpperCase().trim();
    if ( symbol && !watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol]);
      setSearchInput("");
    }
  };
  
  const handlePortfolioChange = (
    symbol: string,
    field: "qty" | "avg",
    value: string
  ) => {
    const numValue = parseFloat(value) || 0;
    
    setPortfolioMap((prev) => ({
     ...prev,
     [symbol]: {
      ...prev[symbol],
      [field]: numValue,
     },

    }));
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist((prev) => 
    prev.filter((s) => s !== symbol)
    );

    setPortfolioMap((prev) => {
      const copy = {...prev};
      delete copy[symbol];
      return copy;
    });
  };

  return (
  <div className="p-8">
    <DashboardHeader
    searchInput={searchInput}
    setSearchInput={setSearchInput}
    onAdd={addToWatchlist}
    onRefresh={refetch}
    loading={loading}
    />

    <PortfolioTable
    stocks={stocks}
    portfolioMap={portfolioMap}
    onChange={handlePortfolioChange}
    onRemove={removeFromWatchlist}
    />
  </div>

  );
}