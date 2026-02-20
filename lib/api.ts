import { StockData } from "@/types/stock";

export async function fetchStock(symbol: string): Promise<StockData> {
  const res = await fetch(`/api/stock?symbol=${symbol}`);
  if (!res.ok) throw new Error("Failed to fetch stock");
  return res.json();
}
