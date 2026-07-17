import { useEffect, useRef, useState } from "react";
import { fetchMetal, formatINR, type MetalPrice } from "@/lib/prices";

type Props = {
  symbol: MetalPrice["symbol"];
  label?: string;
  refreshMs?: number;
  className?: string;
  compact?: boolean;
};

/** Live-updating price card. Polls the free gold-api every N ms and animates changes. */
export function LivePrice({ symbol, label, refreshMs = 60_000, className, compact }: Props) {
  const [data, setData] = useState<MetalPrice | null>(null);
  const [prev, setPrev] = useState<number | null>(null);
  const [err, setErr] = useState(false);
  const [pulse, setPulse] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    async function tick() {
      try {
        const next = await fetchMetal(symbol);
        if (!mounted) return;
        setData((cur) => {
          if (cur) setPrev(cur.inrPerGram);
          setPulse(true);
          window.setTimeout(() => setPulse(false), 800);
          return next;
        });
        setErr(false);
      } catch {
        if (mounted) setErr(true);
      }
    }
    tick();
    timer.current = window.setInterval(tick, refreshMs);
    return () => { mounted = false; window.clearInterval(timer.current); };
  }, [symbol, refreshMs]);

  const delta = data && prev ? data.inrPerGram - prev : 0;
  const up = delta >= 0;

  return (
    <div
      className={`card-luxe p-6 transition-shadow duration-500 ${pulse ? "shadow-[0_0_50px_oklch(0.86_0.17_88_/_0.4)]" : ""} ${className ?? ""}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {label ?? data?.name ?? symbol}
          </div>
          {!compact && (
            <div className="mt-1 text-[10px] text-muted-foreground/70 font-mono">
              {symbol} · per gram · INR
            </div>
          )}
        </div>
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald" />
        </span>
      </div>

      <div className="mt-4 font-display text-4xl md:text-5xl gold-shimmer tabular-nums">
        {data ? formatINR(data.inrPerGram, 0) : err ? "—" : "…"}
      </div>

      {!compact && data && (
        <div className="mt-3 flex items-center gap-3 text-sm">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-xs ${
              up ? "bg-emerald/10 text-emerald" : "bg-danger/10 text-danger"
            }`}
          >
            {up ? "▲" : "▼"} {prev ? formatINR(Math.abs(delta), 0) : "live"}
          </span>
          <span className="text-muted-foreground text-xs">
            ${data.usdPerOz.toFixed(2)}/oz · updated {new Date(data.updatedAt).toLocaleTimeString("en-IN")}
          </span>
        </div>
      )}
    </div>
  );
}
