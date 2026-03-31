import { useState, useEffect } from "react";

interface Lot {
  price: number;
  qty: number;
}

interface Position {
  lots: Lot[];
}

export function usePortfolio() {
  const [portfolioPositions, setPortfolioPositions] = useState<
    Record<string, Position>
  >({});

  const [draftPositions, setDraftPositions] = useState<
    Record<string, Position>
  >({});

  // ✅ load saved
  useEffect(() => {
    const saved = localStorage.getItem("portfolio-v3");
    if (saved) setPortfolioPositions(JSON.parse(saved));
  }, []);

  // ✅ persist saved only
  useEffect(() => {
    localStorage.setItem("portfolio-v3", JSON.stringify(portfolioPositions));
  }, [portfolioPositions]);

  // ------------------------
  // ✅ SAVED LOTS
  // ------------------------
  const updateSavedLot = (
    symbol: string,
    index: number,
    field: "price" | "qty",
    value: string,
  ) => {
    const num = parseFloat(value) || 0;

    setPortfolioPositions((prev) => {
      const lots = [...(prev[symbol]?.lots || [])];

      if (!lots[index]) lots[index] = { price: 0, qty: 0 };

      lots[index] = { ...lots[index], [field]: num };

      return { ...prev, [symbol]: { lots } };
    });
  };

  const removeSavedLot = (symbol: string, index: number) => {
    setPortfolioPositions((prev) => {
      const lots = (prev[symbol]?.lots || []).filter((_, i) => i !== index);

      return { ...prev, [symbol]: { lots } };
    });
  };

  // ------------------------
  // ✅ DRAFT LOTS
  // ------------------------
  const addDraftLot = (symbol: string, price: number) => {
    setDraftPositions((prev) => {
      const lots = prev[symbol]?.lots || [];

      return {
        ...prev,
        [symbol]: {
          lots: [...lots, { price, qty: 0 }],
        },
      };
    });
  };

  const updateDraftLot = (
    symbol: string,
    index: number,
    field: "price" | "qty",
    value: string,
  ) => {
    const num = parseFloat(value) || 0;

    setDraftPositions((prev) => {
      const lots = [...(prev[symbol]?.lots || [])];

      if (!lots[index]) lots[index] = { price: 0, qty: 0 };

      lots[index] = { ...lots[index], [field]: num };

      return { ...prev, [symbol]: { lots } };
    });
  };

  const removeDraftLot = (symbol: string, index: number) => {
    setDraftPositions((prev) => {
      const lots = (prev[symbol]?.lots || []).filter((_, i) => i !== index);

      return { ...prev, [symbol]: { lots } };
    });
  };

  // ------------------------
  // ✅ SAVE (commit draft → saved)
  // ------------------------
  const savePortfolio = () => {
    setPortfolioPositions((prev) => {
      const updated = { ...prev };

      Object.keys(draftPositions).forEach((symbol) => {
        const draftLots = draftPositions[symbol]?.lots || [];
        const savedLots = prev[symbol]?.lots || [];

        updated[symbol] = {
          lots: [...savedLots, ...draftLots],
        };
      });

      return updated;
    });

    // clear draft
    setDraftPositions({});
  };

  // ------------------------
  // ✅ REMOVE ASSET
  // ------------------------
  const removeAsset = (symbol: string) => {
    setPortfolioPositions((prev) => {
      const copy = { ...prev };
      delete copy[symbol];
      return copy;
    });

    setDraftPositions((prev) => {
      const copy = { ...prev };
      delete copy[symbol];
      return copy;
    });
  };

  // ------------------------
  // ✅ ADDED COST
  // ------------------------
  const addedCost = Object.values(draftPositions).reduce(
    (sum, pos) => sum + pos.lots.reduce((s, l) => s + l.price * l.qty, 0),
    0,
  );

  return {
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
  };
}
