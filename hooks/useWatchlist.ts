import { useState, useEffect } from "react";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("my-watchlist-v2");
    if (saved) setWatchlist(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("my-watchlist-v2", JSON.stringify(watchlist));
  }, [watchlist]);

  return { watchlist, setWatchlist };
}
