import { calculatePosition } from "@/lib/calculations";
import { StockData } from "@/types/stock";

interface Props {
  stock: StockData;

  savedLots: { price: number; qty: number }[];
  draftLots: { price: number; qty: number }[];

  onSavedLotChange: (
    index: number,
    field: "price" | "qty",
    value: string,
  ) => void;

  onDraftLotChange: (
    index: number,
    field: "price" | "qty",
    value: string,
  ) => void;

  onAddLot: () => void;
  onRemoveSavedLot: (index: number) => void;
  onRemoveDraftLot: (index: number) => void;

  onRemoveAsset: () => void;
}

export default function StockRow({
  stock,
  savedLots,
  draftLots,
  onSavedLotChange,
  onDraftLotChange,
  onAddLot,
  onRemoveSavedLot,
  onRemoveDraftLot,
  onRemoveAsset,
}: Props) {
  const allLots = [...savedLots, ...draftLots];
  const {
    totalQty,
    avgPrice,
    plValue,
    plPercent,
    isProfit,
    totalCost,
    marketValue,
  } = calculatePosition(allLots, stock.currentPrice);

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

        {/* SAVED */}
        {savedLots.map((lot, index) => (
          <div key={`saved-${index}`} className="flex gap-2">
            <input
              type="number"
              value={lot.price || ""}
              onChange={(e) => onSavedLotChange(index, "price", e.target.value)}
            />
            <input
              type="number"
              value={lot.qty || ""}
              onChange={(e) => onSavedLotChange(index, "qty", e.target.value)}
            />
            <button onClick={() => onRemoveSavedLot(index)}>✕</button>
          </div>
        ))}

        {/* DRAFT */}
        {draftLots.map((lot, index) => (
          <div key={`draft-${index}`} className="flex gap-2 bg-green-900/20">
            <input
              type="number"
              value={lot.price || ""}
              onChange={(e) => onDraftLotChange(index, "price", e.target.value)}
            />
            <input
              type="number"
              value={lot.qty || ""}
              onChange={(e) => onDraftLotChange(index, "qty", e.target.value)}
            />
            <button onClick={() => onRemoveDraftLot(index)}>✕</button>
          </div>
        ))}

        <button
          onClick={onAddLot}
          className="mt-3 text-xs text-emerald-400 hover:text-emerald-300"
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
          onClick={onRemoveAsset}
          className="mt-2 ml-2 bg-red-600 border border-white-700 px-3 py-1 rounded-lg text-xs hover:bg-red-600/50"
        >
          Remove
        </button>
      </td>
    </tr>
  );
}
