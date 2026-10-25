import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useProgress, today, skillRating, patchReadiness, type Skill } from "@/lib/progress";
import { SKILLS, smartSet } from "@/lib/games";
import { GAME_ICONS } from "@/lib/game-icons";
import { BASELINE_MIN_DAYS, BASELINE_MIN_SESSIONS, LIGHT_LABEL, checkProgress, pendingDecision, verdict } from "@/lib/readiness";
import { LIGHT_CLASS } from "@/components/games/GreenLight";
import { track } from "@/lib/analytics";
import { play } from "@/lib/sound";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StaySmart — Your daily mental gym" },
      { name: "description", content: "A 90-second Green Light check against your own baseline, then three short games. Think first, then ask the machine." },
      { property: "og:title", content: "StaySmart — Your daily mental gym" },
      { property: "og:description", content: "Practise calculation, logic, data reasoning and AI judgment in ten minutes a day." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Today,
});

function Today() {
  const { attempts, readiness = [], ready } = useProgress();
  useEffect(() => {
    const key = `staysmart.today.${today()}`;
    if (!localStorage.getItem(key)) { localStorage.setItem(key, "1"); track("today_started"); }
  }, []);
  if (!ready) return <div className="h-96" />;

  const date = today();
  const latest = [...readiness].reverse().find((s) => s.date === date);
  const v = latest ? verdict(latest, readiness) : null;
  const prog = checkProgress(readiness);
  const pending = pendingDecision(readiness);
  const set = smartSet(attempts);
  const doneToday = new Set(attempts.filter((a) => a.date === date).map((a) => a.game));
  const done = set.filter((g) => doneToday.has(g.id)).length;
  const dateLabel = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">{dateLabel}</p>
        <h1 className="text-5xl sm:text-6xl font-black leading-[0.9]">Think first.<br /><span className="text-gradient italic">Then</span> ask the machine.</h1>
      </section>

      {pending && (
        <section className="card-block p-5 space-y-3 border-primary/40">
          <div className="text-xs font-mono uppercase text-primary">Decision journal</div>
          <h2 className="text-xl font-bold">How did “{pending.decision}” go?</h2>
          <div className="flex gap-2" role="group" aria-label="Rate the decision">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} className="btn-block bg-card size-11 font-mono text-lg" onClick={() => { play("tap"); patchReadiness(pending.at, { rating: n }); }}>{n}</button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">1 = went badly · 5 = went well. After ten rated decisions you get your own pattern.</p>
        </section>
      )}

      <section className="card-block p-5 space-y-3">
        <div className="flex items-center justify-between"><div className="text-xs font-mono uppercase text-muted-foreground">Green Light</div><span className="text-xs font-mono text-muted-foreground">90 seconds</span></div>
        {latest && v ? (
          <>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${LIGHT_CLASS[v.light]}`}>{LIGHT_LABEL[v.light]}</span>
              <span className="font-mono text-sm">{latest.roundMs.map((ms) => `${(ms / 1000).toFixed(1)}s`).join(" · ")}</span>
            </div>
            <p className="text-sm">{v.action}</p>
            <Link to="/check" className="text-sm underline text-muted-foreground">Run it again</Link>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold">Are you in your usual range right now?</h2>
            <p className="text-sm text-muted-foreground">Three rounds of fifteen quick sums, compared with your own baseline. {prog.ready ? "Baseline ready." : `Baseline: ${prog.sessions} of ${BASELINE_MIN_SESSIONS} checks on ${prog.days} of ${BASELINE_MIN_DAYS} days.`}</p>
            <Link to="/check" className="btn-block btn-glow inline-block px-6 py-3">Run Green Light →</Link>
          </>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between"><h2 className="text-2xl font-bold">Today's SmartSet</h2><span className="font-mono text-xs text-muted-foreground">{done}/{set.length} done</span></div>
        <div className="grid sm:grid-cols-3 gap-3">
          {set.map((g) => {
            const Icon = GAME_ICONS[g.id];
            const isDone = doneToday.has(g.id);
            return (
              <Link key={g.id} to="/play/$gameId" params={{ gameId: g.id }} className={`card-block p-4 block hover:-translate-y-0.5 transition-transform ${isDone ? "opacity-60" : ""}`}>
                <div className="flex items-center gap-2 mb-2"><span className={`size-2.5 rounded-full ${SKILLS[g.skill].color}`} /><span className="text-xs font-mono uppercase text-muted-foreground">{SKILLS[g.skill].label}</span>{isDone && <span className="ml-auto text-xs">✓</span>}</div>
                <div className="flex items-center gap-2"><Icon className="size-5" /><span className="font-semibold">{g.name}</span></div>
                <p className="text-xs text-muted-foreground mt-1">~{g.minutes} min</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.keys(SKILLS) as Skill[]).map((s) => {
          const value = skillRating(attempts, s);
          return (
            <div key={s} className="card-block p-4">
              <div className="text-xs text-muted-foreground">{SKILLS[s].label}</div>
              <div className="font-mono text-3xl font-bold">{value}</div>
              <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden"><div className={`h-full ${SKILLS[s].color}`} style={{ width: `${value}%` }} /></div>
            </div>
          );
        })}
      </section>

      <div className="grid sm:grid-cols-3 gap-3">
        <Link to="/mix" className="btn-block bg-card p-4 text-center">🎲 Surprise deck</Link>
        <Link to="/leaderboard" className="btn-block bg-card p-4 text-center">🏆 Leaderboard</Link>
        <Link to="/play" className="btn-block bg-card p-4 text-center">All games →</Link>
      </div>
    </div>
  );
}
