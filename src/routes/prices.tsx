import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LivePrice } from "@/components/LivePrice";
import { fetchMetal, formatINR, purityPrice } from "@/lib/prices";
import { CITIES } from "@/lib/cities";

export const Route = createFileRoute("/prices")({
  head: () => ({
    meta: [
      { title: "Live Gold & Silver Prices in India — GoldRatesToday.in" },
      { name: "description", content: "Live 24K, 22K & 18K gold prices, silver, platinum and palladium rates per gram in INR, updated every minute." },
      { property: "og:title", content: "Live Gold & Silver Prices in India" },
      { property: "og:description", content: "Real-time bullion rates per gram in INR." },
      { property: "og:url", content: "/prices" },
    ],
    links: [{ rel: "canonical", href: "/prices" }],
  }),
  component: PricesPage,
});

function PricesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
      <div className="text-center">
        <div className="text-xs uppercase tracking-[0.25em] text-gold">Live Market</div>
        <h1 className="mt-3 font-display text-4xl md:text-6xl">
          Bullion <span className="gold-shimmer">Rates</span>
        </h1>
        <p className="mt-4 mx-auto max-w-xl text-sm text-muted-foreground">
          All prices per gram in INR, refreshed every 60 seconds. USD prices per troy ounce shown for reference.
        </p>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <LivePrice symbol="XAU" label="Gold · 24K" />
        <LivePrice symbol="XAG" label="Silver" />
        <LivePrice symbol="XPT" label="Platinum" />
        <LivePrice symbol="XPD" label="Palladium" />
      </div>

      <GoldPurityTable />
      <CityTable />
      <Disclaimer />
    </div>
  );
}

function GoldPurityTable() {
  const [inrPerGram, setInrPerGram] = useState<number | null>(null);
  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const g = await fetchMetal("XAU");
        if (alive) setInrPerGram(g.inrPerGram);
      } catch { /* ignore */ }
    }
    load();
    const id = setInterval(load, 60_000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  const rows = (["24K", "22K", "18K", "14K"] as const).map((p) => ({
    p,
    per1: inrPerGram ? purityPrice(inrPerGram, p) : null,
    per8: inrPerGram ? purityPrice(inrPerGram, p) * 8 : null,
    per10: inrPerGram ? purityPrice(inrPerGram, p) * 10 : null,
  }));

  return (
    <section className="mt-20">
      <div className="text-xs uppercase tracking-[0.25em] text-gold">Gold by purity</div>
      <h2 className="mt-2 font-display text-3xl">Rates in INR</h2>

      <div className="card-luxe mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
              <tr className="border-b border-border/40">
                <th className="px-6 py-4">Purity</th>
                <th className="px-6 py-4">Per gram</th>
                <th className="px-6 py-4">Per 8g</th>
                <th className="px-6 py-4">Per 10g (tola)</th>
              </tr>
            </thead>
            <tbody className="font-mono tabular-nums">
              {rows.map((r) => (
                <tr key={r.p} className="border-b border-border/20 last:border-0 hover:bg-white/[0.02]">
                  <td className="px-6 py-4">
                    <span className="text-gold font-display text-base">{r.p}</span>
                  </td>
                  <td className="px-6 py-4">{r.per1 ? formatINR(r.per1) : "…"}</td>
                  <td className="px-6 py-4">{r.per8 ? formatINR(r.per8) : "…"}</td>
                  <td className="px-6 py-4">{r.per10 ? formatINR(r.per10) : "…"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function CityTable() {
  const [base, setBase] = useState<number | null>(null);
  useEffect(() => {
    let alive = true;
    fetchMetal("XAU").then((g) => alive && setBase(g.inrPerGram)).catch(() => {});
    return () => { alive = false; };
  }, []);

  return (
    <section className="mt-20">
      <div className="text-xs uppercase tracking-[0.25em] text-gold">City-wise</div>
      <h2 className="mt-2 font-display text-3xl">24K gold across Indian cities</h2>

      <div className="card-luxe mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
              <tr className="border-b border-border/40">
                <th className="px-6 py-4">City</th>
                <th className="px-6 py-4">State</th>
                <th className="px-6 py-4">24K / gram</th>
                <th className="px-6 py-4">22K / gram</th>
              </tr>
            </thead>
            <tbody className="font-mono tabular-nums">
              {CITIES.map((c) => {
                const p24 = base ? base * (1 + c.premiumPct / 100) : null;
                const p22 = p24 ? p24 * (22 / 24) : null;
                return (
                  <tr key={c.slug} className="border-b border-border/20 last:border-0 hover:bg-white/[0.02]">
                    <td className="px-6 py-4"><span className="font-display text-base text-foreground">{c.name}</span></td>
                    <td className="px-6 py-4 text-muted-foreground">{c.state}</td>
                    <td className="px-6 py-4 text-gold">{p24 ? formatINR(p24) : "…"}</td>
                    <td className="px-6 py-4">{p22 ? formatINR(p22) : "…"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Disclaimer() {
  return (
    <p className="mt-10 text-center text-xs text-muted-foreground">
      Rates derived from live LBMA spot via api.gold-api.com, converted at an indicative USD/INR rate.
      Local prices may vary due to import duty, GST and jeweller margins. Always verify before purchase.
    </p>
  );
}
