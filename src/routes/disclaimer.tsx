import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/disclaimer")({
  component: Disclaimer,
});

function Disclaimer() {
  return (
    <main className="container mx-auto py-10">
      <h1>Disclaimer</h1>
      <p>Your disclaimer content goes here.</p>
    </main>
  );
}
