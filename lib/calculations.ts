export function calculatePosition(
  lots: { price: number; qty: number }[],
  currentPrice: number,
) {
  const totalCost = lots.reduce((sum, lot) => sum + lot.price * lot.qty, 0);

  const totalQty = lots.reduce((sum, lot) => sum + lot.qty, 0);

  const avgPrice = totalQty > 0 ? totalCost / totalQty : 0;

  const marketValue = totalQty * currentPrice;

  const plValue = marketValue - totalCost;

  const plPercent = totalCost > 0 ? (plValue / totalCost) * 100 : 0;

  return {
    totalCost,
    totalQty,
    avgPrice,
    plValue,
    marketValue,
    plPercent,
    isProfit: plValue >= 0,
  };
}
export function calculateAllocationByStockWithSector(
  portfolio: Record<string, { lots: { price: number; qty: number }[] }>,
  stocks: {
    symbol: string;
    currentPrice: number;
    sector: string;
    subsector: string;
  }[],
) {
  let totalMarketValue = 0;

  const items = stocks.map((stock) => {
    const lots = portfolio[stock.symbol]?.lots || [];
    const position = calculatePosition(lots, stock.currentPrice);

    totalMarketValue += position.marketValue;

    return {
      symbol: stock.symbol,
      sector: stock.sector,
      subsector: stock.subsector,
      value: position.marketValue,
    };
  });

  return items.map((item) => ({
    ...item,
    percent: totalMarketValue > 0 ? (item.value / totalMarketValue) * 100 : 0,
    label: `${item.sector} | ${item.subsector}`, // 🔥 ใช้ใน legend
  }));
}
export function calculateStockAllocation(
  portfolio: Record<string, { lots: { price: number; qty: number }[] }>,
  stocks: {
    symbol: string;
    currentPrice: number;
  }[],
) {
  let totalCost = 0;

  const items = stocks.map((stock) => {
    const lots = portfolio[stock.symbol]?.lots || [];
    const position = calculatePosition(lots, stock.currentPrice);

    totalCost += position.totalCost;

    return {
      symbol: stock.symbol,
      cost: position.totalCost,
      pnl: position.marketValue - position.totalCost,
    };
  });

  return items.map((item) => ({
    ...item,
    percent: totalCost > 0 ? (item.cost / totalCost) * 100 : 0,
  }));
}
export function calculateAllocationBySector(
  portfolio: Record<string, { lots: { price: number; qty: number }[] }>,
  stocks: {
    symbol: string;
    currentPrice: number;
    sector: string;
  }[],
) {
  let totalMarketValue = 0;
  const sectorMap: Record<string, number> = {};

  for (const stock of stocks) {
    const lots = portfolio[stock.symbol]?.lots || [];
    const position = calculatePosition(lots, stock.currentPrice);

    totalMarketValue += position.marketValue;

    const sector = stock.sector || "Other";

    sectorMap[sector] = (sectorMap[sector] || 0) + position.marketValue;
  }

  return Object.entries(sectorMap).map(([sector, value]) => ({
    sector,
    value,
    percent: totalMarketValue > 0 ? value / totalMarketValue : 0,
  }));
}
