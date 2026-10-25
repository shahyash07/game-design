import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useProgress, today, skillRating, setMixPool, type Skill, type GameId } from "@/lib/progress";
import { SKILLS, GAMES } from "@/lib/games";
import { GAME_ICONS } from "@/lib/game-icons";
import { MIN_MIX, nextMystery, validMix } from "@/lib/mix";
import { play } from "@/lib/sound";

export const Route = createFileRoute("/mix")({
  head: () => ({
    meta: [
      { title: "Surprise Mix — StaySmart" },
      { name: "description", content: "Pick ten or more games and get dealt a hidden one each round." },
      { property: "og:title", content: "Surprise Mix — StaySmart" },
      { property: "og:description", content: "A surprise deck of logic, math, data and AI-judgment games." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Mix,
});

function Mix() {
  const { attempts, ready, mixPool } = useProgress();
  const [editing, setEditing] = useState(false);
  if (!ready) return <div className="h-96" />;
  if (!validMix(mixPool) || editing) return <MixPicker initial={mixPool ?? []} onDone={() => setEditing(false)} firstTime={!validMix(mixPool)} />;
  return <Deal pool={mixPool} attempts={attempts} onEdit={() => setEditing(true)} />;
}

function MixPicker({ initial, onDone, firstTime }: { initial: GameId[]; onDone: () => void; firstTime: boolean }) {
  const [sel, setSel] = useState<Set<GameId>>(new Set(initial));
  const toggle = (id: GameId) => { play("tap"); setSel((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; }); };
  const ok = sel.size >= MIN_MIX;
  return (
    <div className="space-y-8 pb-24">
      <section className="space-y-4">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">{firstTime ? "Welcome to StaySmart" : "Edit your mix"}</p>
        <h1 className="text-5xl sm:text-7xl font-black leading-[0.9]">Build your<br /><span className="text-gradient italic">mystery deck.</span></h1>
        <p className="text-muted-foreground max-w-lg text-lg">Pick at least {MIN_MIX} games. We'll shuffle them and deal one at a time — you never know what's coming next, so your brain stays on its toes.</p>
        {firstTime && (
          <ol className="grid sm:grid-cols-3 gap-3 pt-2">
            {[["01", "Pick 10+ games", "Your personal deck."], ["02", "Get dealt a surprise", "A hidden game, every round."], ["03", "Climb the board", "Daily ranks for every game."]].map(([n, t, d]) => (
              <li key={n} className="card-block p-4"><div className="font-mono text-xs text-primary">{n}</div><div className="font-semibold">{t}</div><div className="text-sm text-muted-foreground">{d}</div></li>
            ))}
          </ol>
        )}
      </section>
      <div className="flex items-center justify-between">
        <span className="font-mono text-sm">{sel.size} selected</span>
        <button className="text-sm underline text-muted-foreground" onClick={() => setSel(new Set(sel.size === GAMES.length ? [] : GAMES.map((g) => g.id)))}>{sel.size === GAMES.length ? "Clear" : "Select all"}</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {GAMES.map((g) => {
          const on = sel.has(g.id);
          const Icon = GAME_ICONS[g.id];
          return (
            <button key={g.id} onClick={() => toggle(g.id)} aria-pressed={on}
              className={`relative text-left rounded-2xl p-4 border transition-all duration-200 ${on ? "border-primary bg-primary/10 shadow-[var(--shadow-glow)] -translate-y-0.5" : "border-border bg-card/60 hover:border-primary/40"}`}>
              <span className={`absolute top-3 right-3 size-5 rounded-full border grid place-items-center text-xs ${on ? "bg-primary text-primary-foreground border-primary" : "border-border"}`}>{on ? "✓" : ""}</span>
              <Icon className={`size-6 mb-3 ${on ? "text-primary" : "text-muted-foreground"}`} />
              <div className="font-semibold leading-tight">{g.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{SKILLS[g.skill].label}</div>
            </button>
          );
        })}
      </div>
      <div className="fixed bottom-20 sm:bottom-6 inset-x-0 z-30 px-4">
        <div className="max-w-3xl mx-auto">
          <button disabled={!ok} onClick={() => { setMixPool([...sel]); onDone(); }} className="btn-block btn-glow w-full py-4 text-lg">
            {ok ? "Lock in my deck →" : `Pick ${MIN_MIX - sel.size} more`}
          </button>
        </div>
      </div>
    </div>
  );
}

function Deal({ pool, attempts, onEdit }: { pool: GameId[]; attempts: ReturnType<typeof useProgress>["attempts"]; onEdit: () => void }) {
  const navigate = useNavigate();
  const [dealing, setDealing] = useState(false);
  const [label, setLabel] = useState("");
  const playedToday = attempts.filter((a) => a.date === today()).length;
  const dateLabel = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  useEffect(() => {
    if (!dealing) return;
    const names = pool.map((id) => GAMES.find((g) => g.id === id)?.name ?? "");
    let i = 0;
    const t = setInterval(() => { setLabel(names[i++ % names.length] ?? ""); play("tap"); }, 90);
    return () => clearInterval(t);
  }, [dealing, pool]);

  function deal() {
    setDealing(true);
    const id = nextMystery(pool, attempts.map((a) => a.game));
    setTimeout(() => void navigate({ to: "/play/$gameId", params: { gameId: id }, search: { mix: true } }), 1100);
  }

  return (
    <div className="space-y-10">
      <section className="space-y-3 text-center sm:text-left">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">{dateLabel}</p>
        <h1 className="text-5xl sm:text-7xl font-black leading-[0.9]">Think first.<br /><span className="text-gradient italic">Then</span> ask the machine.</h1>
      </section>

      <section className="flex flex-col items-center gap-6 py-4">
        <div className="relative [perspective:1000px]">
          <div className="absolute inset-0 translate-x-4 translate-y-3 rotate-6 rounded-[2rem] border border-border bg-card/50" />
          <div className="absolute inset-0 -translate-x-4 translate-y-2 -rotate-6 rounded-[2rem] border border-border bg-card/50" />
          <button onClick={deal} disabled={dealing} aria-label="Deal my next mystery game"
            className={`relative w-64 h-80 rounded-[2rem] border border-primary/40 bg-card grid place-items-center overflow-hidden shadow-[var(--shadow-glow)] transition-transform hover:-translate-y-1 ${dealing ? "animate-shuffle" : "animate-float"}`}>
            <div className="absolute inset-0 opacity-60" style={{ background: "var(--gradient-hero)" }} />
            <div className="relative text-center px-4">
              <div className="font-display text-9xl font-black text-gradient leading-none">?</div>
              <div className="mt-4 font-mono text-xs uppercase tracking-widest text-muted-foreground h-4">{dealing ? label : "Tap to deal"}</div>
            </div>
          </button>
        </div>
        <button onClick={deal} disabled={dealing} className="btn-block btn-glow px-10 py-4 text-lg">{dealing ? "Shuffling…" : playedToday ? "Deal the next one →" : "Deal my first game →"}</button>
        <p className="text-sm text-muted-foreground">{pool.length} games in your deck · {playedToday} played today · <button onClick={onEdit} className="underline">edit deck</button></p>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.keys(SKILLS) as Skill[]).map((s) => {
          const v = skillRating(attempts, s);
          return (
            <div key={s} className="card-block p-4">
              <div className="text-xs text-muted-foreground">{SKILLS[s].label}</div>
              <div className="font-mono text-3xl font-bold">{v}</div>
              <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden"><div className={`h-full ${SKILLS[s].color}`} style={{ width: `${v}%` }} /></div>
            </div>
          );
        })}
      </section>

      <div className="grid sm:grid-cols-2 gap-3">
        <Link to="/leaderboard" className="btn-block bg-card p-4 text-center">🏆 Today's leaderboard</Link>
        <Link to="/play" className="btn-block bg-card p-4 text-center">Pick a specific game →</Link>
      </div>
    </div>
  );
}
