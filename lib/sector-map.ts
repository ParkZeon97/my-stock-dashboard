export function mapToSector(industry: string): string {
  const i = industry.toLowerCase();

  if (
    i.includes("mining") ||
    i.includes("metal") ||
    i.includes("rare earth") ||
    i.includes("materials")
  )
    return "Materials";

  if (
    i.includes("software") ||
    i.includes("semiconductor") ||
    i.includes("technology")
  )
    return "Technology";

  if (i.includes("biotech") || i.includes("pharma") || i.includes("health"))
    return "Healthcare";

  if (i.includes("bank") || i.includes("financial")) return "Financials";

  if (i.includes("oil") || i.includes("gas")) return "Energy";

  return "Other";
}
