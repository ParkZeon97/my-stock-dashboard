import { useState, useEffect } from "react";
import { fetchStock } from "@/lib/api";
import { StockData } from "@/types/stock";

export function useStocks(watchlist: string[]) {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    if (!watchlist.length) {
      setStocks([]);
      return;
    }

    setLoading(true);
    try {
      const data = await Promise.all(watchlist.map((s) => fetchStock(s)));
      setStocks(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [watchlist]);

  return { stocks, loading, refetch: fetchAll };
}
