import { useState, useEffect } from "react";
import { PortfolioData } from "@/types/stock";

export function usePortfolio() {
  const [portfolioMap, setPortfolioMap] = useState<
    Record<string, PortfolioData>
  >({});

  useEffect(() => {
    const saved = localStorage.getItem("my-portfolio-v2");
    if (saved) setPortfolioMap(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("my-portfolio-v2", JSON.stringify(portfolioMap));
  }, [portfolioMap]);

  return { portfolioMap, setPortfolioMap };
}
