import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Check, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Direction, new2048, result2048 } from '@/lib/game2048';
import { useProgress } from '@/lib/progress';
import type { GameProps } from './types';

const DIRECTIONS = [
  { direction: Direction.UP, label: 'Move up', Icon: ArrowUp },
  { direction: Direction.LEFT, label: 'Move left', Icon: ArrowLeft },
  { direction: Direction.DOWN, label: 'Move down', Icon: ArrowDown },
  { direction: Direction.RIGHT, label: 'Move right', Icon: ArrowRight },
];
const KEYS: Record<string, Direction> = { ArrowUp: Direction.UP, ArrowDown: Direction.DOWN, ArrowLeft: Direction.LEFT, ArrowRight: Direction.RIGHT };
const TILE_STYLES = ['bg-region-1', 'bg-region-2', 'bg-region-3', 'bg-region-4', 'bg-region-5', 'bg-region-6', 'bg-region-7'];

export function Game2048({ seed, onFinish }: GameProps) {
  const [game] = useState(() => new2048(seed));
  const [state, setState] = useState(game.currentState);
  const [moves, setMoves] = useState(0);
  const [continued, setContinued] = useState(false);
  const started = useRef(0);
  const finished = useRef(false);
  const pointer = useRef<{ x: number; y: number; id: number } | null>(null);
  const { attempts } = useProgress();
  const best = Math.max(0, ...attempts.filter(a => a.game === '2048').map(a => Number.parseInt(a.raw, 10) || 0), state.score);
  const won = state.status.isWon && !continued;
  const blocked = won || !state.status.hasPossibleMoves;
  const move = useCallback((direction: Direction) => {
    if (finished.current || !game.currentState.status.hasPossibleMoves || (game.currentState.status.isWon && !continued)) return;
    const previous = game.currentState;
    const next = game.move(direction);
    if (previous === next) return;
    if (!started.current) started.current = Date.now();
    setState(next); setMoves(game.moveLog.length);
  }, [game, continued]);
  const finish = () => {
    if (finished.current || moves === 0) return;
    finished.current = true;
    onFinish(result2048(game, started.current ? Date.now() - started.current : 0));
  };
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) return;
      const direction = KEYS[event.key];
      if (direction === undefined) return;
      event.preventDefault(); move(direction);
    };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, [move]);

  return <div className="mx-auto max-w-md space-y-4">
    <div className="grid grid-cols-3 border-y border-border py-3 text-center font-mono">
      <div><div className="text-xs text-muted-foreground">Points</div><div className="text-2xl font-bold" aria-label="Current points">{state.score}</div></div>
      <div><div className="text-xs text-muted-foreground">Best</div><div className="text-2xl font-bold">{best}</div></div>
      <div><div className="text-xs text-muted-foreground">Moves</div><div className="text-2xl font-bold" aria-label="Move count">{moves}</div></div>
    </div>
    <div className="relative">
      <div role="grid" aria-label="2048 board" tabIndex={0} className="grid grid-cols-4 gap-2 rounded-lg border-2 border-ink bg-secondary p-2 aspect-square touch-none select-none focus-visible:outline-2 focus-visible:outline-ring"
        onPointerDown={event => { if (event.pointerType === 'mouse' && event.button !== 0) return; event.currentTarget.setPointerCapture(event.pointerId); pointer.current = { x: event.clientX, y: event.clientY, id: event.pointerId }; }}
        onPointerCancel={() => { pointer.current = null; }}
        onPointerUp={event => {
          const start = pointer.current; pointer.current = null;
          if (!start || start.id !== event.pointerId) return;
          const dx = event.clientX - start.x, dy = event.clientY - start.y;
          if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
          move(Math.abs(dx) > Math.abs(dy) ? dx > 0 ? Direction.RIGHT : Direction.LEFT : dy > 0 ? Direction.DOWN : Direction.UP);
        }}>
        {state.board.flat().map((tile, index) => <div role="gridcell" aria-label={`Cell ${index + 1}: ${tile?.value ?? 'empty'}`} key={index}
          className={`aspect-square flex items-center justify-center rounded-md font-mono font-bold text-foreground ${tile ? TILE_STYLES[Math.min(6, Math.log2(tile.value) - 1)] : 'bg-background/60'} ${tile && tile.value >= 1024 ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'}`}>
          {tile && <span key={`${tile.id}-${tile.value}`} className="animate-pop">{tile.value}</span>}
        </div>)}
      </div>
      {blocked && <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-lg bg-card/95 p-5 text-center" role="status">
        {won ? <Check className="size-10 text-success" /> : <Flag className="size-10 text-primary" />}
        <h2 className="text-3xl font-bold">{won ? '2048 reached!' : 'No moves left'}</h2>
        <p className="font-mono">{state.score} points</p>
        <Button onClick={finish}>Save result</Button>
        {won && <Button variant="outline" onClick={() => setContinued(true)}>Keep playing</Button>}
      </div>}
    </div>
    <div className="flex justify-center gap-2" role="group" aria-label="Move direction">{DIRECTIONS.map(({ direction, label, Icon }) => <Button key={direction} variant="outline" size="icon" className="size-12" aria-label={label} title={label} disabled={blocked} onClick={() => move(direction)}><Icon /></Button>)}</div>
    <div className="flex justify-end"><Button variant="ghost" disabled={moves === 0} onClick={finish}><Flag />Finish & save</Button></div>
  </div>;
}