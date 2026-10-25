import type { GameId } from "./progress";

/** Short how-to-play steps shown before a game the first time. */
export const HOW_TO: Record<GameId, string[]> = {
  "2048": ["Use arrow keys, swipe, or the buttons to slide every tile.", "Two equal tiles that touch merge into one.", "Reach the 2048 tile before the board fills up."],
  sprint: ["Answer as many sums as you can in 30 seconds.", "Type the answer and press Enter.", "Speed matters, but wrong answers cost you."],
  fifty: ["Get fifty answers right as fast as you can.", "Wrong answers don't count — keep going.", "Your time is your score."],
  queens: ["Place one crown in every row, column and colour.", "Crowns can't touch, not even diagonally.", "Tap once to mark ✕, twice for a crown."],
  tango: ["Fill every cell with a sun or a moon.", "Each row and column has equal suns and moons.", "No three of the same in a row."],
  deduce: ["Read the short puzzle carefully.", "Pick your answer before seeing the explanation.", "Reason it out — no guessing needed."],
  data: ["Each card shows a chart or claim.", "Spot what's misleading about it.", "Commit to an answer, then read why."],
  aicheck: ["Read an AI-written answer.", "Find the mistake, false claim or weak reasoning.", "Think first — then check the explanation."],
  path: ["Draw one line from 1 through every number in order.", "The line must visit every cell exactly once.", "Drag across cells, or use undo to back up."],
  category: ["Clues appear one at a time.", "Guess the hidden connection in as few clues as you can.", "Fewer clues means a higher score."],
  ladder: ["Solve each clue to find a word.", "Each word changes one letter from the one before.", "Climb from top to bottom."],
  sudoku: ["Fill the 6×6 grid with 1 to 6.", "No repeats in any row, column or box.", "Use the given digits as anchors."],
  patches: ["Split the board into rectangles.", "Each rectangle holds exactly one number.", "That number equals the rectangle's size."],
  wordtrail: ["Find the hidden themed words.", "Connect neighbouring letters to spell them.", "Every letter is used exactly once."],
};
