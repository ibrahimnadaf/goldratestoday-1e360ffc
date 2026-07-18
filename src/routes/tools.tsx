import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { fetchMetal, formatINR, purityPrice } from "@/lib/prices";
import { Calculator, Coins, TrendingUp, Scale, Wallet, PiggyBank, Banknote, Repeat } from "lucide-react";

export const Route = createFileRoute("/tools")({
  head: () => ({
    meta: [
      { title: "Gold Calculators & Tools — GoldRatesToday.in" },
      { name: "description", content: "SIP, EMI, gold loan, purity, tola/gram, savings, GST and karat converter — all in one premium suite." },
      { property: "og:title", content: "Gold Calculators & Tools — GoldRatesToday.in" },
      { property: "og:description", content: "The complete gold calculators suite." },
    ],
    links: [{ rel: "canonical", href: "/tools" }],
  }),
  component: ToolsHub,
});

const TABS = [
  { id: "sip", label: "Gold SIP", icon: TrendingUp },
  { id: "loan", label: "Gold Loan", icon: Banknote },
  { id: "emi", label: "Jewellery EMI", icon: Wallet },
  { id: "savings", label: "Savings Goal", icon: PiggyBank },
  { id: "purity", label: "Purity Value", icon: Coins },
  { id: "karat", label: "Karat Converter", icon: Repeat },
  { id: "tola", label: "Tola ↔ Gram", icon: Scale },
  { id: "gst", label: "GST Calculator", icon: Calculator },
] as const;
type TabId = typeof TABS[number]["id"];

