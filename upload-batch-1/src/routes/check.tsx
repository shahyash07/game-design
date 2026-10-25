import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { GreenLight } from "@/components/games/GreenLight";

export const Route = createFileRoute("/check")({
  head: () => ({
    meta: [
      { title: "Green Light — StaySmart" },
      { name: "description", content: "A 90-second check of your attention and speed, compared with your own usual range." },
      { property: "og:title", content: "Green Light — StaySmart" },
      { property: "og:description", content: "Three quick rounds against your own baseline before you make the call." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CheckPage,
});

function CheckPage() {
  const [run, setRun] = useState(0);
  return <GreenLight key={run} onAgain={() => setRun((r) => r + 1)} />;
}
