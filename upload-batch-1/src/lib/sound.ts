const KEY = "staysmart.sound";
let ctx: AudioContext | null = null;

export const soundOn = () => typeof window !== "undefined" && localStorage.getItem(KEY) !== "off";
export const setSound = (on: boolean) => localStorage.setItem(KEY, on ? "on" : "off");

type Kind = "win" | "pb" | "tap";
const NOTES: Record<Kind, number[]> = { tap: [660], win: [523, 659, 784], pb: [523, 659, 784, 1047] };

export function play(kind: Kind) {
  if (!soundOn()) return;
  try {
    ctx ??= new AudioContext();
    const c = ctx;
    NOTES[kind].forEach((f, i) => {
      const o = c.createOscillator();
      const g = c.createGain();
      const t = c.currentTime + i * 0.11;
      o.type = "triangle";
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
      o.connect(g).connect(c.destination);
      o.start(t);
      o.stop(t + 0.3);
    });
  } catch {
    /* audio unavailable */
  }
}

export async function celebrate(big: boolean) {
  play(big ? "pb" : "win");
  if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const confetti = (await import("canvas-confetti")).default;
  confetti({ particleCount: big ? 160 : 70, spread: big ? 90 : 60, origin: { y: 0.65 } });
}
