import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { fetchMetal, formatINR, purityPrice } from "@/lib/prices";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "Gold Price Calculator — GoldRatesToday.in" },
      { name: "description", content: "Calculate the exact price of your gold jewellery with live rates, making charge and GST — 24K, 22K, 18K supported." },
      { property: "og:title", content: "Gold Price Calculator — GoldRatesToday.in" },
      { property: "og:description", content: "Live gold calculator with making charge and GST." },
      { property: "og:url", content: "/calculator" },
    ],
    links: [{ rel: "canonical", href: "/calculator" }],
  }),
  component: CalculatorPage,
});

type Purity = "24K" | "22K" | "18K" | "14K";

function CalculatorPage() {
  const [weight, setWeight] = useState(10);
  const [purity, setPurity] = useState<Purity>("22K");
  const [makingPct, setMakingPct] = useState(8);
  const [gstOn, setGstOn] = useState(true);
  const [rate24k, setRate24k] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const g = await fetchMetal("XAU");
        if (alive) setRate24k(g.inrPerGram);
      } catch { /* ignore */ }
    }
    load();
    const id = setInterval(load, 60_000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  const breakdown = useMemo(() => {
    if (!rate24k) return null;
    const perGram = purityPrice(rate24k, purity);
    const metal = perGram * weight;
    const making = (metal * makingPct) / 100;
    const subtotal = metal + making;
    const gst = gstOn ? subtotal * 0.03 : 0;
    const total = subtotal + gst;
    return { perGram, metal, making, subtotal, gst, total };
  }, [rate24k, purity, weight, makingPct, gstOn]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
      <div className="text-center">
        <div className="text-xs uppercase tracking-[0.25em] text-gold">Live Calculator</div>
        <h1 className="mt-3 font-display text-4xl md:text-6xl">
          Gold Price <span className="gold-shimmer">Calculator</span>
        </h1>
        <p className="mt-4 mx-auto max-w-xl text-sm text-muted-foreground">
          Enter weight and purity — we compute the metal value, making charge and GST at today's live rate.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-5">
        {/* Inputs */}
        <div className="card-luxe p-8 lg:col-span-2">
          <div className="space-y-6">
            <Field label="Weight (grams)">
              <input
                type="number" min={0} step={0.1} value={weight}
                onChange={(e) => setWeight(Math.max(0, Number(e.target.value)))}
                className="glass w-full rounded-xl px-4 py-3 text-lg font-mono outline-none focus:border-gold/60"
              />
            </Field>

            <Field label="Purity">
              <div className="grid grid-cols-4 gap-2">
                {(["24K", "22K", "18K", "14K"] as const).map((p) => (
                  <button
                    key={p} type="button" onClick={() => setPurity(p)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                      purity === p
                        ? "border-gold bg-gold/15 text-gold shadow-[var(--shadow-glow-gold)]"
                        : "border-border/40 text-muted-foreground hover:border-gold/40"
                    }`}
                  >{p}</button>
                ))}
              </div>
            </Field>

            <Field label={`Making charge · ${makingPct}%`}>
              <input
                type="range" min={0} max={25} step={0.5} value={makingPct}
                onChange={(e) => setMakingPct(Number(e.target.value))}
                className="w-full accent-[oklch(0.86_0.17_88)]"
              />
            </Field>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox" checked={gstOn} onChange={(e) => setGstOn(e.target.checked)}
                className="h-4 w-4 accent-[oklch(0.86_0.17_88)]"
              />
              <span className="text-sm">Include 3% GST</span>
            </label>
          </div>
        </div>

        {/* Breakdown */}
        <div className="card-luxe p-8 lg:col-span-3">
          <div className="text-xs uppercase tracking-[0.25em] text-gold">Estimated total</div>
          <div className="mt-3 font-display text-5xl md:text-6xl gold-shimmer tabular-nums">
            {breakdown ? formatINR(breakdown.total) : "…"}
          </div>
          <div className="mt-2 text-xs text-muted-foreground font-mono">
            {rate24k ? `24K reference: ${formatINR(rate24k)}/g · updated live` : "loading live rate…"}
          </div>

          <div className="divider-gold my-8" />

          <dl className="space-y-4 text-sm">
            <Row k={`Rate (${purity} · per gram)`} v={breakdown ? formatINR(breakdown.perGram) : "…"} />
            <Row k={`Metal value (${weight}g)`} v={breakdown ? formatINR(breakdown.metal) : "…"} />
            <Row k={`Making charge (${makingPct}%)`} v={breakdown ? formatINR(breakdown.making) : "…"} />
            <Row k="Subtotal" v={breakdown ? formatINR(breakdown.subtotal) : "…"} muted />
            <Row k="GST (3%)" v={breakdown ? formatINR(breakdown.gst) : "…"} />
            <div className="divider-gold" />
            <Row k="Total payable" v={breakdown ? formatINR(breakdown.total) : "…"} strong />
          </dl>
        </div>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        <InfoCard title="Why 22K?" body="Most Indian jewellery is crafted in 22K — pure enough to shine, alloyed for durability." />
        <InfoCard title="Making charge" body="Ranges from 3% for machine-made to 25% for intricate handcrafted pieces." />
        <InfoCard title="GST" body="3% GST applies on the total of gold value plus making charge in India." />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}

function Row({ k, v, muted, strong }: { k: string; v: string; muted?: boolean; strong?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${muted ? "text-muted-foreground" : ""}`}>
      <dt className={strong ? "font-display text-lg" : ""}>{k}</dt>
      <dd className={`font-mono tabular-nums ${strong ? "text-2xl text-gold" : ""}`}>{v}</dd>
    </div>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="card-luxe p-6">
      <h3 className="font-display text-lg text-gold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
