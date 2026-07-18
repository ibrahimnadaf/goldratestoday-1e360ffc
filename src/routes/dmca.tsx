import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dmca")({
  head: () => ({ meta: [{ title: "DMCA Policy — GoldRatesToday.in" }] }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 md:px-8 py-16">
      <h1 className="font-display text-4xl md:text-5xl gold-shimmer">DMCA Policy</h1>
      <div className="mt-8 space-y-4 text-muted-foreground">
        <p>GoldRatesToday.in respects intellectual property rights. If you believe content on this site infringes your copyright, please email dmca@goldratestoday.in with the URL, a description of the work, and your contact details.</p>
        <p>Valid notices will be actioned promptly per the DMCA safe-harbour process.</p>
      </div>
    </div>
  ),
});
