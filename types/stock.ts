export interface PortfolioData {
  qty: number;
  avg: number;
}

export interface AIAnalysis {
  support: number[];
  resistance: number[];
  sentiment: string;
  score?: number;
}

export interface StockData {
  symbol: string;
  name: string;
  currentPrice: number;
  afterHoursPrice: number;
  changePercent: number;
  isPositive: boolean;
  aiAnalysis: AIAnalysis;
}