# Division

## What It Is

Division mode is league-style round robin play. Teams are assigned to divisions, each division runs its own internal schedule, and standings use match points rather than only raw rally points.

The structure matches common round robin league logic: every team in a group plays every other team, standings decide the winner or playoff qualifiers, and tiebreakers resolve close tables.

## Website Behavior

Route: `/tournament/division`

Format value: `division`

Main implementation:

- `src/tournament/pages/division/DivisionSetup.tsx`
- `src/tournament/scoring/divisionGenerator.ts`
- `src/tournament/scoring/playoffGenerator.ts`
- `src/tournament/scoring/playerStats.ts`

Setup concepts:

- Players in this mode are team entries.
- Teams can be entered as a single team name or as `Player One / Player Two`.
- Each team belongs to a `divisionId`.
- Each division has its own court allocation.

## Schedule Logic

`generateDivisionSchedule`:

1. Groups teams by division.
2. Sorts divisions by configured order.
3. Generates round robin pairings within each division.
4. Splits a division's logical round into sub-rounds if it has more matches than courts.
5. Merges sub-rounds from every division into global rounds.
6. Assigns courts sequentially by division order.
7. Marks teams idle when their division has no match in a merged round.

Round robin generation uses the circle method. There is also a custom deterministic schedule for exactly 8 teams in one division.

## Playoff Logic

After all division round robin rounds are complete, the app can generate playoffs.

`generateSemifinals`:

- Sorts standings inside each division by match points.
- Takes the top 4 teams.
- Creates 1st versus 4th.
- Creates 2nd versus 3rd.

`generateFinals`:

- Uses semifinal scores to determine each semifinal winner.
- Creates the final from those winners.

Playoff rounds do not update the round robin leaderboard in the shared completion logic because playoff rounds are identified by a round name.

## Scoring And Ranking

Division mode uses match points:

- Win = 3 match points.
- Draw = 1 match point.
- Loss = 0 match points.

Tiebreaker options:

| Tiebreaker   | Meaning                                                            |
| ------------ | ------------------------------------------------------------------ |
| `difference` | Sort by points scored minus points lost.                           |
| `most_won`   | Sort by most points scored.                                        |
| `shared`     | Keep the existing order after match points, then wins as fallback. |

## Good Fit

Use Division when:

- You want league tables.
- Teams should stay fixed.
- Skill levels should be separated into groups.
- You want playoffs after group play.

Avoid Division when the event is short and social; Americano or Mexicano gets everyone rotating faster.

## Sources

- App code: `src/tournament/scoring/divisionGenerator.ts`
- App code: `src/tournament/scoring/playoffGenerator.ts`
- Padel Playground Round Robin: https://padelplayground.io/round-robin-format-explained/
- PadelFast Round Robin: https://www.padelfast.com/formats/roundrobin
