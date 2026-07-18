import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cookies")({
  head: () => ({ meta: [{ title: "Cookie Policy — GoldRatesToday.in" }] }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 md:px-8 py-16">
      <h1 className="font-display text-4xl md:text-5xl gold-shimmer">Cookie Policy</h1>
      <div className="mt-8 space-y-4 text-muted-foreground">
        <p>We use minimal first-party cookies for essential functionality (theme, preferences) and anonymous analytics.</p>
        <p>Third-party ad and analytics providers may set their own cookies. You can control cookies via your browser settings.</p>
      </div>
    </div>
  ),
});
