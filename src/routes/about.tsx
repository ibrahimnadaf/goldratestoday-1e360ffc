import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8 py-16">
      <h1 className="font-display text-5xl gold-shimmer">
        About GoldRatesToday.in
      </h1>

      <p className="mt-6 text-muted-foreground text-lg">
        GoldRatesToday.in provides live gold and silver prices,
        city-wise rates, calculators, and market insights for India
        and global markets.
      </p>
    </div>
  );
}