function ToolsHub() {
  const [tab, setTab] = useState<TabId>("sip");
  const [rate24k, setRate24k] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    const load = () => fetchMetal("XAU").then((g) => alive && setRate24k(g.inrPerGram)).catch(() => {});
    load();
    const id = setInterval(load, 60_000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
      <div className="text-center">
        <div className="text-xs uppercase tracking-[0.25em] text-gold">Premium Suite</div>
        <h1 className="mt-3 font-display text-4xl md:text-6xl">
          Gold <span className="gold-shimmer">Calculators</span>
        </h1>
        <p className="mt-4 mx-auto max-w-xl text-sm text-muted-foreground">
          Eight precision tools built for serious Indian buyers. Live 24K rate: {" "}
          <span className="text-gold font-mono">{rate24k ? formatINR(rate24k) + "/g" : "…"}</span>
        </p>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs transition-all ${
              tab === t.id
                ? "border-gold bg-gold/15 text-gold shadow-[var(--shadow-glow-gold)]"
                : "border-border/40 text-muted-foreground hover:border-gold/40"
            }`}
          >
            <t.icon className="h-3.5 w-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-10 card-luxe p-8">
        {tab === "sip" && <SipCalc rate24k={rate24k} />}
        {tab === "loan" && <LoanCalc rate24k={rate24k} />}
        {tab === "emi" && <EmiCalc />}
        {tab === "savings" && <SavingsCalc rate24k={rate24k} />}
        {tab === "purity" && <PurityCalc rate24k={rate24k} />}
        {tab === "karat" && <KaratConverter />}
        {tab === "tola" && <TolaConverter />}
        {tab === "gst" && <GstCalc />}
      </div>
    </div>
  );
}

/* ---------- Shared ---------- */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      {children}
    </div>
  );
}
function NumIn({ v, set, step = 1, min = 0 }: { v: number; set: (n: number) => void; step?: number; min?: number }) {
  return (
    <input
      type="number" value={v} step={step} min={min}
      onChange={(e) => set(Math.max(min, Number(e.target.value) || 0))}
      className="glass w-full rounded-xl px-4 py-3 font-mono outline-none focus:border-gold/60"
    />
  );
}
function Result({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border/30 py-3 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`font-mono tabular-nums ${highlight ? "text-2xl text-gold" : "text-base"}`}>{value}</span>
    </div>
  );
}
function TwoCol({ inputs, results }: { inputs: React.ReactNode; results: React.ReactNode }) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-5">{inputs}</div>
      <div>{results}</div>
    </div>
  );
}

/* ---------- 1. Gold SIP ---------- */
function SipCalc({ rate24k }: { rate24k: number | null }) {
  const [monthly, setMonthly] = useState(5000);
  const [years, setYears] = useState(10);
  const [apprPct, setApprPct] = useState(8);
  const r = apprPct / 100 / 12;
  const n = years * 12;
  const invested = monthly * n;
  const future = r === 0 ? invested : monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const grams = rate24k ? invested / rate24k : 0;
  const futureGrams = rate24k ? future / (rate24k * Math.pow(1 + apprPct / 100, years)) : 0;
  return (
    <TwoCol
      inputs={<>
        <Field label={`Monthly investment · ${formatINR(monthly)}`}><NumIn v={monthly} set={setMonthly} step={500} /></Field>
        <Field label={`Duration · ${years} years`}><input type="range" min={1} max={30} value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full accent-[oklch(0.86_0.17_88)]" /></Field>
        <Field label={`Expected annual gold appreciation · ${apprPct}%`}><input type="range" min={0} max={20} step={0.5} value={apprPct} onChange={(e) => setApprPct(Number(e.target.value))} className="w-full accent-[oklch(0.86_0.17_88)]" /></Field>
      </>}
      results={<>
        <div className="text-xs uppercase tracking-[0.25em] text-gold">Projected corpus</div>
        <div className="mt-2 font-display text-4xl gold-shimmer tabular-nums">{formatINR(future)}</div>
        <div className="mt-6 space-y-0">
          <Result label="Total invested" value={formatINR(invested)} />
          <Result label="Wealth gained" value={formatINR(future - invested)} />
          <Result label="Grams today at start" value={`${grams.toFixed(2)} g`} />
          <Result label="Approx. grams accumulated" value={`${futureGrams.toFixed(2)} g`} />
        </div>
      </>}
    />
  );
}

/* ---------- 2. Gold Loan ---------- */
function LoanCalc({ rate24k }: { rate24k: number | null }) {
  const [grams, setGrams] = useState(20);
  const [purity, setPurity] = useState<"24K" | "22K" | "18K">("22K");
  const [ltvPct, setLtvPct] = useState(75);
  const [ratePct, setRatePct] = useState(9);
  const [months, setMonths] = useState(12);
  const goldValue = rate24k ? purityPrice(rate24k, purity) * grams : 0;
  const loanAmt = (goldValue * ltvPct) / 100;
  const r = ratePct / 100 / 12;
  const emi = r === 0 ? loanAmt / months : (loanAmt * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const totalInterest = emi * months - loanAmt;
  return (
    <TwoCol
      inputs={<>
        <Field label="Gold pledged (grams)"><NumIn v={grams} set={setGrams} step={0.5} /></Field>
        <Field label="Purity">
          <div className="grid grid-cols-3 gap-2">
            {(["24K", "22K", "18K"] as const).map((p) => (
              <button key={p} onClick={() => setPurity(p)} className={`rounded-xl border px-3 py-2 text-sm ${purity === p ? "border-gold bg-gold/15 text-gold" : "border-border/40 text-muted-foreground"}`}>{p}</button>
            ))}
          </div>
        </Field>
        <Field label={`LTV · ${ltvPct}%`}><input type="range" min={50} max={90} value={ltvPct} onChange={(e) => setLtvPct(Number(e.target.value))} className="w-full accent-[oklch(0.86_0.17_88)]" /></Field>
        <Field label={`Interest rate · ${ratePct}% p.a.`}><input type="range" min={7} max={24} step={0.25} value={ratePct} onChange={(e) => setRatePct(Number(e.target.value))} className="w-full accent-[oklch(0.86_0.17_88)]" /></Field>
        <Field label={`Tenure · ${months} months`}><input type="range" min={3} max={60} value={months} onChange={(e) => setMonths(Number(e.target.value))} className="w-full accent-[oklch(0.86_0.17_88)]" /></Field>
      </>}
      results={<>
        <div className="text-xs uppercase tracking-[0.25em] text-gold">Loan amount eligible</div>
        <div className="mt-2 font-display text-4xl gold-shimmer tabular-nums">{formatINR(loanAmt)}</div>
        <div className="mt-6 space-y-0">
          <Result label="Gold market value" value={formatINR(goldValue)} />
          <Result label="Monthly EMI" value={formatINR(emi)} highlight />
          <Result label="Total interest" value={formatINR(totalInterest)} />
          <Result label="Total payable" value={formatINR(emi * months)} />
        </div>
      </>}
    />
  );
}

/* ---------- 3. Jewellery EMI ---------- */
function EmiCalc() {
  const [principal, setPrincipal] = useState(150000);
  const [ratePct, setRatePct] = useState(14);
  const [months, setMonths] = useState(12);
  const r = ratePct / 100 / 12;
  const emi = r === 0 ? principal / months : (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  return (
    <TwoCol
      inputs={<>
        <Field label="Jewellery price"><NumIn v={principal} set={setPrincipal} step={1000} /></Field>
        <Field label={`Interest · ${ratePct}% p.a.`}><input type="range" min={0} max={30} step={0.5} value={ratePct} onChange={(e) => setRatePct(Number(e.target.value))} className="w-full accent-[oklch(0.86_0.17_88)]" /></Field>
        <Field label={`Tenure · ${months} months`}><input type="range" min={3} max={60} value={months} onChange={(e) => setMonths(Number(e.target.value))} className="w-full accent-[oklch(0.86_0.17_88)]" /></Field>
      </>}
      results={<>
        <div className="text-xs uppercase tracking-[0.25em] text-gold">Monthly EMI</div>
        <div className="mt-2 font-display text-4xl gold-shimmer tabular-nums">{formatINR(emi)}</div>
        <div className="mt-6 space-y-0">
          <Result label="Total interest" value={formatINR(emi * months - principal)} />
          <Result label="Total payable" value={formatINR(emi * months)} />
        </div>
      </>}
    />
  );
}

/* ---------- 4. Savings Goal ---------- */
function SavingsCalc({ rate24k }: { rate24k: number | null }) {
  const [targetGrams, setTargetGrams] = useState(50);
  const [months, setMonths] = useState(24);
  const perGram = rate24k ?? 0;
  const target = perGram * targetGrams;
  const monthly = target / months;
  return (
    <TwoCol
      inputs={<>
        <Field label="Target (grams of 24K)"><NumIn v={targetGrams} set={setTargetGrams} step={1} /></Field>
        <Field label={`Save over · ${months} months`}><input type="range" min={3} max={120} value={months} onChange={(e) => setMonths(Number(e.target.value))} className="w-full accent-[oklch(0.86_0.17_88)]" /></Field>
      </>}
      results={<>
        <div className="text-xs uppercase tracking-[0.25em] text-gold">Save every month</div>
        <div className="mt-2 font-display text-4xl gold-shimmer tabular-nums">{formatINR(monthly)}</div>
        <div className="mt-6 space-y-0">
          <Result label="Target value at today's rate" value={formatINR(target)} />
          <Result label="Rate used" value={perGram ? formatINR(perGram) + "/g" : "…"} />
        </div>
      </>}
    />
  );
}

/* ---------- 5. Purity Value ---------- */
function PurityCalc({ rate24k }: { rate24k: number | null }) {
  const [grams, setGrams] = useState(10);
  return (
    <TwoCol
      inputs={<Field label="Weight (grams)"><NumIn v={grams} set={setGrams} step={0.1} /></Field>}
      results={<>
        <div className="text-xs uppercase tracking-[0.25em] text-gold">Metal value by purity</div>
        <div className="mt-4 space-y-0">
          {(["24K", "22K", "18K", "14K"] as const).map((p) => (
            <Result key={p} label={`${p} gold`} value={rate24k ? formatINR(purityPrice(rate24k, p) * grams) : "…"} />
          ))}
        </div>
      </>}
    />
  );
}

/* ---------- 6. Karat Converter ---------- */
function KaratConverter() {
  const [karat, setKarat] = useState(22);
  const purity = (karat / 24) * 100;
  return (
    <TwoCol
      inputs={<Field label={`Karat · ${karat}K`}><input type="range" min={8} max={24} value={karat} onChange={(e) => setKarat(Number(e.target.value))} className="w-full accent-[oklch(0.86_0.17_88)]" /></Field>}
      results={<>
        <div className="text-xs uppercase tracking-[0.25em] text-gold">Purity</div>
        <div className="mt-2 font-display text-4xl gold-shimmer tabular-nums">{purity.toFixed(2)}%</div>
        <div className="mt-6 space-y-0">
          <Result label="Fineness (parts per 1000)" value={((karat / 24) * 1000).toFixed(0)} />
          <Result label="Hallmark grade" value={karat === 22 ? "916" : karat === 18 ? "750" : karat === 14 ? "585" : karat === 24 ? "999" : "—"} />
        </div>
      </>}
    />
  );
}

/* ---------- 7. Tola Converter ---------- */
function TolaConverter() {
  const [mode, setMode] = useState<"tola" | "gram">("tola");
  const [v, setV] = useState(1);
  const TOLA = 11.6638;
  const grams = mode === "tola" ? v * TOLA : v;
  const tolas = mode === "gram" ? v / TOLA : v;
  return (
    <TwoCol
      inputs={<>
        <Field label="Convert from">
          <div className="grid grid-cols-2 gap-2">
            {(["tola", "gram"] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)} className={`rounded-xl border px-3 py-2 text-sm capitalize ${mode === m ? "border-gold bg-gold/15 text-gold" : "border-border/40 text-muted-foreground"}`}>{m}</button>
            ))}
          </div>
        </Field>
        <Field label="Value"><NumIn v={v} set={setV} step={0.01} /></Field>
      </>}
      results={<>
        <div className="text-xs uppercase tracking-[0.25em] text-gold">Result</div>
        <div className="mt-4 space-y-0">
          <Result label="In grams" value={`${grams.toFixed(4)} g`} highlight />
          <Result label="In tolas" value={`${tolas.toFixed(4)} tola`} />
          <Result label="In ounces (troy)" value={`${(grams / 31.1035).toFixed(4)} oz`} />
        </div>
      </>}
    />
  );
}

/* ---------- 8. GST Calculator ---------- */
function GstCalc() {
  const [subtotal, setSubtotal] = useState(100000);
  const gst = subtotal * 0.03;
  return (
    <TwoCol
      inputs={<Field label="Gold + making charge subtotal"><NumIn v={subtotal} set={setSubtotal} step={1000} /></Field>}
      results={<>
        <div className="text-xs uppercase tracking-[0.25em] text-gold">Total with GST</div>
        <div className="mt-2 font-display text-4xl gold-shimmer tabular-nums">{formatINR(subtotal + gst)}</div>
        <div className="mt-6 space-y-0">
          <Result label="GST @ 3%" value={formatINR(gst)} />
          <Result label="Break-up" value="1.5% CGST + 1.5% SGST" />
        </div>
      </>}
    />
  );
}
