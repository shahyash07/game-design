import { at } from "@/lib/at";
import { rng } from "./progress";
import { DancingLinkX } from "@algorithm.ts/dlx";

/** Crowns (Queens-style): returns region map n×n and the hidden solution columns per row. */
export function genQueens(n: number, seed: number) {
  const r = rng(seed);
  // random permutation with no diagonal adjacency
  let sol: number[] = [];
  const place = (row: number, used: Set<number>): boolean => {
    if (row === n) return true;
    const cols = [...Array(n).keys()].sort(() => r() - 0.5);
    for (const c of cols) {
      if (used.has(c)) continue;
      if (row > 0 && Math.abs(at(sol, row - 1) - c) <= 1) continue;
      sol[row] = c; used.add(c);
      if (place(row + 1, used)) return true;
      used.delete(c);
    }
    return false;
  };
  sol = []; place(0, new Set());
  const region: number[][] = Array.from({ length: n }, () => Array(n).fill(-1));
  const frontier: [number, number, number][] = [];
  sol.forEach((c, row) => { at(region, row)[c] = row; frontier.push([row, c, row]); });
  while (frontier.length) {
    const idx = Math.floor(r() * frontier.length);
    const [y, x, id] = at(frontier, idx);
    const nb = ([[1,0],[-1,0],[0,1],[0,-1]] as [number, number][]).map(([dy,dx]): [number, number] => [y+dy, x+dx]).filter(([a,b]) => a>=0&&b>=0&&a<n&&b<n&&at(region, a)[b]===-1);
    if (!nb.length) { frontier.splice(idx, 1); continue; }
    const [a, b] = at(nb, Math.floor(r() * nb.length));
    at(region, a)[b] = id; frontier.push([a, b, id]);
  }
  return { region, sol };
}

export function queensErrors(region: number[][], crowns: boolean[][]) {
  const n = region.length; const bad = new Set<string>();
  const cells: [number, number][] = [];
  crowns.forEach((row, y) => row.forEach((v, x) => v && cells.push([y, x])));
  for (let i = 0; i < cells.length; i++) for (let j = i + 1; j < cells.length; j++) {
    const [a, b] = at(cells, i), [c, d] = at(cells, j);
    if (a === c || b === d || at(region, a)[b] === at(region, c)[d] || (Math.abs(a - c) <= 1 && Math.abs(b - d) <= 1)) {
      bad.add(`${a},${b}`); bad.add(`${c},${d}`);
    }
  }
  return { bad, solved: cells.length === n && bad.size === 0 };
}

/** Sun & Moon (Tango-style binary puzzle), 6×6. 0 = sun, 1 = moon, null = empty. */
export function genTango(seed: number, level: number) {
  const r = rng(seed); const n = 6;
  const g: number[][] = Array.from({ length: n }, () => Array(n).fill(-1));
  const ok = (y: number, x: number) => {
    const v = at(g, y)[x];
    if (x >= 2 && at(g, y)[x-1] === v && at(g, y)[x-2] === v) return false;
    if (y >= 2 && at(g, y-1)[x] === v && at(g, y-2)[x] === v) return false;
    const rowC = at(g, y).filter((c) => c === v).length, colC = g.map((row) => row[x]).filter((c) => c === v).length;
    return rowC <= n / 2 && colC <= n / 2;
  };
  const fill = (k: number): boolean => {
    if (k === n * n) return true;
    const y = Math.floor(k / n), x = k % n;
    for (const v of r() < 0.5 ? [0, 1] : [1, 0]) { at(g, y)[x] = v; if (ok(y, x) && fill(k + 1)) return true; }
    at(g, y)[x] = -1; return false;
  };
  fill(0);
  const keep = level === 1 ? 0.5 : level === 2 ? 0.38 : 0.28;
  const givens = g.map((row) => row.map((v) => (r() < keep ? v : null)));
  return { solution: g, givens };
}

