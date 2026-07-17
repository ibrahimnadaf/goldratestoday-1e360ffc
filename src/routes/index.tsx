import { createFileRoute, Link } from "@tanstack/react-router";
import { LivePrice } from "@/components/LivePrice";
import { CITIES } from "@/lib/cities";
import { ArrowRight, Bell, Calculator, LineChart, MapPin, Newspaper, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GoldRatesToday.in — Live Gold & Silver Prices in India" },
      { name: "description", content: "Live 24K, 22K & 18K gold prices, silver rates, city-wise data, and premium calculators — updated every minute." },
      { property: "og:title", content: "GoldRatesToday.in — Live Gold & Silver Prices in India" },
      { property: "og:description", content: "Live 24K, 22K & 18K gold prices, silver rates, city-wise data, and premium calculators — updated every minute." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <Hero />
      <LivePricesStrip />
      <MarketNarrative />
      <CityGrid />
      <ToolsGrid />
      <NewsletterCTA />
    </div>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  return (
    <section className="relative pt-14 md:pt-20">
      {/* radial gold glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 blur-3xl"
        style={{ background: "radial-gradient(closest-side, oklch(0.86 0.17 88 / 0.25), transparent 70%)" }}
      />
      {/* floating particles */}
      <FloatingParticles />

      <div className="flex flex-col items-center text-center">
        <span className="glass-gold inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.25em]">
          <Sparkles className="h-3.5 w-3.5 text-gold" />
          <span className="text-gold">India's premium gold intelligence</span>
        </span>

        <h1 className="mt-6 font-display text-5xl leading-[1.05] md:text-7xl">
          <span className="text-foreground">Live Gold Prices,</span>
          <br />
          <span className="gold-shimmer">Refined for India.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
          Real-time 24K, 22K & 18K gold, silver, platinum and palladium — with
          city-wise rates, calculators, and market insight tuned for Indian buyers.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/prices" className="btn-gold inline-flex items-center gap-2 text-sm">
            Live rates <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/calculator" className="btn-ghost-gold inline-flex items-center gap-2 text-sm">
            <Calculator className="h-4 w-4" /> Gold calculator
          </Link>
        </div>

        <div className="mt-10 grid w-full max-w-4xl grid-cols-3 gap-4 text-left md:gap-6">
          <TrustStat k="60s" v="Refresh interval" />
          <TrustStat k="LBMA" v="Reference source" />
          <TrustStat k="Free" v="No login required" />
        </div>
      </div>
    </section>
  );
}

function TrustStat({ k, v }: { k: string; v: string }) {
  return (
    <div className="glass rounded-2xl p-4 md:p-5">
      <div className="font-display text-2xl md:text-3xl text-gold">{k}</div>
      <div className="mt-1 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{v}</div>
    </div>
  );
}

function FloatingParticles() {
  const dots = Array.from({ length: 14 });
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {dots.map((_, i) => (
        <span
          key={i}
          className="absolute block h-1 w-1 rounded-full bg-gold/60"
          style={{
            top: `${(i * 37) % 100}%`,
            left: `${(i * 53) % 100}%`,
            animation: `float ${5 + (i % 5)}s ease-in-out ${i * 0.3}s infinite`,
            boxShadow: "0 0 10px oklch(0.86 0.17 88 / 0.7)",
          }}
        />
      ))}
    </div>
  );
}

/* ---------- Live Prices Strip ---------- */
function LivePricesStrip() {
  return (
    <section className="mt-20">
      <SectionTitle eyebrow="Live Market" title="Real-time bullion rates" href="/prices" cta="See all rates" />
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <LivePrice symbol="XAU" label="Gold · 24K" />
        <LivePrice symbol="XAG" label="Silver" />
        <LivePrice symbol="XPT" label="Platinum" />
        <LivePrice symbol="XPD" label="Palladium" />
      </div>
    </section>
  );
}

