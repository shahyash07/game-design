import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { gameById, smartSet, SKILLS } from "@/lib/games";
import { recordAttempt, useProgress, difficulty, selectLevel, today, load, type GameId } from "@/lib/progress";
import { HOW_TO } from "@/lib/howto";
import { useAuth } from "@/lib/auth";
import { personalBest } from "@/lib/badges";
import { celebrate } from "@/lib/sound";
import { submitDailyScore, fetchMyRank } from "@/lib/leaderboard";
import { nextMystery, validMix } from "@/lib/mix";
import { brier, confidentCalls } from "@/lib/calibration";
import { track } from "@/lib/analytics";
import { MathGame } from "@/components/games/MathGame";
import { Game2048 } from "@/components/games/Game2048";
import { McqGame } from "@/components/games/McqGame";
import { QueensGame, TangoGame } from "@/components/games/GridGames";
import type { GameResult } from "@/components/games/types";
import { DEDUCE, DATA, AICHECK } from "@/lib/content";
import { PathGame, CategoryGame, LadderGame, MiniSudokuGame, PatchworkGame, WordTrailsGame } from "@/components/games/MoreGames";
import { Button } from "@/components/ui/button";
import { LevelPicker } from '@/components/games/LevelPicker';
import { completedLevels, freshNumberSeed, isUnlimited, LEVEL_COUNT, nextLevel, storedLevel, type FiniteGame } from '@/lib/levels';

