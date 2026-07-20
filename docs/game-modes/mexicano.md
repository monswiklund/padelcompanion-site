# Mexicano

## What It Is

Mexicano is a dynamic mixer. The first round is random, then later rounds are generated from the live leaderboard. Stronger performers are pushed into tougher matchups, which makes games more balanced as the event progresses.

Common external descriptions use rank-based grouping from the second round onward. A classic pattern is 1 and 3 versus 2 and 4, then 5 and 7 versus 6 and 8, and so on. Padel Companion supports that pattern, but defaults to an "optimal" strategy that can avoid repeated partners and reduce team imbalance.

## Website Behavior

Route: `/tournament/generator`

Format value: `mexicano`

Main implementation:

- `src/tournament/scoring/mexicanoGenerator.ts`
- `src/context/TournamentContext.tsx`
- `src/components/tournament/PreferredPartners.tsx`
- `src/components/tournament/TournamentConfig.tsx`

Minimum setup:

- At least 4 players.
- Courts are capped at `floor(playerCount / 4)`.
- Recommended default is 8 to 16 players, 2 to 4 courts, total points to 24.

## First Round Logic

`generateMexicanoFirstRound`:

1. Calculates `playersNeeded = courts * 4`.
2. Builds player entities, respecting preferred partners as prebuilt pairs.
3. Shuffles entities.
4. Selects entities that fit on the active courts.
5. Converts singles into pairs.
6. Shuffles teams.
7. Assigns matches to courts.
8. Places unselected players or overflow teams into byes.

Preferred partner behavior:

- If two players are marked as preferred partners and both are available, they enter the round as a pair.
- If one preferred partner is excluded, the other can still play as a single.

## Next Round Logic

`generateMexicanoNextRound`:

1. Starts from the current leaderboard.
2. Excludes manual byes.
3. Builds singles and preferred-partner pair entities.
4. Prioritizes players or pairs with more byes and fewer played matches.
5. Selects enough players for the active courts.
6. Sorts singles by points.
7. Groups singles in blocks of 4 and applies the selected pairing strategy.
8. Sorts resulting teams by combined points.
9. Pairs adjacent teams into matches.
10. Assigns courts, respecting locked courts when present.

## Pairing Strategies

Configured in `TournamentConfig.tsx`:

| Strategy   | Meaning inside each rank group of 4                                   |
| ---------- | --------------------------------------------------------------------- |
| `optimal`  | Minimize repeated partners first, then minimize team point imbalance. |
| `oneThree` | 1 and 3 versus 2 and 4.                                               |
| `oneTwo`   | 1 and 2 versus 3 and 4.                                               |
| `oneFour`  | 1 and 4 versus 2 and 3.                                               |

`maxRepeats` limits how often the same partner pairing should repeat. `strictStrategy` forces a selected non-optimal pattern even if it violates the repeat limit.

## Scoring And Ranking

Mexicano uses individual accumulated points:

- Each player receives the points scored by their team.
- The live leaderboard controls future pairings.
- Byes increase `byeCount`, which helps prioritize those players next round.

## Good Fit

Use Mexicano when:

- The group has mixed skill levels.
- You want rounds to become more competitive over time.
- You want flexible event length rather than a fully precomputed schedule.

## Sources

- App code: `src/tournament/scoring/mexicanoGenerator.ts`
- PadelFast Mexicano: https://www.padelfast.com/formats/mexicano
- Padel Americanos format overview: https://padelamericanos.com/
