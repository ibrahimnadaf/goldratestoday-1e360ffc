import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — GoldRatesToday.in" }] }),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 md:px-8 py-16">
      <h1 className="font-display text-4xl md:text-5xl gold-shimmer">Privacy Policy</h1>
      <div className="mt-8 space-y-4 text-muted-foreground">
        <p>GoldRatesToday.in respects your privacy. We collect minimal data required to operate the service, such as anonymous analytics on page views and device type.</p>
        <p>We do not sell personal information. Third-party services (analytics, ad networks) may set cookies subject to their own privacy policies.</p>
        <p>You may contact us at privacy@goldratestoday.in for any privacy-related requests.</p>
      </div>
    </div>
  ),
});