export function tangoErrors(grid: (number | null)[][]) {
  const n = grid.length; const bad = new Set<string>();
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const v = at(grid, y)[x]; if (v === null) continue;
    if (x >= 2 && at(grid, y)[x-1] === v && at(grid, y)[x-2] === v) [0,1,2].forEach((d) => bad.add(`${y},${x-d}`));
    if (y >= 2 && at(grid, y-1)[x] === v && at(grid, y-2)[x] === v) [0,1,2].forEach((d) => bad.add(`${y-d},${x}`));
  }
  for (let i = 0; i < n; i++) for (const v of [0, 1]) {
    if (at(grid, i).filter((c) => c === v).length > n / 2) at(grid, i).forEach((c, x) => c === v && bad.add(`${i},${x}`));
    if (grid.filter((row) => row[i] === v).length > n / 2) grid.forEach((row, y) => row[i] === v && bad.add(`${y},${i}`));
  }
  const full = grid.every((row) => row.every((c) => c !== null));
  return { bad, solved: full && bad.size === 0 };
}

export const adjacent = (a: number, b: number, n: number) => Math.abs(Math.floor(a / n) - Math.floor(b / n)) + Math.abs(a % n - b % n) === 1;

/** Randomized Hamiltonian path using backbite moves; every generated board is solvable. */
export function fullPath(n: number, seed: number): number[] {
  const r = rng(seed);
  let path = Array.from({ length: n * n }, (_, i) => Math.floor(i / n) * n + (Math.floor(i / n) % 2 ? n - 1 - i % n : i % n));
  for (let k = 0; k < n * n * 12; k++) {
    if (r() < 0.5) path.reverse();
    const options = path.map((v, i) => i > 1 && adjacent(v, at(path, 0), n) ? i : -1).filter((i) => i >= 0);
    if (options.length) {
      const i = at(options, Math.floor(r() * options.length));
      path = [...path.slice(0, i).reverse(), ...path.slice(i)];
    }
  }
  return path;
}

export function genPath(seed: number, level: number) {
  const n = level === 1 ? 4 : level === 2 ? 5 : 6;
  const solution = fullPath(n, seed);
  const count = level === 1 ? 6 : level === 2 ? 7 : 8;
  const clues: Record<number, number> = {};
  for (let i = 0; i < count; i++) clues[at(solution, Math.round(i * (solution.length - 1) / (count - 1)))] = i + 1;
  return { n, solution, clues, count };
}

export function pathValid(path: number[], n: number, clues: Record<number, number>, complete = false) {
  if (!path.length || new Set(path).size !== path.length || path.some((v) => v < 0 || v >= n * n)) return false;
  if (path.some((v, i) => i > 0 && !adjacent(at(path, i - 1), v, n))) return false;
  const visited = path.filter((v) => clues[v] !== undefined).map((v) => clues[v]);
  if (clues[at(path, 0)] !== 1 || visited.some((v, i) => v !== i + 1)) return false;
  return !complete || (path.length === n * n && visited.length === Object.keys(clues).length);
}

/** Exact-cover constraints delegated to DancingLinkX for 6x6 / 2x3 Sudoku. */
export function solveMini(board: (number | null)[], forbid?: [number, number]): number[] | null {
  const dlx = new DancingLinkX({ MAX_N: 1200 });
  dlx.init(144);
  for (let cell = 0; cell < 36; cell++) {
    const row = Math.floor(cell / 6), col = cell % 6, box = Math.floor(row / 2) * 2 + Math.floor(col / 3);
    for (let v = 1; v <= 6; v++) {
      if (board[cell] !== null && board[cell] !== v) continue;
      if (forbid?.[0] === cell && forbid[1] === v) continue;
      dlx.addRow(cell * 6 + v, [cell + 1, 36 + row * 6 + v, 72 + col * 6 + v, 108 + box * 6 + v]);
    }
  }
  const rows = dlx.solve();
  if (!rows) return null;
  const result = Array<number>(36).fill(0);
  for (const code of rows) result[Math.floor((code - 1) / 6)] = (code - 1) % 6 + 1;
  return result;
}

