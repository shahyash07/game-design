import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import "@lovable.dev/cloud-auth-js/styles.css";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — StaySmart" },
      { name: "description", content: "Sign in to StaySmart to join daily leaderboards and keep your profile." },
      { property: "og:title", content: "Sign in — StaySmart" },
      { property: "og:description", content: "Join the daily StaySmart leaderboards." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => { if (user) void navigate({ to: "/profile", replace: true }); }, [user, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "up") {
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin, data: { display_name: name || email.split("@")[0] } } });
        if (error) throw error;
        setSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally { setBusy(false); }
  }

  async function social(p: "google" | "lovable") {
    const r = await lovable.auth.signInWithOAuth(p, { redirect_uri: window.location.origin });
    if (r.error) toast.error(r.error.message ?? "Sign-in failed");
  }

  if (sent) return (
    <div className="card-block p-8 max-w-md mx-auto text-center space-y-3 animate-pop">
      <div className="text-5xl">📬</div>
      <h1 className="text-3xl font-black">Check your inbox</h1>
      <p className="text-muted-foreground">We sent a confirmation link to <b className="text-foreground">{email}</b>. Open it to finish creating your account.</p>
    </div>
  );

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black">{mode === "in" ? "Welcome back" : "Join the gym"}</h1>
        <p className="text-muted-foreground">Climb the daily leaderboards and keep your badges.</p>
      </div>
      <div className="card-block p-6 space-y-4">
        <Button variant="outline" className="w-full h-11" onClick={() => social("google")}>Continue with Google</Button>
        <button type="button" className="lovable-auth-button w-full" onClick={() => social("lovable")}>Continue with Lovable</button>
        <div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or email<span className="h-px flex-1 bg-border" /></div>
        <form onSubmit={submit} className="space-y-3">
          {mode === "up" && <Input placeholder="Display name" value={name} maxLength={30} onChange={(e) => setName(e.target.value)} />}
          <Input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" required minLength={6} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button disabled={busy} className="btn-block btn-glow w-full py-3">{busy ? "…" : mode === "in" ? "Sign in" : "Create account"}</button>
        </form>
        <button className="text-sm text-muted-foreground underline w-full" onClick={() => setMode(mode === "in" ? "up" : "in")}>
          {mode === "in" ? "New here? Create an account" : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
