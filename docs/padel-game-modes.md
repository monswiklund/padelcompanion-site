# Padel Game Modes

Implementation source of truth for Padel Companion game modes.

Last reviewed: 2026-07-05.

## Shared Rules

- Official padel is normally doubles on one court, with standard tennis-style game/set scoring unless an organizer chooses social scoring.
- App social scoring modes are `total`, `race`, and `time`.
- `total`: both team scores must sum to `pointsPerMatch`.
- `race`: exactly one team must reach `pointsPerMatch`.
- `time`: any non-negative whole-number score is valid.
- Scores must be whole numbers and non-negative.
- One player may appear at most once per round.
- One court may host at most one match per round.
- Missing results block round completion.
- Backend stores session snapshots only; frontend tournament engines are the current rule engine.
- Backend snapshot API accepts only canonical formats: `americano`, `mexicano`, `team`, `teamMexicano`, `division`, `bracket`, `winners-court`.

## Regular Padel Match

Short description: one padel match between two fixed pairs.

Basic rules: two players per side; score by agreed official format, short set, race score, timed score, or total rally points.

Players/teams: 4 players or 2 teams.

Courts: 1 court per active match.

Match generation: direct assignment; no rotation.

Partner rotation: none.

Opponent rotation: none inside the match.

Court assignment: explicit court; must not be double-booked in the same round.

Scoring: organizer-selected. App validation supports whole-number total, race, and timed scores.

Ranking/leaderboard: each player receives team points, points lost, W/L/D, and match points.

Tie-breaks: allowed for social timed/total formats; bracket/progression formats need a decisive winner.

Walkover/no-show: mark opponent winner by agreed score, or remove player before generating the round. Do not leave a missing result.

Edge cases: invalid score, missing score, duplicate player, and duplicate court must block completion.

Backend requirements: accept only valid snapshot shape and canonical format names.

Frontend requirements: block obvious invalid scores and show backend validation errors for cloud saves.

Example: Team A beats Team B 14-10 in total-to-24; Team A players each receive 14 points and a win.

## Americano

Short description: individual doubles mixer with a fixed schedule.

Basic rules: players rotate partners and opponents. Each round creates doubles matches.

Players/teams: minimum 4 players. Best when player count is divisible by 4.

Courts: up to `floor(playerCount / 4)`.

Match generation: `generateAmericanoSchedule` uses circle-method rotation, builds pairs, then combines pairs into matches.

Partner rotation: target is broad partner coverage; with 8 players and 2 courts, every player partners every other player once across 7 rounds.

Opponent rotation: derived from circle-method pairings.

Court assignment: sequential per generated match. Court truncation creates byes.

Scoring: individual accumulated points from team score.

Ranking/leaderboard: total points, then wins. Stats also track points lost, played, W/L/D, match points, byes, partners, opponents.

Tie-breaks: tied leaderboard positions fall back to wins; house rules decide prizes if still tied.

Walkover/no-show: remove player before schedule generation where possible; otherwise record agreed walkover score.

Edge cases: odd players add BYE placeholder; too many courts are capped; court shortage can create byes even with even player count.

Backend requirements: persist `format: "americano"` snapshots only after snapshot validation.

Frontend requirements: minimum 4 players, courts clamped to active capacity, score validation before round completion.

Example: 8 players, 2 courts -> 7 rounds, 2 matches per round, no byes.

## Mexicano

Short description: dynamic doubles mixer where standings generate later rounds.

Basic rules: first round is shuffled. Later rounds group players by live leaderboard.

Players/teams: minimum 4 players.

Courts: up to `floor(playerCount / 4)`.

Match generation: first round selects enough players for active courts; next rounds prioritize players with more byes and fewer played matches, then rank groups.

Partner rotation: optional preferred partners can lock a pair. Otherwise strategies are `optimal`, `oneTwo`, `oneThree`, `oneFour`.

Opponent rotation: teams are sorted by combined points, then adjacent teams play.

Court assignment: respects `lockedCourt` if valid and not already used; otherwise assigns next free court.

Scoring: individual accumulated points.

Ranking/leaderboard: live total points drive future pairings; byes increase `byeCount`.

Tie-breaks: total points, then wins. Pairing ties use deterministic score/order where implemented.

Walkover/no-show: use manual bye before next-round generation or record agreed score.

Edge cases: uneven players become byes; preferred pair overflow can create byes; duplicate locked courts fall back to normal assignment.

Backend requirements: persist only canonical `mexicano` snapshots.

Frontend requirements: show preferred partners only for Mexicano; block invalid scores before leaderboard update.

Example: 9 players, 2 courts -> 8 active players and 1 bye in round 1.

## Winners Court / Vinnarbana / King Of The Court

Short description: king-of-the-hill mode; winners move toward the top court, losers move down or queue.

Basic rules: each court has 4 players as two teams. Every court needs a winner before advancing.

Players/teams: minimum 4 players per active pool.

Courts: `floor(playersInPool / 4)` unless configured lower.

Match generation: `generateWinnersCourt` shuffles players per pool, fills courts, queues overflow.