export function genMini(seed: number, level: number) {
  const r = rng(seed);
  const digits = [1, 2, 3, 4, 5, 6].sort(() => r() - 0.5);
  const solution = Array.from({ length: 36 }, (_, i) => at(digits, (Math.floor(i / 6) * 3 + Math.floor(Math.floor(i / 6) / 2) + i % 6) % 6));
  const givens: (number | null)[] = [...solution];
  const target = level === 1 ? 20 : level === 2 ? 16 : 12;
  for (const cell of Array.from({ length: 36 }, (_, i) => i).sort(() => r() - 0.5)) {
    if (givens.filter((v) => v !== null).length <= target) break;
    givens[cell] = null;
    // Any alternative solution must differ at at least one empty cell.
    if (givens.some((v, i) => v === null && solveMini(givens, [i, at(solution, i)]) !== null)) givens[cell] = at(solution, cell);
  }
  return { givens, solution };
}

export function miniErrors(board: (number | null)[]) {
  const bad = new Set<number>();
  board.forEach((v, i) => {
    if (v === null) return;
    board.forEach((w, j) => {
      if (i >= j || v !== w) return;
      const a = Math.floor(i / 6), b = Math.floor(j / 6);
      if (a === b || i % 6 === j % 6 || (Math.floor(a / 2) === Math.floor(b / 2) && Math.floor(i % 6 / 3) === Math.floor(j % 6 / 3))) { bad.add(i); bad.add(j); }
    });
  });
  return { bad, solved: board.length === 36 && board.every((v) => v !== null && v >= 1 && v <= 6) && !bad.size };
}

export interface PatchClue { cell: number; area: number }
export function rectangle(a: number, b: number, n: number) {
  const y1 = Math.min(Math.floor(a / n), Math.floor(b / n)), y2 = Math.max(Math.floor(a / n), Math.floor(b / n));
  const x1 = Math.min(a % n, b % n), x2 = Math.max(a % n, b % n);
  return Array.from({ length: (y2 - y1 + 1) * (x2 - x1 + 1) }, (_, i) => (y1 + Math.floor(i / (x2 - x1 + 1))) * n + x1 + i % (x2 - x1 + 1));
}
export function patchValid(cells: number[], n: number, clues: PatchClue[]) {
  if (!cells.length || new Set(cells).size !== cells.length || cells.some((c) => c < 0 || c >= n * n)) return false;
  const sorted = [...cells].sort((a, b) => a - b);
  const rect = rectangle(at(sorted, 0), at(sorted, sorted.length - 1), n);
  const inside = clues.filter((c) => cells.includes(c.cell));
  return rect.length === cells.length && rect.every((c) => cells.includes(c)) && inside.length === 1 && inside[0]?.area === cells.length;
}
export function genPatches(seed: number, level: number) {
  const n = level === 1 ? 4 : level === 2 ? 5 : 6, r = rng(seed);
  const regions: number[][] = [];
  function split(y: number, x: number, h: number, w: number) {
    if (h * w <= 4 || (h * w <= 8 && r() < 0.35)) { regions.push(rectangle(y * n + x, (y + h - 1) * n + x + w - 1, n)); return; }
    if (h > 1 && (w === 1 || r() < 0.5)) { const k = 1 + Math.floor(r() * (h - 1)); split(y, x, k, w); split(y + k, x, h - k, w); }
    else { const k = 1 + Math.floor(r() * (w - 1)); split(y, x, h, k); split(y, x + k, h, w - k); }
  }
  split(0, 0, n, n);
  return { n, regions, clues: regions.map((cells) => ({ cell: at(cells, Math.floor(r() * cells.length)), area: cells.length })) };
}

export const oneLetterApart = (a: string, b: string) => a.length === b.length && [...a].filter((c, i) => c !== b[i]).length === 1;
export const normalizeAnswer = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
export function wordPathValid(path: number[], grid: string[], n: number, word: string, used: number[] = []) {
  return path.length === word.length && new Set(path).size === path.length && path.every((c, i) => !used.includes(c) && grid[c] === word[i] && (i === 0 || adjacent(at(path, i - 1), c, n)));
}
