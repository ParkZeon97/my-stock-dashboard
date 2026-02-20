import { StockData, PortfolioData } from "@/types/stock";
import StockRow from "@/components/dashboard/stock-row";

interface Props {
  stocks: StockData[];
  portfolioMap: Record<string, PortfolioData>;
  onChange: (
    symbol: string,
    field: keyof PortfolioData,
    value: string
  ) => void;
  onRemove: (symbol: string) => void;
}

export default function PortfolioTable({
  stocks,
  portfolioMap,
  onChange,
  onRemove,
}: Props) {
  return (
    <div className="border rounded-2xl overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Price</th>
            <th>Position</th>
            <th>P/L</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <StockRow
              key={stock.symbol}
              stock={stock}
              qty={portfolioMap[stock.symbol]?.qty || 0}
              avg={portfolioMap[stock.symbol]?.avg || 0}
              onChange={(field, value) =>
                onChange(stock.symbol, field, value)
              }
              onRemove={() => onRemove(stock.symbol)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}