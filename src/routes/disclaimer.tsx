import { createFileRoute } from "@tanstack/react-router";

function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 md:px-8 py-16">
      <h1 className="font-display text-4xl md:text-5xl gold-shimmer">{title}</h1>
      <div className="prose prose-invert mt-8 space-y-4 text-muted-foreground">{children}</div>
    </div>
  );
}

export const Route = createFileRoute("/disclaimer")({
  head: () => ({ meta: [{ title: "Disclaimer — GoldRatesToday.in" }] }),
  component: () => (
    <LegalPage title="Disclaimer">
      <p>All gold, silver, platinum and palladium prices on GoldRatesToday.in are sourced from public third-party APIs and are provided for informational purposes only.</p>
      <p>We do not guarantee the accuracy, completeness, or timeliness of the rates displayed. Actual jeweller prices may vary based on city, purity, GST, making charges and market conditions.</p>
      <p>Nothing on this website constitutes investment advice. Always consult a qualified financial advisor before making investment decisions.</p>
    </LegalPage>
  ),
});
