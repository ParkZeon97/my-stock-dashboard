import { useState, useEffect } from "react";
import { PortfolioData } from "@/types/stock";

interface PortfolioLot {
  price: number;
  qty: number;
}

interface PortfolioPosition {
  lots: PortfolioLot[];
}

export function usePortfolio() {
  const [portfolioPositions, setPortfolioPositions] = useState<
    Record<string, PortfolioPosition>
  >({});

  useEffect(() => {
    const saved = localStorage.getItem("my-portfolio-v2");
    if (saved) setPortfolioPositions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("my-portfolio-v2", JSON.stringify(portfolioPositions));
  }, [portfolioPositions]);

  // ✅ ย้าย handleLotChange มาที่นี่
  const updatePortfolioLot = (
    symbol: string,
    lotIndex: number,
    field: "price" | "qty",
    value: string,
  ) => {
    const numericValue = parseFloat(value) || 0;

    setPortfolioPositions((prev) => {
      const existingLots = prev[symbol]?.lots || [];
      const updatedLots = [...existingLots];

      if (!updatedLots[lotIndex]) {
        updatedLots[lotIndex] = { price: 0, qty: 0 };
      }

      updatedLots[lotIndex] = {
        ...updatedLots[lotIndex],
        [field]: numericValue,
      };

      return {
        ...prev,
        [symbol]: { lots: updatedLots },
      };
    });
  };

  const addPortfolioLot = (symbol: string) => {
    setPortfolioPositions((prev) => {
      const existingLots = prev[symbol]?.lots || [];
      return {
        ...prev,
        [symbol]: {
          lots: [...existingLots, { price: 0, qty: 0 }],
        },
      };
    });
  };

  const removePortfolioLot = (symbol: string, lotIndex: number) => {
    setPortfolioPositions((prev) => {
      const existingLots = prev[symbol]?.lots || [];
      const filteredLots = existingLots.filter((_, i) => i !== lotIndex);

      return {
        ...prev,
        [symbol]: { lots: filteredLots },
      };
    });
  };

  const removePortfolioAsset = (symbol: string) => {
    setPortfolioPositions((prev) => {
      const updated = { ...prev };
      delete updated[symbol];
      return updated;
    });
  };

  return {
    portfolioPositions,
    updatePortfolioLot,
    addPortfolioLot,
    removePortfolioLot,
    removePortfolioAsset,
  };
}
