import { StockData } from "@/types/stock";

export async function fetchStock(symbol: string): Promise<StockData | null> {
  try {
    const res = await fetch(`/api/stock?symbol=${symbol}`);

    if (!res.ok) return null;

    return res.json();
  } catch {
    return null;
  }
}
