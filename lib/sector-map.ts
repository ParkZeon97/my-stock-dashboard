export type Sector =
  | "Technology"
  | "Healthcare"
  | "Financials"
  | "Energy"
  | "Materials"
  | "Industrials"
  | "Consumer Discretionary"
  | "Consumer Staples"
  | "Communication Services"
  | "Utilities"
  | "Real Estate"
  | "Other";

export type Subsector =
  | "Space & Aerospace"
  | "Defense & Military"
  | "Semiconductors"
  | "Cloud & SaaS"
  | "Fintech"
  | "E-commerce"
  | "Automotive"
  | "Renewable Energy"
  | "Biotech"
  | "Pharmaceuticals"
  | "Logistics"
  | "Materials"
  | "Other";

const subsectorKeywords: Record<Subsector, string[]> = {
  "Space & Aerospace": [
    "space",
    "rocket",
    "satellite",
    "launch",
    "aerospace",
    "orbital",
    "spacecraft",
  ],
  "Defense & Military": ["defense", "defence", "military", "drone", "missile"],
  Semiconductors: ["semiconductor", "chip"],
  "Cloud & SaaS": [
    "cloud",
    "saas",
    "data center",
    "datacenter",
    "compute",
    "ai",
    "infrastructure",
    "hosting",
  ],
  Fintech: ["fintech", "payment"],
  "E-commerce": ["ecommerce", "marketplace"],
  Automotive: ["automotive", "ev", "vehicle"],
  "Renewable Energy": ["solar", "wind", "renewable", "energy", "battery"],
  Biotech: ["biotech"],
  Pharmaceuticals: ["pharma", "drug"],
  Logistics: ["logistics", "shipping"],
  Materials: [
    "mining",
    "metal",
    "materials",
    "resources",
    "lithium",
    "uranium",
    "rare earth",
  ],
  Other: [],
};

const subsectorToSector: Record<Subsector, Sector> = {
  "Space & Aerospace": "Industrials",
  "Defense & Military": "Industrials",
  Semiconductors: "Technology",
  "Cloud & SaaS": "Technology",
  Fintech: "Financials",
  "E-commerce": "Consumer Discretionary",
  Automotive: "Consumer Discretionary",
  "Renewable Energy": "Energy",
  Biotech: "Healthcare",
  Pharmaceuticals: "Healthcare",
  Logistics: "Industrials",
  Materials: "Materials",
  Other: "Other",
};

function normalize(text?: string) {
  return (
    text
      ?.toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim() || ""
  );
}

function mapToSubsector(input: string): Subsector {
  const i = normalize(input);

  let best: Subsector = "Other";
  let bestScore = 0;

  for (const [sub, keywords] of Object.entries(subsectorKeywords) as [
    Subsector,
    string[],
  ][]) {
    const score = keywords.reduce((acc, k) => {
      if (!i.includes(k)) return acc;

      // 🔥 weight keyword สำคัญ
      if (k === "data center" || k === "ai") return acc + 2;

      return acc + 1;
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      best = sub;
    }
  }

  return bestScore > 0 ? best : "Other";
}

export function classifyCompany(
  industry?: string,
  name?: string,
  symbol?: string,
) {
  const input = [normalize(industry), normalize(name), normalize(symbol)]
    .filter(Boolean) // เอาเฉพาะที่มีค่า
    .join(" ");

  const subsector = mapToSubsector(input);
  const sector = subsectorToSector[subsector];

  return { sector, subsector };
}
