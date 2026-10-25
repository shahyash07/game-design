import { Route as PathIcon, Grid2X2, Crown, SunMoon, Layers, WholeWord, Link2, Calculator, Timer, Lightbulb, ChartNoAxesCombined, Bot, Grid3X3 } from "lucide-react";
import type { GameId } from "./progress";

export const GAME_ICONS: Record<GameId, typeof Grid2X2> = { "2048": Grid2X2, path: PathIcon, sudoku: Grid3X3, queens: Crown, tango: SunMoon, patches: Layers, wordtrail: WholeWord, category: Link2, ladder: WholeWord, sprint: Timer, fifty: Calculator, deduce: Lightbulb, data: ChartNoAxesCombined, aicheck: Bot };
