import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useProgress, streak } from "@/lib/progress";
import { computeBadges } from "@/lib/badges";
import { soundOn, setSound } from "@/lib/sound";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — StaySmart" },
      { name: "description", content: "Your StaySmart avatar, badges and settings." },
      { property: "og:title", content: "Your profile — StaySmart" },
      { property: "og:description", content: "Badges and milestones from your mental workouts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Profile,
});

const AVATARS = ["🧠", "🦉", "🦊", "🐙", "🚀", "⚡", "🧩", "🎯", "🌙", "🔥", "🐺", "🦄"];

function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const { attempts, ready } = useProgress();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("🧠");
  const [sound, setSnd] = useState(true);
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => { setSnd(soundOn()); }, []);
  useEffect(() => { if (profile) { setName(profile.display_name); setAvatar(profile.avatar); } }, [profile]);

  async function save() {
    if (!user) return;
    const n = name.trim().slice(0, 30);
    if (!n) { toast.error("Pick a display name"); return; }
    const { error } = await supabase.from("profiles").update({ display_name: n, avatar, updated_at: new Date().toISOString() }).eq("id", user.id);
    if (error) { toast.error(error.message); return; }
    await refreshProfile();
    toast.success("Profile saved");
  }
  async function signOut() {
    await qc.cancelQueries(); qc.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  }

  const badges = ready ? computeBadges(attempts) : [];
  const earned = badges.filter((b) => b.earned).length;

  return (
    <div className="space-y-6">
      <section className="card-block p-6 flex items-center gap-5">
        <div className="size-20 rounded-3xl bg-muted grid place-items-center text-5xl animate-float">{user ? avatar : "🧠"}</div>
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-black truncate">{user ? profile?.display_name ?? "…" : "Guest player"}</h1>
          <p className="text-sm text-muted-foreground">{ready ? `${attempts.length} games · ${streak(attempts)}-day streak · ${earned}/${badges.length} badges` : "\u00a0"}</p>
        </div>
      </section>

      {user ? (
        <section className="card-block p-6 space-y-4">
          <h2 className="text-xl font-bold">Edit profile</h2>
          <Input value={name} maxLength={30} onChange={(e) => setName(e.target.value)} aria-label="Display name" />
          <div className="flex flex-wrap gap-2">
            {AVATARS.map((a) => (
              <button key={a} onClick={() => setAvatar(a)} aria-pressed={avatar === a}
                className={`size-12 rounded-xl text-2xl border transition ${avatar === a ? "border-primary bg-primary/15 scale-110" : "border-border bg-muted hover:border-primary/50"}`}>{a}</button>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={save} className="btn-block btn-glow px-5 py-2.5">Save</button>
            <button onClick={signOut} className="btn-block bg-card px-5 py-2.5">Sign out</button>
          </div>
        </section>
      ) : (
        <section className="card-block p-6 flex items-center gap-4">
          <p className="flex-1">Sign in to get a public name, avatar and a spot on the leaderboards.</p>
          <Link to="/auth" className="btn-block btn-glow px-5 py-2.5">Sign in</Link>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {badges.map((b) => (
            <div key={b.id} title={b.description} className={`card-block p-4 text-center space-y-1 ${b.earned ? "" : "opacity-40 grayscale"}`}>
              <div className="text-3xl">{b.icon}</div>
              <div className="text-sm font-semibold">{b.name}</div>
              <div className="text-xs text-muted-foreground">{b.description}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="card-block p-5 flex items-center justify-between">
        <div><div className="font-semibold">Sounds</div><div className="text-sm text-muted-foreground">Chimes when you finish a game.</div></div>
        <Switch checked={sound} onCheckedChange={(v) => { setSnd(v); setSound(v); }} aria-label="Sounds" />
      </section>
    </div>
  );
}
