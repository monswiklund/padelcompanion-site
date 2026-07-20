# SPEC.md

§G
game-mode engines match docs + padel format findings; tests guard every mode.

§C

- svelte app source of truth: `src/lib/tournament/**`
- react archived: `legacy/react/src/**`
- docs source: `docs/game-modes/*.md`
- social scoring: total points | race | timed
- bracket/winners court: decisive winner; tie → no advance
- FORMAT.md absent; caveman skill grammar applied

§I

- mode: Americano → `src/lib/tournament/scoring/americanoCore.ts`
- mode: Team Americano → `src/lib/tournament/scoring/americanoCore.ts`
- mode: Mexicano → `src/lib/tournament/scoring/mexicanoGenerator.ts`
- mode: Team Mexicano → `src/lib/tournament/scoring/teamMexicanoGenerator.ts`
- mode: Division → `src/lib/tournament/scoring/divisionGenerator.ts`, `src/lib/tournament/scoring/playoffGenerator.ts`
- mode: Winners Court → `src/lib/tournament/winnersCourt/winnersCourtCore.ts`
- mode: Bracket → `src/lib/tournament/bracket/bracketCore.ts`
- stat: leaderboard → `src/lib/tournament/scoring/playerStats.ts`
- tests: mode contracts → `src/lib/tournament/__tests__/gameModes.test.ts`

§V
V1: Americano(8p,2c) → 7 rounds; ∀ round 8 active; ∀ player partners every other player once
V2: Team Americano(n teams) → complete team round robin; odd n → each team exactly 1 bye
V3: Mexicano next round → live standings groups; `oneThree` strict maps 1&3 vs 2&4 per group
V4: Team Mexicano next round → live standings groups; `oneThree` maps 1v3 + 2v4; `optimal` respects `playedAgainst` repeats
V5: Division → intra-division complete round robin; court shortage splits logical rounds, never drops matchups
V6: Winners Court → advance only when all courts complete; next round order winners → queue → losers; twist splits partners; pools isolate play
V7: Bracket → bye auto-advance only through empty source; pending source match blocks downstream winner
V8: Shared stats → completed match records points, pointsLost, W/L/D, matchPoints, `playedWith`, `playedAgainst`, byes
V9: Tournament UI → `npm run check` passes; touch score controls ≥44px; score picker never reads nullable active selector

§T
id|status|task|cites
T1|x|write game-mode docs under `docs/game-modes`|V1,V2,V3,V4,V5,V6,V7,V8
T2|x|add settings-matrix tests for game modes|V1,V2,V3,V4,V5,V6,V7,V8
T3|x|record `playedAgainst` in shared stats engine|V4,V8
T4|x|verify svelte engine reflects `playedAgainst`|V4,V8
T5|x|fix bracket auto-advance pending-source bug|V7
T6|x|verify svelte engine reflects bracket fix|V7
T7|x|run focused mode-contract tests|V1,V2,V3,V4,V5,V6,V7
T8|x|run full suite after SPEC rewrite|V1,V2,V3,V4,V5,V6,V7,V8
T9|x|run production build for svelte app|V1,V2,V3,V4,V5,V6,V7,V8
T10|x|run svelte check for tournament UI|V9

§B
id|date|cause|fix
B1|2026-05-19|bracket auto-advanced bye-side team past pending source match|V7
B2|2026-07-06|score picker callback read nullable active selector; backdrop div broke a11y check|V9