Partner rotation: optional twist splits adjacent partners among winners and losers before next round.

Opponent rotation: next round order is winners, queue, losers.

Court assignment: generated court IDs start at 1 inside each pool.

Scoring: current implementation records only winner `1 | 2`, not numeric score.

Ranking/leaderboard: no point leaderboard in current implementation; position/round history is the result.

Tie-breaks: ties cannot advance; organizer must play a deciding point or choose a winner.

Walkover/no-show: remove player before generation or leave player in queue; do not advance incomplete courts.

Edge cases: pool with fewer than 4 active players is skipped; overflow waits in queue; incomplete court blocks advance.

Backend requirements: persist only canonical `winners-court` snapshots.

Frontend requirements: require 4 players; require every court winner before advance; show queue/empty states.

Example: 8 players, 2 courts -> both court winners are placed before queue and losers for round 2.

## Tournament / Bracket

Short description: knockout tournament, optionally with pools or double-elimination structures.

Basic rules: entrants are seeded into a bracket; winners advance.

Players/teams: minimum 2 for engine; UI currently requires 4.

Courts: matches can be played on any available court; bracket data itself does not allocate a physical court schedule.

Match generation: bracket expands to next power of 2 and creates linked matches; byes auto-advance only when the source side is truly empty.

Partner rotation: none; teams stay fixed.

Opponent rotation: determined by bracket progression.

Court assignment: outside bracket engine.

Scoring: numeric score comparison only; no padel set parser.

Ranking/leaderboard: winner advances; standings depend on bracket type.

Tie-breaks: tied score creates no winner and must not advance.

Walkover/no-show: record decisive walkover score or use a bye before bracket generation.

Edge cases: non-power-of-two entrant counts create byes; pending source matches must block downstream auto-advance; finals need decisive score.

Backend requirements: persist only canonical `bracket` snapshots.

Frontend requirements: block tied advancement where a winner is required; display pending matches.

Example: 5 teams -> 8-slot bracket with 3 byes and linked first playable matches.

## Division / Divisionsspel

Short description: fixed teams grouped into divisions, with round robin and optional playoffs.

Basic rules: teams play every other team inside their division.

Players/teams: team entries; each division should have at least 2 teams to produce matches, and at least 4 teams for semifinals.

Courts: configured per division; minimum 1 court per division.

Match generation: `generateDivisionSchedule` groups by `divisionId`, creates round robin pairings, splits logical rounds by court capacity, then merges divisions into global rounds.

Partner rotation: none; entries are fixed teams.

Opponent rotation: complete intra-division round robin.

Court assignment: sequential with division court offsets.

Scoring: match points: win 3, draw 1, loss 0; rally points still track for tiebreakers.

Ranking/leaderboard: match points first, then configured tiebreaker `difference`, `most_won`, or `shared`.

Tie-breaks: difference = points for minus points lost; most_won = most points scored; shared preserves order then wins.

Walkover/no-show: record decisive agreed score or remove team before generation.

Edge cases: odd teams create byes; court shortage splits logical rounds; divisions with no remaining matches mark teams idle; playoffs ignore league leaderboard updates.

Backend requirements: persist only canonical `division` snapshots.

Frontend requirements: keep `divisionId` and display name in sync; validate division court counts; show division standings.

Example: two divisions with 4 teams and 1 court each -> each division plays 3 logical rounds, merged into shared rounds on courts 1 and 2.

## Round Robin

Short description: everyone in a group plays everyone else once.

Basic rules: fixed teams or players; no elimination until optional playoffs.

Players/teams: 3+ teams practical; app engines use Team Americano or Division.

Courts: based on available match slots; court shortage splits rounds.

Match generation: circle method with BYE placeholder for odd counts.

Partner rotation: none for team round robin; Americano variant rotates partners.

Opponent rotation: every entrant plays every other entrant once.

Court assignment: sequential and unique per round.

Scoring: total/race/time or match-points by mode.

Ranking/leaderboard: points or match points, with declared tiebreakers.

Tie-breaks: publish before event; app supports points, wins, difference, most scored.

Walkover/no-show: record agreed score or remove entrant before generation.

Edge cases: odd entrants create byes; groups can feed semifinals/finals/placement matches.

Backend requirements: canonical snapshot format must reflect the actual engine (`team`, `division`, or `americano`).

Frontend requirements: label the active engine clearly.

Example: 4 teams -> A-B/C-D, A-C/B-D, A-D/B-C.

## Sources

- FIP documents: https://www.padelfip.com/documents/
- FIP Rules of Padel PDF: https://www.padelfip.com/wp-content/uploads/2025/12/FIP_Rules-of-Padel.pdf
- PadelFast Americano: https://www.padelfast.com/formats/americano
- PadelFast Mexicano: https://www.padelfast.com/formats/mexicano
- PadelFast Round Robin: https://www.padelfast.com/formats/roundrobin
- PadelMix King of the Hill: https://padelmix.app/king-of-the-hill-padel
- Pistas365 Winners Court: https://pistas365.com/padel/information/rules/winners-court/
