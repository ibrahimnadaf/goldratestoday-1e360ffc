import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — GoldRatesToday.in" },
      { name: "description", content: "Sign in to save price alerts, city preferences and premium calculators." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav({ to: "/" });
    });
  }, [nav]);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Account created — check your inbox to confirm.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back.");
        nav({ to: "/" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Auth failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw new Error(result.error);
      if (result.redirected) return;
      nav({ to: "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-4 py-16">
      <div className="card-luxe w-full p-8">
        <div className="text-xs uppercase tracking-[0.25em] text-gold">Members area</div>
        <h1 className="mt-3 font-display text-3xl">
          {mode === "signin" ? "Welcome back" : "Create your vault"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Save price alerts, city preferences and premium calculators.
        </p>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="glass mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium hover:border-gold/60 disabled:opacity-50"
        >
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border/40" /> or <div className="h-px flex-1 bg-border/40" />
        </div>

        <form onSubmit={handleEmail} className="space-y-4">
          {mode === "signup" && (
            <input
              type="text" placeholder="Display name" value={name}
              onChange={(e) => setName(e.target.value)}
              className="glass w-full rounded-xl px-4 py-3 text-sm outline-none focus:border-gold/60"
            />
          )}
          <input
            type="email" required placeholder="you@example.com" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="glass w-full rounded-xl px-4 py-3 text-sm outline-none focus:border-gold/60"
          />
          <input
            type="password" required minLength={6} placeholder="Password (min 6)" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="glass w-full rounded-xl px-4 py-3 text-sm outline-none focus:border-gold/60"
          />
          <button type="submit" disabled={loading} className="btn-gold w-full text-sm disabled:opacity-50">
            {loading ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          {mode === "signin" ? "New here?" : "Have an account?"}{" "}
          <button
            className="text-gold hover:underline"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin" ? "Create account" : "Sign in"}
          </button>
        </div>
        <div className="mt-4 text-center text-xs">
          <Link to="/" className="text-muted-foreground hover:text-foreground">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
