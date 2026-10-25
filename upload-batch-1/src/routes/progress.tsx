import { createFileRoute } from "@tanstack/react-router";
import { useProgress, skillRating, streak, today, consistency, type Skill } from "@/lib/progress";
import { SKILLS, gameById } from "@/lib/games";
import { brier, callsSince, confidentCalls } from "@/lib/calibration";
import { at } from "@/lib/at";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Your progress — StaySmart" },
      { name: "description", content: "Streaks, skill ratings and your weekly reasoning report." },
      { property: "og:title", content: "Your progress — StaySmart" },
      { property: "og:description", content: "Track calculation, logic, data and AI-judgment skills over time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Progress,
});

function Progress() {
  const { attempts, ready } = useProgress();
  if (!ready) return <div className="h-64" />;
  const days = [...Array(28)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() - (27 - i)); return today(d); });
  const perDay = new Map<string, number>(); attempts.forEach((a) => perDay.set(a.date, (perDay.get(a.date) ?? 0) + 1));
  const week = attempts.filter((a) => days.slice(-7).includes(a.date));
  const thinkFirst = week.length ? Math.round((week.filter((a) => !a.hintUsed).length / week.length) * 100) : 0;
  const avgAcc = week.length ? Math.round((week.reduce((s, a) => s + a.accuracy, 0) / week.length) * 100) : 0;
  const calls = callsSince(attempts, at(days, days.length - 7));
  const sure = confidentCalls(calls);
  const brierScore = brier(calls);

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black">Progress</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[["Streak", `${streak(attempts)}d`], ["Games", attempts.length], ["This week", week.length], ["28 days", `${Math.round(consistency(attempts) * 100)}%`]].map(([l, v]) => (
          <div key={l} className="card-block p-4"><div className="text-xs text-muted-foreground">{l}</div><div className="font-mono text-3xl font-bold">{v}</div></div>
        ))}
      </div>

      <section className="card-block p-5 space-y-3">
        <h2 className="text-xl font-bold">Last 28 days</h2>
        <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5">
          {days.map((d) => { const n = perDay.get(d) ?? 0; return (
            <div key={d} title={`${d}: ${n} games`} className={`aspect-square rounded border border-ink ${n === 0 ? "bg-muted" : n < 3 ? "bg-accent" : "bg-primary"}`} />
          ); })}
        </div>
      </section>

      <section className="card-block p-5 space-y-4">
        <h2 className="text-xl font-bold">Skills</h2>
        {(Object.keys(SKILLS) as Skill[]).map((s) => { const v = skillRating(attempts, s); return (
          <div key={s}>
            <div className="flex justify-between text-sm"><span>{SKILLS[s].label}</span><span className="font-mono">{v}</span></div>
            <div className="h-3 bg-muted rounded-full border border-ink overflow-hidden"><div className={`h-full ${SKILLS[s].color}`} style={{ width: `${v}%` }} /></div>
          </div>
        ); })}
      </section>

      <section className="card-block p-5 space-y-2 bg-paper">
        <h2 className="text-xl font-bold">Weekly reasoning report</h2>
        {week.length === 0 ? <p className="text-sm text-muted-foreground">Play a game this week to see your report.</p> : (
          <ul className="text-sm space-y-1">
            <li>You played <b>{week.length}</b> games with <b>{avgAcc}%</b> average accuracy.</li>
            <li>You solved <b>{thinkFirst}%</b> without any hint — your think-first rate.</li>
            {calls.length > 0 && <li>Confident calls (80%+): <b>{sure.right}</b> right, <b>{sure.wrong}</b> wrong{brierScore !== null && <> · calibration <b>{brierScore.toFixed(2)}</b> (lower is better)</>}.</li>}
            <li>Focus next: <b>{SKILLS[(Object.keys(SKILLS) as Skill[]).sort((a, b) => skillRating(attempts, a) - skillRating(attempts, b)).at(0) ?? "math"].label}</b>.</li>
          </ul>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-bold">History</h2>
        {attempts.length === 0 && <p className="text-sm text-muted-foreground">No games yet.</p>}
        {[...attempts].reverse().slice(0, 15).map((a) => (
          <div key={a.at} className="flex items-center gap-3 border-b border-border py-2 text-sm">
            <span className={`size-2.5 rounded-full ${SKILLS[a.skill].color}`} />
            <span className="font-medium">{gameById(a.game)?.name}</span>
            <span className="text-muted-foreground truncate">{a.raw}</span>
            <span className="ml-auto font-mono">{a.score}</span>
          </div>
        ))}
      </section>
      <p className="text-xs text-muted-foreground">Progress is saved on this device. StaySmart is practice, not a medical or IQ tool.</p>
    </div>
  );
}
