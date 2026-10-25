import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { GAMES } from "@/lib/games";
import { fetchBoard } from "@/lib/leaderboard";
import { useAuth } from "@/lib/auth";
import { useProgress } from "@/lib/progress";
import { BASELINE_MIN_DAYS, BASELINE_MIN_SESSIONS, checkProgress, median } from "@/lib/readiness";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Daily leaderboard — StaySmart" },
      { name: "description", content: "Your own board first; today's top StaySmart players once your baseline is built." },
      { property: "og:title", content: "Daily leaderboard — StaySmart" },
      { property: "og:description", content: "Who is sharpest today? Daily rankings for every game." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Leaderboard,
});

const MEDAL = ["🥇", "🥈", "🥉"];
const COMPARE_KEY = "staysmart.compare";

function Leaderboard() {
  const { user } = useAuth();
  const { attempts, readiness = [], ready } = useProgress();
  const [game, setGame] = useState<string>(GAMES[0]?.id ?? "2048");
  const [compare, setCompare] = useState(true);
  useEffect(() => { setCompare(localStorage.getItem(COMPARE_KEY) !== "off"); }, []);
  // Personal board first; the comparison board unlocks after five checks on three days and can be switched off.
  const prog = checkProgress(readiness);
  const showBoard = ready && prog.ready && compare;
  const { data, isLoading, error } = useQuery({ queryKey: ["board", game], queryFn: () => fetchBoard(game), refetchInterval: 30_000, enabled: showBoard });
  const mine = attempts.filter((a) => a.game === game).slice(-30);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">{showBoard ? "Resets at midnight" : "You versus you"}</p>
        <h1 className="text-5xl font-black">{showBoard ? <>Today's <span className="text-gradient italic">best minds</span></> : <>Your <span className="text-gradient italic">own board</span></>}</h1>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {GAMES.map((g) => (
          <button key={g.id} onClick={() => setGame(g.id)} aria-pressed={game === g.id}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium border transition ${game === g.id ? "btn-glow border-transparent" : "border-border bg-card/60 hover:border-primary/50"}`}>
            {g.name}
          </button>
        ))}
      </div>
      {ready && (prog.ready ? (
        <div className="card-block p-4 flex items-center justify-between gap-3">
          <div><div className="font-semibold">Compare with others</div><div className="text-sm text-muted-foreground">Daily ranks for every game. Off keeps it to your own history.</div></div>
          <Switch checked={compare} onCheckedChange={(v) => { setCompare(v); localStorage.setItem(COMPARE_KEY, v ? "on" : "off"); }} aria-label="Compare with others" />
        </div>
      ) : (
        <div className="card-block p-4 text-sm flex items-start gap-3">
          <span className="text-xl">🔒</span>
          <p>The comparison board unlocks after {BASELINE_MIN_SESSIONS} Green Light checks on {BASELINE_MIN_DAYS} different days. You're at {prog.sessions} on {prog.days}. <Link to="/check" className="underline text-primary">Run a check</Link></p>
        </div>
      ))}
      {showBoard ? (
        <>
          {!user && (
            <div className="card-block p-4 flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <p className="flex-1 text-sm">Sign in to put your scores on the board.</p>
              <Link to="/auth" className="btn-block btn-glow px-4 py-2 text-sm">Sign in</Link>
            </div>
          )}
          <div className="card-block divide-y divide-border overflow-hidden">
            {isLoading && <p className="p-6 text-muted-foreground">Loading…</p>}
            {error && <p className="p-6 text-destructive">Couldn't load the board. Try again shortly.</p>}
            {data && data.length === 0 && <p className="p-8 text-center text-muted-foreground">No scores yet today. Be the first! ⚡</p>}
            {data?.map((r, i) => (
              <div key={r.user_id} className={`flex items-center gap-4 px-5 py-3 ${r.user_id === user?.id ? "bg-primary/10" : ""}`}>
                <span className="w-8 text-center font-mono font-bold">{MEDAL[i] ?? i + 1}</span>
                <span className="text-2xl">{r.avatar}</span>
                <span className="flex-1 font-semibold truncate">{r.name}{r.user_id === user?.id && <span className="ml-2 text-xs text-primary">you</span>}</span>
                <span className="font-mono text-xs text-muted-foreground">{Math.round(r.ms / 1000)}s</span>
                <span className="font-mono text-xl font-bold w-14 text-right">{r.score}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="card-block divide-y divide-border overflow-hidden">
          {mine.length === 0 ? <p className="p-8 text-center text-muted-foreground">No rounds of this game yet. Your last 30 will show here.</p> : (
            <>
              <div className="grid grid-cols-3 text-center p-4">
                <div><div className="text-xs text-muted-foreground">Best</div><div className="font-mono text-2xl font-bold">{Math.max(...mine.map((a) => a.score))}</div></div>
                <div><div className="text-xs text-muted-foreground">Median</div><div className="font-mono text-2xl font-bold">{Math.round(median(mine.map((a) => a.score)))}</div></div>
                <div><div className="text-xs text-muted-foreground">Rounds</div><div className="font-mono text-2xl font-bold">{mine.length}</div></div>
              </div>
              {[...mine].reverse().slice(0, 10).map((a) => (
                <div key={a.at} className="flex items-center gap-4 px-5 py-3 text-sm">
                  <span className="font-mono text-xs text-muted-foreground w-24">{a.date}</span>
                  <span className="flex-1 text-muted-foreground truncate">{a.raw}</span>
                  <span className="font-mono text-xl font-bold w-14 text-right">{a.score}</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
