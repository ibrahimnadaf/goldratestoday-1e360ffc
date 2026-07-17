// Live gold/silver prices from api.gold-api.com (free, no key)
// Returns USD/oz; we convert to INR/gram for India audience.
const OZ_TO_GRAM = 31.1035;
export const USD_TO_INR = 83.5; // fallback rate; refresh via cron later

export type MetalPrice = {
  symbol: "XAU" | "XAG" | "XPT" | "XPD";
  name: string;
  usdPerOz: number;
  inrPerGram: number;
  updatedAt: string;
};

export async function fetchMetal(symbol: MetalPrice["symbol"]): Promise<MetalPrice> {
  const res = await fetch(`https://api.gold-api.com/price/${symbol}`, { cache: "no-store" });
  if (!res.ok) throw new Error("price fetch failed");
  const data = await res.json();
  const usdPerOz = Number(data.price);
  return {
    symbol,
    name: data.name,
    usdPerOz,
    inrPerGram: (usdPerOz * USD_TO_INR) / OZ_TO_GRAM,
    updatedAt: data.updatedAt,
  };
}

export function purityPrice(base24kInrPerGram: number, purity: "24K" | "22K" | "18K" | "14K") {
  const map = { "24K": 1, "22K": 22 / 24, "18K": 18 / 24, "14K": 14 / 24 } as const;
  return base24kInrPerGram * map[purity];
}

export function formatINR(n: number, digits = 0) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(n);
}
