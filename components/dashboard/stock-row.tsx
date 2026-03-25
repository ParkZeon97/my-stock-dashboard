import { calculatePosition } from "@/lib/calculations";
import { StockData } from "@/types/stock";

interface Props {
  stock: StockData;
  lots: { price: number; qty: number }[];

  onLotChange: (index: number, field: "price" | "qty", value: string) => void;

  onAddLot: () => void;

  onRemoveLot: (index: number) => void;

  onRemoveAsset: () => void;

  onSubmit: () => void;
}

export default function StockRow({
  stock,
  lots,
  onLotChange,
  onAddLot,
  onRemoveLot,
  onRemoveAsset,
  onSubmit,
}: Props) {
  const {
    totalQty,
    avgPrice,
    plValue,
    plPercent,
    isProfit,
    totalCost,
    marketValue,
  } = calculatePosition(lots, stock.currentPrice);

  return (
    <tr className="hover:bg-slate-600 transition-colors">
      <td className="px-6 py-4 font-semibold">{stock.symbol}</td>

      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="text-sm mb-2">
            {" "}
            Current: ${stock.currentPrice.toFixed(2)}
          </div>
          <div className="text-sm mb-2">
            {" "}
            Total Cost: ${totalCost.toFixed(2)}
          </div>
          <div className="text-sm mb-2">
            {" "}
            Total Stock: {totalQty.toFixed(2)}
          </div>
        </div>

        <div className="space-y-3">
          {lots.map((lot, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl border border-blue-900"
            >
              <span className="text-xs w-12">Lot {index + 1}</span>

              <input
                type="number"
                placeholder="Price"
                value={lot.price === 0 ? "" : lot.price}
                onChange={(e) => onLotChange(index, "price", e.target.value)}
                className="bg-slate-800 border border-blue-800 rounded-lg px-2 py-1 w-24 text-sm"
              />

              <input
                type="number"
                placeholder="Qty"
                value={lot.qty === 0 ? "" : lot.qty}
                onChange={(e) => onLotChange(index, "qty", e.target.value)}
                className="bg-slate-800 border border-blue-800 rounded-lg px-2 py-1 w-20 text-sm"
              />

              <button
                onClick={() => onRemoveLot(index)}
                className="text-rose-400 text-xs hover:text-rose-300"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={onAddLot}
          className="mt-3 text-xs text-blue-400 hover:text-blue-300"
        >
          + Add Lot
        </button>
      </td>

      {/* P/L กลาง */}
      <td className="px-6 py-4 text-center">
        <div
          className={`text-lg font-semibold ${
            isProfit ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          ${plValue.toFixed(2)}
        </div>
        <div className="text-xs text-blue-300/70">{plPercent.toFixed(2)}%</div>
      </td>

      {/* Average ขวาสุด */}
      <td className="px-6 py-4 text-right">
        <div className="text-blue-200 font-medium">${avgPrice.toFixed(2)}</div>

        <button
          onClick={onSubmit}
          className="mt-2 bg-blue-600/30 border border-blue-700 px-3 py-1 rounded-lg text-xs hover:bg-blue-600/50"
        >
          Save
        </button>
        <button
          onClick={onRemoveAsset}
          className="mt-2 ml-2 bg-red-600 border border-white-700 px-3 py-1 rounded-lg text-xs hover:bg-red-600/50"
        >
          Remove
        </button>
      </td>
    </tr>
  );
}
