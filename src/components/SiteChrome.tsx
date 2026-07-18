import { Link } from "@tanstack/react-router";
import { Coins } from "lucide-react";

export function SiteHeader() {
  const nav = [
    { to: "/", label: "Home" },
    { to: "/prices", label: "Live Prices" },
    { to: "/calculator", label: "Calculator" },
    { to: "/about", label: "About" },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 backdrop-blur-xl bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-gold)] text-primary-foreground shadow-[var(--shadow-glow-gold)]">
            <Coins className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg text-gold">GoldRatesToday</span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">.in · live bullion</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground bg-white/5" }}
              activeOptions={{ exact: true }}>
              {n.label}
            </Link>
          ))}
        </nav>

        <Link to="/prices" className="btn-gold hidden text-sm md:inline-flex">
          View Live Rates
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-border/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-8">
        <div>
          <div className="font-display text-xl text-gold">GoldRatesToday.in</div>
          <p className="mt-3 text-sm text-muted-foreground">
            India's most trusted destination for live gold and silver prices, calculators,
            and market insight — updated every minute.
          </p>
        </div>
        <FooterCol title="Market" links={[["Live Prices","/prices"],["Gold Calculator","/calculator"]]} />
        <FooterCol title="Cities" links={[["Mumbai","/city/mumbai"],["Delhi","/city/delhi"],["Bangalore","/city/bangalore"],["Chennai","/city/chennai"]]} />
        <FooterCol title="Info"   links={[ ["About", "/about"], ["Contact", "/contact"], ["Privacy Policy", "/privacy"], ["Disclaimer", "/disclaimer"], ["Terms & Conditions", "/terms"],
  ]}
/>
      <div className="divider-gold" />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground md:flex-row md:px-8">
        <span>© {new Date().getFullYear()} GoldRatesToday.in — Rates indicative; verify with your jeweller.</span>
        <span className="font-mono">Powered by gold-api.com · LBMA reference</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="mb-3 text-xs uppercase tracking-[0.25em] text-gold">{title}</div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link to={href} className="hover:text-foreground">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
