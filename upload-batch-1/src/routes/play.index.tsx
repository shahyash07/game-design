import { createFileRoute, Link } from "@tanstack/react-router";
import { GAMES, SKILLS } from "@/lib/games";
import { useProgress } from "@/lib/progress";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isUnlimited, LEVEL_COUNT, completedLevels } from '@/lib/levels';
import { GAME_ICONS as ICONS } from "@/lib/game-icons";
const FILTERS = ["All", "LinkedIn-style", "Calculation", "Reasoning"] as const;

export const Route = createFileRoute("/play/")({
  head: () => ({
    meta: [
      { title: "All games — StaySmart" },
      { name: "description", content: "14 mental-gym games, including 2048, original Zip, Pinpoint, Crossclimb, Patches and Wend-style puzzles, plus Mini Sudoku." },
      { property: "og:title", content: "All games — StaySmart" },
      { property: "og:description", content: "Pick any mental-gym game: calculation, logic, data reasoning or AI judgment." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Play,
});

function Play() {
  const { attempts } = useProgress();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const filtered = GAMES.filter((g) => filter === "All" || (filter === "LinkedIn-style" ? !!g.inspired : filter === "Calculation" ? g.skill === "math" : g.skill !== "math"));
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between"><h1 className="text-4xl font-black">Free play</h1><span className="font-mono text-xs text-muted-foreground">{GAMES.length} games</span></div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Game filters">{FILTERS.map((f) => <Button key={f} variant={filter === f ? "default" : "outline"} aria-pressed={filter === f} onClick={() => setFilter(f)}>{f}</Button>)}</div>
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map((g) => {
          const best = Math.max(0, ...attempts.filter((a) => a.game === g.id).map((a) => a.score));
          const Icon = ICONS[g.id];
          return (
            <Link key={g.id} to="/play/$gameId" params={{ gameId: g.id }} className="card-block p-5 hover:-translate-y-0.5 transition-transform block">
              <div className="flex items-center gap-2 mb-2">
                <span className={`size-2.5 rounded-full ${SKILLS[g.skill].color}`} />
                <span className="text-xs font-mono uppercase text-muted-foreground">{SKILLS[g.skill].label}</span>
                {g.inspired && <span className="ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded border border-ink">like {g.inspired}</span>}
              </div>
              <div className="flex gap-3 items-center mt-4 mb-3"><span className={`size-11 shrink-0 flex items-center justify-center rounded-md border-2 border-ink ${SKILLS[g.skill].color} text-primary-foreground`}><Icon className="size-6" /></span><h2 className="text-2xl font-bold">{g.name}</h2><ArrowRight className="size-4 ml-auto shrink-0" /></div>
              <p className="text-sm text-muted-foreground">{g.tagline}</p>
              <p className="font-mono text-xs mt-3">{best ? `Best ${best}` : "Not played yet"} · ~{g.minutes} min</p>
              <p className="font-mono text-xs text-muted-foreground mt-2">{g.id === '2048' ? '∞ Unlimited rounds · Classic 4 × 4' : isUnlimited(g.id) ? '∞ Unlimited rounds · 3 difficulties' : `${LEVEL_COUNT} levels · ${completedLevels(attempts, g.id).size} completed`}</p>
            </Link>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">Original StaySmart puzzles inspired by familiar formats. Not affiliated with LinkedIn.</p>
    </div>
  );
}
