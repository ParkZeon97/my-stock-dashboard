import { StockData, PortfolioData } from "@/types/stock";
import { calculatePosition } from "@/lib/calculations";
import { calculateAllocationByStock } from "@/lib/calculations";
import { calculateAllocationBySector } from "@/lib/calculations";
import { calculateSectorWithStocks } from "@/lib/calculations";
import StockRow from "@/components/dashboard/stock-row";
import SectorPieChart from "@/components/dashboard/sector-pie-chart";
import { usePortfolio } from "@/hooks/usePortfolio";

interface Props {
  stocks: StockData[];

  portfolioPositions: Record<
    string,
    { lots: { price: number; qty: number }[] }
  >;
  draftPositions: Record<string, { lots: { price: number; qty: number }[] }>;

  onUpdateSavedLot: (
    symbol: string,
    index: number,
    field: "price" | "qty",
    value: string,
  ) => void;

  onUpdateDraftLot: (
    symbol: string,
    index: number,
    field: "price" | "qty",
    value: string,
  ) => void;

  onAddLot: (symbol: string, price: number) => void;

  onRemoveSavedLot: (symbol: string, index: number) => void;
  onRemoveDraftLot: (symbol: string, index: number) => void;

  onRemoveAsset: (symbol: string) => void;

  addedCost: number;
  savePortfolio: () => void;
}

export default function PortfolioTable({
  stocks,
  portfolioPositions,
  draftPositions,
  onUpdateSavedLot,
  onUpdateDraftLot,
  onAddLot,
  onRemoveSavedLot,
  onRemoveDraftLot,
  onRemoveAsset,
  addedCost,
  savePortfolio,
}: Props) {
  const summary = stocks.reduce(
    (acc, stock) => {
      const lots = portfolioPositions[stock.symbol]?.lots || [];

      const position = calculatePosition(lots, stock.currentPrice);

      acc.totalCost += position.totalCost;
      acc.totalMarketValue += position.marketValue;

      return acc;
    },
    { totalCost: 0, totalMarketValue: 0 },
  );
  const plValue = summary.totalMarketValue - summary.totalCost;

  const plPercent =
    summary.totalCost > 0 ? (plValue / summary.totalCost) * 100 : 0;
  const isProfit = plValue >= 0;
  const allocation = calculateAllocationByStock(portfolioPositions, stocks);

  const sectorData = calculateAllocationBySector(portfolioPositions, stocks);

  const sectorDataWithStock = calculateSectorWithStocks(
    portfolioPositions,
    stocks,
  );

  return (
    <div className="backdrop-blur-sm shadow-lg border border-slate-200 rounded-2xl overflow-hidden">
      <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-black border border-blue-900 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* LEFT */}
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">
              Portfolio Value
            </p>
            <h2 className="text-2xl font-bold text-white">
              ${summary.totalMarketValue.toFixed(2)}
            </h2>
          </div>

          {/* CENTER */}
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase tracking-wider">
              Total P/L
            </p>
            <h2
              className={`text-xl font-semibold ${
                isProfit ? "text-green-400" : "text-red-400"
              }`}
            >
              {plValue.toFixed(2)} ({plPercent.toFixed(2)}%)
            </h2>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            <div className="text-sm text-emerald-400">
              Added: ${addedCost.toFixed(2)}
            </div>

            <button
              onClick={savePortfolio}
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-sm font-semibold"
            >
              Save Portfolio
            </button>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase tracking-wider">
              Total Cost
            </p>
            <h2 className="text-lg text-white">
              ${summary.totalCost.toFixed(2)}
            </h2>
          </div>
        </div>
      </div>
      <div className="mt-6 p-4 bg-slate-900 rounded-xl border border-blue-900">
        <h3 className="text-sm text-slate-400 mb-3">Allocation by Stock</h3>

        {allocation.map((item) => (
          <div key={item.symbol} className="mb-2">
            <div className="flex justify-between text-xs">
              <span>{item.symbol}</span>
              <span>{item.percent.toFixed(2)}%</span>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded">
              <div
                className="bg-blue-500 h-2 rounded"
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <SectorPieChart data={sectorData} />
      <table className="w-full text-sm">
        <thead className="border-b broder-slate-200">
          <tr className="bg-slate-950 uppercase text-xs tracking-wider">
            <th className="px-6 py-4 text-left">Stock</th>
            <th className="px-6 py-4 text-left">Price & Position</th>
            <th className="px-6 py-4 text-center">P/L</th>
            <th className="px-6 py-4 text-right">Average Cost</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {stocks.map((stock) => (
            <StockRow
              key={stock.symbol}
              stock={stock}
              savedLots={portfolioPositions[stock.symbol]?.lots || []}
              draftLots={draftPositions[stock.symbol]?.lots || []}
              onSavedLotChange={(i, f, v) =>
                onUpdateSavedLot(stock.symbol, i, f, v)
              }
              onDraftLotChange={(i, f, v) =>
                onUpdateDraftLot(stock.symbol, i, f, v)
              }
              onAddLot={() => onAddLot(stock.symbol, stock.currentPrice)}
              onRemoveSavedLot={(i) => onRemoveSavedLot(stock.symbol, i)}
              onRemoveDraftLot={(i) => onRemoveDraftLot(stock.symbol, i)}
              onRemoveAsset={() => onRemoveAsset(stock.symbol)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