export const Route = createFileRoute("/play/$gameId")({
  validateSearch: (s: Record<string, unknown>): { mix?: boolean } => (s["mix"] === true || s["mix"] === "true" ? { mix: true } : {}),
  loader: ({ params }) => {
    const g = gameById(params.gameId);
    if (!g) throw notFound();
    return { name: g.name, tagline: g.tagline, game: g };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Game"} — StaySmart` },
      { name: "description", content: loaderData?.tagline ?? "A StaySmart mental-gym game." },
      { property: "og:title", content: `${loaderData?.name ?? "Game"} — StaySmart` },
      { property: "og:description", content: loaderData?.tagline ?? "A StaySmart mental-gym game." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlayGame,
});

function PlayGame() {
  const { gameId } = Route.useParams();
  const { mix } = Route.useSearch();
  const { game: g } = Route.useLoaderData();
  return <GameScreen key={gameId} gameId={gameId} g={g} mix={!!mix} />;
}

function HowTo({ id, onClose }: { id: keyof typeof HOW_TO; onClose: () => void }) {
  return (
    <div className="card-block p-5 space-y-3 animate-pop border-primary/40">
      <div className="flex items-center justify-between"><h2 className="text-lg font-bold">How to play</h2><span className="font-mono text-xs text-primary">30-second read</span></div>
      <ol className="space-y-2">
        {HOW_TO[id].map((s, i) => <li key={i} className="flex gap-3 text-sm"><span className="size-6 shrink-0 rounded-full bg-primary/15 text-primary grid place-items-center font-mono text-xs">{i + 1}</span>{s}</li>)}
      </ol>
      <button onClick={onClose} className="btn-block btn-glow px-5 py-2">Got it — let's go</button>
    </div>
  );
}

function ResultExtras({ g, result, attemptAt, onRank }: { g: { id: GameId; name: string }; result: GameResult; attemptAt: number; onRank?: () => void }) {
  const { user } = useAuth();
  const { attempts } = useProgress();
  const [rank, setRank] = useState<{ rank: number | null; total: number } | null>(null);
  const score = Math.max(0, result.score);
  const pb = personalBest(attempts, g.id, attemptAt);
  const isPb = pb === null || score > pb;
  useEffect(() => {
    void celebrate(isPb && pb !== null);
    if (!user) return;
    submitDailyScore(g.id, score, result.ms).then(() => fetchMyRank(g.id, user.id)).then((r) => { setRank(r); onRank?.(); }).catch(() => toast.error("Couldn't post your score to the leaderboard"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function share() {
    const text = `I scored ${score} in ${g.name} on StaySmart${rank?.rank ? ` — #${rank.rank} today` : ""}. Can you beat me? 🧠`;
    try {
      if (navigator.share) await navigator.share({ text, url: window.location.origin });
      else { await navigator.clipboard.writeText(`${text} ${window.location.origin}`); toast.success("Copied to clipboard"); }
    } catch { /* cancelled */ }
  }
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="rounded-xl bg-muted p-3"><div className="text-xs text-muted-foreground">Personal best</div><div className="font-mono text-xl font-bold">{isPb ? <span className="text-primary">New! 🎉</span> : pb}</div></div>
      <div className="rounded-xl bg-muted p-3"><div className="text-xs text-muted-foreground">Today's rank</div>
        <div className="font-mono text-xl font-bold">{user ? (rank?.rank ? <Link to="/leaderboard" className="hover:text-primary">#{rank.rank}<span className="text-xs text-muted-foreground"> /{rank.total}</span></Link> : "…") : <Link to="/auth" className="text-sm text-primary underline">Sign in</Link>}</div></div>
      <button onClick={share} className="rounded-xl bg-muted p-3 text-left hover:bg-primary/15 transition"><div className="text-xs text-muted-foreground">Challenge</div><div className="font-semibold">Share ↗</div></button>
    </div>
  );
}

function GameScreen({ gameId, g, mix }: { gameId: string; g: NonNullable<ReturnType<typeof gameById>>; mix: boolean }) {
  const { attempts, ready, selectedLevels } = useProgress();
  const [result, setResult] = useState<GameResult | null>(null);
  const [round, setRound] = useState(0);
  const [level, setLevel] = useState<1 | 2 | 3 | null>(null);
  const [levelNumber, setLevelNumber] = useState<number | null>(null);
  const [numberSeed, setNumberSeed] = useState(0);
  const unlimited = isUnlimited(g.id);
  const finiteGame = g.id as FiniteGame;
  useEffect(() => {
    if (!ready || level !== null) return;
    if (unlimited) { setLevel(difficulty(attempts, g.id)); setNumberSeed(freshNumberSeed()); }
    else {
      const saved = selectedLevels?.[g.id];
      const n = saved && saved >= 1 && saved <= LEVEL_COUNT ? saved : nextLevel(attempts, g.id);
      setLevelNumber(n); setLevel(storedLevel(finiteGame, n).difficulty);
    }
  }, [ready, level, attempts, selectedLevels, g.id, unlimited, finiteGame]);
  function chooseLevel(n: number) { selectLevel(g.id, n); setLevelNumber(n); setLevel(storedLevel(finiteGame, n).difficulty); setResult(null); setRound(r => r + 1); }
  function newRound() { setNumberSeed(freshNumberSeed()); setResult(null); setRound(r => r + 1); }
  const selected = !unlimited && levelNumber ? storedLevel(finiteGame, levelNumber) : null;
  const seed = selected?.seed ?? numberSeed;
  const [attemptAt, setAttemptAt] = useState(0);
  const [showHow, setShowHow] = useState(false);
  const navigate = useNavigate();
  useEffect(() => { if (!localStorage.getItem(`staysmart.howto.${g.id}`)) setShowHow(true); }, [g.id]);
  const closeHow = () => { localStorage.setItem(`staysmart.howto.${g.id}`, "1"); setShowHow(false); };
  const finish = (r: GameResult) => {
    // thoughtFirst: a confidence was stated before the reveal, or the puzzle was solved without a hint
    recordAttempt({ game: g.id, skill: g.skill, score: Math.max(0, r.score), raw: r.raw, accuracy: r.accuracy, ms: r.ms, hintUsed: r.hintUsed, thoughtFirst: r.calls ? r.calls.length > 0 : !r.hintUsed, ...(r.calls ? { calls: r.calls } : {}), ...(!unlimited && levelNumber ? { levelNumber } : {}), ...(level ? { puzzleDifficulty: level } : {}) });
    track("game_completed", { game: g.id, score: Math.max(0, r.score), accuracy: Math.round(r.accuracy * 100) });
    setAttemptAt(load().attempts.at(-1)?.at ?? Date.now());
    setResult(r);
  };
  const props = { level: level ?? 1, seed, onFinish: finish, ...(!unlimited && levelNumber ? { levelNumber } : {}) };

  const doneToday = new Set(attempts.filter((a) => a.date === today()).map((a) => a.game));
  const next = smartSet(attempts).find((x) => !doneToday.has(x.id) && x.id !== g.id);
  const pool = load().mixPool;
  const inMix = mix && validMix(pool);
  const nextMix = () => { if (!validMix(pool)) return; const id = nextMystery(pool, [...attempts.map((a) => a.game), g.id]); void navigate({ to: "/play/$gameId", params: { gameId: id }, search: { mix: true } }); };

  const calls = result?.calls ?? [];
  const sure = confidentCalls(calls);
  const brierScore = brier(calls);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Link to={inMix ? "/mix" : "/"} className="text-sm text-muted-foreground hover:text-foreground">← {inMix ? "Deck" : "Home"}</Link>
        {inMix && <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-primary/15 text-primary">🎲 Mystery round</span>}
        <span className={`ml-auto text-xs font-mono px-2 py-0.5 rounded-full ${SKILLS[g.skill].color} text-primary-foreground`}>{SKILLS[g.skill].label}</span>
        {g.id === '2048' ? <span className="text-xs font-mono px-2 py-0.5 rounded-full border border-border bg-card">Classic 4 × 4</span> : level && <span className="text-xs font-mono px-2 py-0.5 rounded-full border border-border bg-card">{['', 'Easy', 'Medium', 'Hard'][level]}</span>}
        <button onClick={() => setShowHow((v) => !v)} aria-label="How to play" className="size-7 rounded-full border border-border text-sm hover:border-primary">?</button>
      </div>
      <h1 className="text-5xl font-black">{g.name}</h1>
      {g.inspired && <p className="text-sm text-muted-foreground">{g.tagline}</p>}
      {showHow && !result && <HowTo id={g.id} onClose={closeHow} />}
      {!unlimited && levelNumber && <LevelPicker game={finiteGame} current={levelNumber} completed={completedLevels(attempts, g.id)} onSelect={chooseLevel} />}
      {unlimited && level && <div className="flex flex-wrap items-center gap-2 border-y border-border py-3"><span className="font-mono text-xs mr-auto">∞ Unlimited rounds</span>{g.id !== '2048' && <div role="group" aria-label="Number puzzle difficulty" className="flex gap-1">{([1, 2, 3] as const).map(d => <Button key={d} variant={level === d ? 'default' : 'outline'} size="sm" aria-pressed={level === d} onClick={() => { setLevel(d); newRound(); }}>{['', 'Easy', 'Medium', 'Hard'][d]}</Button>)}</div>}<Button variant="outline" size="sm" onClick={newRound}>New round</Button></div>}

      {result ? (
        <div className="card-block p-6 space-y-5 animate-pop">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs font-mono uppercase text-muted-foreground">Score</div>
              <div className="font-mono text-7xl font-bold text-gradient">{Math.max(0, result.score)}</div>
            </div>
            <div className="text-right text-sm space-y-1">
              <div>{result.raw}</div>
              <div className="font-mono text-muted-foreground">{g.id === '2048' ? 'Target reached' : 'Accuracy'} {Math.round(result.accuracy * 100)}% · {(result.ms / 1000).toFixed(0)}s</div>
              {result.hintUsed && <div className="text-xs text-muted-foreground">Hint used</div>}
              {calls.length > 0 && <div className="text-xs text-muted-foreground">Confident calls: {sure.right} right · {sure.wrong} wrong{brierScore !== null && ` · calibration ${brierScore.toFixed(2)}`}</div>}
            </div>
          </div>
          {attemptAt > 0 && <ResultExtras key={attemptAt} g={g} result={result} attemptAt={attemptAt} />}
          <div className="rounded-xl bg-accent/15 border border-accent/40 p-3 text-sm"><b className="text-accent">Improve:</b> {result.tip}</div>
          <div className="flex flex-wrap gap-3">
            {inMix ? (
              <button onClick={nextMix} className="btn-block btn-glow px-6 py-3">🎲 Next mystery game →</button>
            ) : next ? (
              <Link to="/play/$gameId" params={{ gameId: next.id }} className="btn-block btn-glow px-5 py-2.5">Next: {next.name} →</Link>
            ) : (
              <Link to="/progress" className="btn-block btn-glow px-5 py-2.5">See my progress →</Link>
            )}
            {!unlimited && levelNumber && levelNumber < LEVEL_COUNT && <Button variant="outline" onClick={() => chooseLevel(levelNumber + 1)}>Next level →</Button>}
            <Button variant="outline" className="btn-block bg-card px-5 py-2.5 h-auto" onClick={() => { if (unlimited) newRound(); else if (levelNumber) chooseLevel(levelNumber); }}>{unlimited ? 'New round' : 'Replay level'}</Button>
          </div>
        </div>
      ) : level === null ? (
        <div className="h-64" />
      ) : (
        <div key={`${gameId}-${round}`}>
          {g.id === '2048' && <Game2048 {...props} />}
          {(g.id === "sprint" || g.id === "fifty") && <MathGame mode={g.id} {...props} />}
          {g.id === "queens" && <QueensGame {...props} />}
          {g.id === "tango" && <TangoGame {...props} />}
          {g.id === "deduce" && <McqGame bank={selected?.questions ?? DEDUCE} {...props} />}
          {g.id === "data" && <McqGame bank={selected?.questions ?? DATA} {...props} />}
          {g.id === "aicheck" && <McqGame bank={selected?.questions ?? AICHECK} {...props} />}
          {g.id === "path" && <PathGame {...props} />}
          {g.id === "category" && <CategoryGame {...props} />}
          {g.id === "ladder" && <LadderGame {...props} />}
          {g.id === "sudoku" && <MiniSudokuGame {...props} />}
          {g.id === "patches" && <PatchworkGame {...props} />}
          {g.id === "wordtrail" && <WordTrailsGame {...props} />}
        </div>
      )}
    </div>
  );
}
