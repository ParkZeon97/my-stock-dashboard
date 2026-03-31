"use client";

import { useState } from "react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useStocks } from "@/hooks/useStocks";

import DashboardHeader from "@/components/dashboard/dashboard-header";
import PortfolioTable from "@/components/dashboard/portfolio-table";

export default function DashboardPage() {
  const [searchInput, setSearchInput] = useState("");
  const { watchlist, setWatchlist } = useWatchlist();
  const {
    portfolioPositions,
    draftPositions,
    updateSavedLot,
    removeSavedLot,
    addDraftLot,
    updateDraftLot,
    removeDraftLot,
    savePortfolio,
    removeAsset,
    addedCost,
  } = usePortfolio();

  const { stocks, loading, refetch: refreshStockPrices } = useStocks(watchlist);
  const [searchError, setSearchError] = useState("");
  const addWatchlistSymbol = async (e: React.FormEvent) => {
    e.preventDefault();

    const symbol = searchInput.toUpperCase().trim();

    if (!symbol) return;

    try {
      const res = await fetch(`/api/stock?symbol=${symbol}`);

      if (!res.ok) {
        setSearchError("No symbols match your criteria");
        return;
      }

      setSearchError("");

      setWatchlist((prev) =>
        prev.includes(symbol) ? prev : [...prev, symbol],
      );

      setSearchInput("");
    } catch {
      setSearchError("No symbols match your criteria");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-800 via-blue-890 to-black p-8 text-white">
      <DashboardHeader
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        onAddWatchlist={addWatchlistSymbol}
        searchError={searchError}
        onRefreshStocks={refreshStockPrices}
        loading={loading}
      />

      <PortfolioTable
        stocks={stocks}
        portfolioPositions={portfolioPositions}
        draftPositions={draftPositions}
        onUpdateSavedLot={updateSavedLot}
        onRemoveSavedLot={removeSavedLot}
        onUpdateDraftLot={updateDraftLot}
        onRemoveDraftLot={removeDraftLot}
        onAddLot={addDraftLot}
        onRemoveAsset={(symbol) => {
          setWatchlist((prev) => prev.filter((s) => s !== symbol));
          removeAsset(symbol);
        }}
        addedCost={addedCost}
        savePortfolio={savePortfolio}
      />
    </div>
  );
}
