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
      const results = await Promise.allSettled(
        watchlist.map((s) => fetchStock(s)),
      );
      const successful = results
        .filter(
          (r): r is PromiseFulfilledResult<StockData> =>
            r.status === "fulfilled" && r.value !== null,
        )
        .map((r) => r.value);

      setStocks(successful);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAll();
  }, [watchlist]);

  return { stocks, loading, refetch: fetchAll };
}
