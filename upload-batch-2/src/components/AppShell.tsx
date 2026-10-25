import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useProgress, streak } from "@/lib/progress";
import { useAuth } from "@/lib/auth";

const NAV = [
  { to: "/", label: "Today", icon: "☀️" },
  { to: "/check", label: "Check", icon: "🟢" },
  { to: "/play", label: "Games", icon: "🧩" },
  { to: "/leaderboard", label: "Ranks", icon: "🏆" },
  { to: "/progress", label: "Progress", icon: "📈" },
  { to: "/profile", label: "Me", icon: "🙂" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { attempts, ready } = useProgress();
  const { user, profile } = useAuth();
  const s = ready ? streak(attempts) : 0;
  return (
    <div className="min-h-screen pb-28 sm:pb-10">
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-background/60 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center gap-3">
          <Link to="/" className="font-display text-2xl font-black tracking-tight mr-auto">
            Stay<span className="text-gradient italic">Smart</span>
          </Link>
          <nav className="hidden sm:flex gap-1 rounded-full border border-border bg-card/50 p-1">
            {NAV.slice(0, 5).map((n) => (
              <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
                className="px-3.5 py-1.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground transition"
                activeProps={{ className: "btn-glow !text-primary-foreground" }}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="font-mono text-sm rounded-full border border-border bg-card/60 px-3 py-1" aria-label={`${s} day streak`}>🔥 {s}</div>
          <Link to={user ? "/profile" : "/auth"} className="hidden sm:grid size-9 rounded-full border border-border bg-card place-items-center text-lg hover:border-primary" aria-label={user ? "Your profile" : "Sign in"}>
            {user ? profile?.avatar ?? "🧠" : "👤"}
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">{children}</main>
      <nav className="sm:hidden fixed bottom-3 inset-x-3 z-20 rounded-2xl border border-border bg-card/80 backdrop-blur-xl grid grid-cols-6 shadow-[var(--shadow-block)]">
        {NAV.map((n) => (
          <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
            className="py-2.5 flex flex-col items-center text-[11px] font-medium text-muted-foreground" activeProps={{ className: "!text-primary" }}>
            <span className="text-lg leading-none mb-0.5">{n.icon}</span>{n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
