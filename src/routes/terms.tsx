import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms & Conditions — GoldRatesToday.in" }] }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 md:px-8 py-16">
      <h1 className="font-display text-4xl md:text-5xl gold-shimmer">Terms & Conditions</h1>
      <div className="mt-8 space-y-4 text-muted-foreground">
        <p>By using GoldRatesToday.in you agree to use the site solely for personal, non-commercial informational purposes.</p>
        <p>Prices are indicative and may not reflect actual retail rates. We disclaim liability for any decision made based on data shown here.</p>
        <p>All content, branding and design are the property of GoldRatesToday.in. Unauthorized reproduction is prohibited.</p>
      </div>
    </div>
  ),
});
