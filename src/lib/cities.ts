export type City = {
  slug: string;
  name: string;
  state: string;
  premiumPct: number; // % premium/discount vs national 24K reference
};

export const CITIES: City[] = [
  { slug: "mumbai", name: "Mumbai", state: "Maharashtra", premiumPct: 0.4 },
  { slug: "delhi", name: "Delhi", state: "Delhi", premiumPct: 0.2 },
  { slug: "bangalore", name: "Bangalore", state: "Karnataka", premiumPct: 0.5 },
  { slug: "chennai", name: "Chennai", state: "Tamil Nadu", premiumPct: 0.9 },
  { slug: "hyderabad", name: "Hyderabad", state: "Telangana", premiumPct: 0.3 },
  { slug: "kolkata", name: "Kolkata", state: "West Bengal", premiumPct: 0.2 },
  { slug: "pune", name: "Pune", state: "Maharashtra", premiumPct: 0.4 },
  { slug: "ahmedabad", name: "Ahmedabad", state: "Gujarat", premiumPct: 0.1 },
  { slug: "jaipur", name: "Jaipur", state: "Rajasthan", premiumPct: 0.2 },
  { slug: "lucknow", name: "Lucknow", state: "Uttar Pradesh", premiumPct: 0.15 },
  { slug: "kochi", name: "Kochi", state: "Kerala", premiumPct: 0.85 },
  { slug: "surat", name: "Surat", state: "Gujarat", premiumPct: 0.05 },
];

export function getCity(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}
