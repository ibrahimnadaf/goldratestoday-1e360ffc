import { Link } from "@tanstack/react-router";
import { Coins } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-gold/10 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link to="/" className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-gold" />
          <span className="font-display text-lg tracking-wide">
            GoldRates<span className="text-gold">Today</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <Link to="/prices" className="hover:text-foreground">Live Prices</Link>
          <Link to="/calculator" className="hover:text-foreground">Calculator</Link>
          <Link to="/about" className="hover:text-foreground">About</Link>
          <Link to="/contact" className="hover:text-foreground">Contact</Link>
        </nav>
        <Link to="/prices" className="btn-gold text-xs">Live rates</Link>
      </div>
    </header>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.25em] text-gold">{title}</div>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        {links.map(([label, href]) => (
          <li key={href}>
            <a href={href} className="hover:text-foreground">{label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-gold/10 bg-background/60">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-gold" />
              <span className="font-display text-lg">GoldRatesToday</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              India's premium destination for live gold & silver prices, calculators and market insight.
            </p>
          </div>
          <FooterCol
            title="Market"
            links={[
              ["Live Prices", "/prices"],
              ["Gold Calculator", "/calculator"],
            ]}
          />
          <FooterCol
            title="Cities"
            links={[
              ["Mumbai", "/city/mumbai"],
              ["Delhi", "/city/delhi"],
              ["Bangalore", "/city/bangalore"],
              ["Chennai", "/city/chennai"],
            ]}
          />
          <FooterCol
            title="Info"
            links={[
              ["About", "/about"],
              ["Contact", "/contact"],
              ["Privacy Policy", "/privacy"],
              ["Disclaimer", "/disclaimer"],
              ["Terms & Conditions", "/terms"],
            ]}
          />
        </div>
        <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} GoldRatesToday.in — All rights reserved.</div>
          <div>Rates for informational purposes only. Not investment advice.</div>
        </div>
      </div>
    </footer>
  );
}
