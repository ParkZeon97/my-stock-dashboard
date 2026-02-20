export function calculatePL(
  qty: number,
  avg: number,
  currentPrice: number
) {
  const marketValue = qty * currentPrice;
  const cost = qty * avg;
  const plValue = marketValue - cost;
  const plPercent = cost > 0 ? (plValue / cost) * 100 : 0;

  return {
    marketValue,
    plValue,
    plPercent,
    isProfit: plValue >= 0,
  };
}