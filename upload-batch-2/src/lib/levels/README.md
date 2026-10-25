# StaySmart level libraries

Each game has a committed JSON file with 365 numbered level records. These are actual puzzle payloads, not merely runtime seeds. Arithmetic rounds remain procedural and unlimited.

## Record format

- `number`: stable, one-based level identity.
- `difficulty`: 1 (easy), 2 (medium), or 3 (hard).
- `seed`: reproducible authoring seed; does not replace the saved puzzle.
- `puzzle`: visible board/clues and a validated solution for grid and word games.
- `questions`: four answer-and-explanation records for reasoning games.

`src/lib/levels.ts` provides typed access, level bounds, and completion helpers. Game screens use `levelNumber` through the shared game contract. Existing browser progress stores the selected number and attempt identity; no account or cross-device syncing is added.

## Adding content

Append new records without renumbering or changing existing puzzles. Increase `LEVEL_COUNT` and the picker's page count together when expanding the library beyond its current size. Run the catalog tests after any addition.

`bun scripts/generate-levels.ts` reproduces the initial libraries offline. This overwrites the libraries: do not rerun it after editorial changes without preserving those changes. Later expansions should append rather than regenerate shipped records.

Word levels use authored vocabulary, definitions, and thematic pools with distinct combinations and word chains. Reasoning levels use parameterised question templates, not 365 independently written lessons. Puzzle validators accept any solution satisfying the visible constraints; only Mini Sudoku currently enforces a unique solution during authoring.