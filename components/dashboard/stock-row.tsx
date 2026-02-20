import { calculatePL } from "@/lib/calculations";
import { StockData } from "@/types/stock";

interface Props {
  stock: StockData;
  qty: number;
  avg: number;
  onChange: (field: "qty" | "avg", value: string) => void;
  onRemove: () => void;
}

export default function StockRow({
  stock,
  qty,
  avg,
  onChange,
  onRemove,
}: Props) {
  const { plValue, plPercent, isProfit } = calculatePL(
    qty,
    avg,
    stock.currentPrice
  );

  return (
    <tr>
      <td>{stock.symbol}</td>
      <td>${stock.currentPrice.toFixed(2)}</td>
      <td>
        <input
          type="number"
          value={qty}
          onChange={(e) => onChange("qty", e.target.value)}
        />
      </td>
      <td>
        <span style={{ color: isProfit ? "green" : "red" }}>
          {plValue.toFixed(2)} ({plPercent.toFixed(2)}%)
        </span>
      </td>
      <td>
        <button onClick={onRemove}>Remove</button>
      </td>
    </tr>
  );
}