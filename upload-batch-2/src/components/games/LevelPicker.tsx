import { useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Shuffle, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LEVEL_COUNT, LEVELS, type FiniteGame } from '@/lib/levels';

export function LevelPicker({ game, current, completed, onSelect }: { game: FiniteGame; current: number; completed: Set<number>; onSelect: (number: number) => void }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(Math.floor((current - 1) / 50));
  const [jump, setJump] = useState('');
  function choose(number: number) { onSelect(number); setOpen(false); }
  return <div className="flex flex-wrap gap-2 items-center border-y border-border py-3">
    <Button variant="outline" size="icon" aria-label="Previous level" disabled={current === 1} onClick={() => onSelect(current - 1)}><ChevronLeft /></Button>
    <Dialog open={open} onOpenChange={value => { setOpen(value); if (value) setPage(Math.floor((current - 1) / 50)); }}>
      <DialogTrigger asChild><Button variant="outline"><Layers /> Level {current} / {LEVEL_COUNT}</Button></DialogTrigger>
      <DialogContent className="max-w-lg"><DialogHeader><DialogTitle>Choose a level</DialogTitle></DialogHeader>
        <div className="flex justify-between items-center text-sm"><span>{completed.size} / {LEVEL_COUNT} completed</span><span className="text-muted-foreground">{page * 50 + 1}–{Math.min(LEVEL_COUNT, (page + 1) * 50)}</span></div>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">{LEVELS[game].slice(page * 50, page * 50 + 50).map(entry => <Button key={entry.number} variant={current === entry.number ? 'default' : completed.has(entry.number) ? 'secondary' : 'outline'} className="h-9 p-0 font-mono relative" aria-label={`Level ${entry.number}${completed.has(entry.number) ? ', completed' : ''}`} onClick={() => choose(entry.number)}>{entry.number}{completed.has(entry.number) && <Check className="absolute right-0 top-0 size-2.5" />}</Button>)}</div>
        <div className="flex gap-2 justify-between items-center"><Button variant="outline" size="icon" aria-label="Previous level page" disabled={page === 0} onClick={() => setPage(p => p - 1)}><ChevronLeft /></Button><span className="font-mono text-xs">{page + 1} / 8</span><Button variant="outline" size="icon" aria-label="Next level page" disabled={page === 7} onClick={() => setPage(p => p + 1)}><ChevronRight /></Button></div>
        <form className="flex gap-2" onSubmit={e => { e.preventDefault(); const n = Number(jump); if (Number.isInteger(n) && n >= 1 && n <= LEVEL_COUNT) choose(n); }}><Input type="number" aria-label="Jump to level" placeholder="Level number" min={1} max={LEVEL_COUNT} value={jump} onChange={e => setJump(e.target.value)} /><Button type="submit" disabled={!Number.isInteger(Number(jump)) || Number(jump) < 1 || Number(jump) > LEVEL_COUNT}>Go</Button></form>
      </DialogContent>
    </Dialog>
    <Button variant="outline" size="icon" aria-label="Next level" disabled={current === LEVEL_COUNT} onClick={() => onSelect(current + 1)}><ChevronRight /></Button>
    <Button variant="outline" size="icon" aria-label="Random level" title="Random level" onClick={() => { const candidates = LEVELS[game].filter(l => l.number !== current && !completed.has(l.number)); const pool = candidates.length ? candidates : LEVELS[game].filter(l => l.number !== current); const chosen = pool[Math.floor(Math.random() * pool.length)]; if (chosen) onSelect(chosen.number); }}><Shuffle /></Button>
    <span className="ml-auto text-xs text-muted-foreground font-mono">{completed.size}/{LEVEL_COUNT} ✓</span>
  </div>;
}