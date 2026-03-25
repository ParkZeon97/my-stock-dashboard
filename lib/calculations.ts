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
export function calculateAllocationByStock(
  portfolio: Record<string, { lots: { price: number; qty: number }[] }>,
  stocks: { symbol: string; currentPrice: number }[],
) {
  let totalMarketValue = 0;

  const items = stocks.map((stock) => {
    const lots = portfolio[stock.symbol]?.lots || [];

    const position = calculatePosition(lots, stock.currentPrice);

    totalMarketValue += position.marketValue;

    return {
      symbol: stock.symbol,
      value: position.marketValue,
    };
  });

  return items.map((item) => ({
    ...item,
    percent: totalMarketValue > 0 ? (item.value / totalMarketValue) * 100 : 0,
  }));
}
export function calculateAllocationBySector(
  portfolio: Record<string, { lots: { price: number; qty: number }[] }>,
  stocks: { symbol: string; currentPrice: number; sector: string }[],
) {
  let totalMarketValue = 0;
  const sectorMap: Record<string, number> = {};

  for (const stock of stocks) {
    const lots = portfolio[stock.symbol]?.lots || [];

    const position = calculatePosition(lots, stock.currentPrice);

    totalMarketValue += position.marketValue;

    const sector = stock.sector || "Unknown";

    sectorMap[sector] = (sectorMap[sector] || 0) + position.marketValue;
  }

  return Object.entries(sectorMap).map(([sector, value]) => ({
    sector,
    value,
    percent: totalMarketValue > 0 ? (value / totalMarketValue) * 100 : 0,
  }));
}
export function calculateSectorWithStocks(
  portfolio: Record<string, { lots: { price: number; qty: number }[] }>,
  stocks: { symbol: string; currentPrice: number; sector: string }[],
) {
  const sectorMap: Record<
    string,
    {
      value: number;
      stocks: { symbol: string; cost: number }[];
    }
  > = {};

  stocks.forEach((stock) => {
    const lots = portfolio[stock.symbol]?.lots || [];

    const position = calculatePosition(lots, stock.currentPrice);

    const sector = stock.sector || "Other";

    if (!sectorMap[sector]) {
      sectorMap[sector] = {
        value: 0,
        stocks: [],
      };
    }

    // ✅ ใช้ totalCost (ตาม requirement คุณ)
    sectorMap[sector].value += position.totalCost;

    sectorMap[sector].stocks.push({
      symbol: stock.symbol,
      cost: position.totalCost,
    });
  });

  return Object.entries(sectorMap).map(([sector, data]) => ({
    sector,
    value: data.value,
    stocks: data.stocks,
  }));
}
