import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchMetal, formatINR, purityPrice } from "@/lib/prices";
import { getCity, CITIES } from "@/lib/cities";
import { ArrowLeft, MapPin } from "lucide-react";

export const Route = createFileRoute("/city/$city")({
  loader: ({ params }) => {
    const city = getCity(params.city);
    if (!city) throw notFound();
    return { city };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "City not found" }, { name: "robots", content: "noindex" }] };
    }
    const c = loaderData.city;
    const title = `Gold Rate in ${c.name} Today — Live 24K & 22K Prices`;
    const description = `Live 24K and 22K gold rate in ${c.name}, ${c.state}. Updated every minute with silver, calculators and buyer guide.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `/city/${c.slug}` },
      ],
      links: [{ rel: "canonical", href: `/city/${c.slug}` }],
    };
  },
  component: CityPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-4xl">City not found</h1>
      <p className="mt-3 text-muted-foreground">We don't have this city yet.</p>
      <Link to="/" className="btn-gold mt-6 inline-flex text-sm">Go home</Link>
    </div>
  ),
});

function CityPage() {
  const { city } = Route.useLoaderData();
  const [base, setBase] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const g = await fetchMetal("XAU");
        if (alive) setBase(g.inrPerGram);
      } catch {}
    }
    load();
    const id = setInterval(load, 60_000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  const local24 = base ? base * (1 + city.premiumPct / 100) : null;

  const others = CITIES.filter((c) => c.slug !== city.slug).slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:px-8 md:py-20">
      <Link to="/" className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-gold">
        <ArrowLeft className="h-3.5 w-3.5" /> All cities
      </Link>

      <div className="mt-6 flex items-center gap-2 text-gold">
        <MapPin className="h-4 w-4" />
        <span className="text-xs uppercase tracking-[0.25em]">{city.state}</span>
      </div>
      <h1 className="mt-3 font-display text-5xl md:text-7xl">
        Gold Rate in <span className="gold-shimmer">{city.name}</span>
      </h1>
      <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
        Live 24K and 22K gold prices in {city.name}, updated every minute. Rates reflect a local premium of{" "}
        {city.premiumPct >= 0 ? "+" : ""}{city.premiumPct}% over the national reference.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <PriceCard label={`${city.name} · 24K`} value={local24} />
        <PriceCard label={`${city.name} · 22K`} value={local24 ? local24 * (22 / 24) : null} />
        <PriceCard label={`${city.name} · 18K`} value={local24 ? local24 * (18 / 24) : null} />
      </div>

      <section className="mt-16 grid gap-6 md:grid-cols-2">
        <div className="card-luxe p-8">
          <h2 className="font-display text-2xl text-gold">Buying gold in {city.name}</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {city.name} follows the national spot reference with a small local premium driven by import duty,
            transportation, and jeweller margins. Always check the BIS hallmark and ask for a detailed invoice
            with metal value, making charge and 3% GST itemised separately.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
            <li>• Confirm purity via the BIS 6-digit HUID.</li>
            <li>• Compare making charges — they can range from 3% to 25%.</li>
            <li>• Ask about buy-back rate before purchase.</li>
          </ul>
        </div>

        <div className="card-luxe p-8">
          <h2 className="font-display text-2xl text-gold">Weekly outlook</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Global gold prices continue to reflect central bank buying and USD/INR movements. Retail buyers in{" "}
            {city.name} typically see calmer local movement in mid-week — festival demand can drive short-term premiums up.
          </p>
          <Link to="/calculator" className="btn-ghost-gold mt-6 inline-flex text-sm">
            Estimate your purchase →
          </Link>
        </div>
      </section>

      <section className="mt-16">
        <div className="text-xs uppercase tracking-[0.25em] text-gold">Other cities</div>
        <h2 className="mt-2 font-display text-3xl">Compare across India</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {others.map((c) => (
            <Link
              key={c.slug} to="/city/$city" params={{ city: c.slug }}
              className="glass rounded-2xl p-4 transition-all hover:border-gold/40 hover:-translate-y-0.5"
            >
              <div className="text-[10px] uppercase tracking-[0.2em] text-gold">{c.state}</div>
              <div className="mt-2 font-display text-lg">{c.name}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function PriceCard({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="card-luxe p-6">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="mt-3 font-display text-4xl gold-shimmer tabular-nums">
        {value !== null ? formatINR(value) : "…"}
      </div>
      <div className="mt-1 text-[11px] text-muted-foreground font-mono">per gram · INR · live</div>
    </div>
  );
}