/* ---------- Narrative ---------- */
function MarketNarrative() {
  return (
    <section className="mt-24 grid gap-6 md:grid-cols-3">
      <NarrativeCard
        icon={<LineChart className="h-5 w-5" />}
        title="Institutional data"
        body="Rates sourced from LBMA & COMEX-style feeds, normalised to INR per gram."
      />
      <NarrativeCard
        icon={<ShieldCheck className="h-5 w-5" />}
        title="Transparent by design"
        body="No login, no dark patterns. Every figure shows its source and timestamp."
      />
      <NarrativeCard
        icon={<Bell className="h-5 w-5" />}
        title="Alerts, not noise"
        body="Set threshold alerts (coming soon). We ping only when it actually matters."
      />
    </section>
  );
}

function NarrativeCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="card-luxe p-7">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-gold/10 text-gold">{icon}</div>
      <h3 className="mt-5 font-display text-xl">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

/* ---------- Cities ---------- */
function CityGrid() {
  return (
    <section className="mt-24">
      <SectionTitle eyebrow="City Explorer" title="Gold rates across India" />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {CITIES.map((c) => (
          <Link
            key={c.slug}
            to="/city/$city"
            params={{ city: c.slug }}
            className="glass group rounded-2xl p-4 transition-all hover:border-gold/40 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-2 text-gold">
              <MapPin className="h-3.5 w-3.5" />
              <span className="text-[10px] uppercase tracking-[0.2em]">{c.state}</span>
            </div>
            <div className="mt-2 font-display text-lg">{c.name}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {c.premiumPct >= 0 ? "+" : ""}{c.premiumPct}% premium
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ---------- Tools ---------- */
function ToolsGrid() {
  const tools = [
    { icon: Calculator, title: "Gold Price Calculator", body: "Weight × purity × live rate — with GST and making charge.", href: "/calculator" as const },
    { icon: LineChart, title: "Live Charts", body: "Candlestick and area charts, gold vs silver comparison.", href: "/prices" as const },
    { icon: Newspaper, title: "Market Insight", body: "Curated news, forecasts and festival buying advice.", href: "/prices" as const },
  ];
  return (
    <section className="mt-24">
      <SectionTitle eyebrow="Tools & Insight" title="Everything a serious buyer needs" />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {tools.map((t) => (
          <Link
            key={t.title}
            to={t.href}
            className="card-luxe group p-7 transition-transform hover:-translate-y-1"
          >
            <t.icon className="h-6 w-6 text-gold" />
            <h3 className="mt-4 font-display text-xl">{t.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
            <div className="mt-5 inline-flex items-center gap-1.5 text-xs text-gold">
              Open <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ---------- Newsletter ---------- */
function NewsletterCTA() {
  return (
    <section className="mt-24">
      <div className="card-luxe relative overflow-hidden p-10 md:p-14">
        <div
          aria-hidden
          className="absolute -right-32 -top-32 h-96 w-96 rounded-full"
          style={{ background: "var(--gradient-radial-gold)", filter: "blur(20px)" }}
        />
        <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-gold">The Daily Bullion</div>
            <h2 className="mt-3 font-display text-3xl md:text-4xl">
              One gold-market briefing, <span className="gold-shimmer">every morning at 9am.</span>
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Prices, macro, and buyer advice — free, no spam, unsubscribe anytime.
            </p>
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); alert("Newsletter coming soon — hook up Lovable Cloud to enable."); }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="glass w-full flex-1 rounded-xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-gold/60"
            />
            <button type="submit" className="btn-gold text-sm">Subscribe</button>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ---------- Shared ---------- */
function SectionTitle({ eyebrow, title, href, cta }: { eyebrow: string; title: string; href?: "/prices" | "/calculator"; cta?: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <div className="text-xs uppercase tracking-[0.25em] text-gold">{eyebrow}</div>
        <h2 className="mt-2 font-display text-3xl md:text-4xl">{title}</h2>
      </div>
      {href && cta && (
        <Link to={href} className="hidden shrink-0 items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground md:inline-flex">
          {cta} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
