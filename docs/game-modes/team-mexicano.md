# Team Mexicano

## What It Is

Team Mexicano keeps fixed teams together but uses Mexicano-style dynamic matchups. Teams are ranked after each round, and the next round is built from the current standings.

External references describe Team Mexicano as Mexicano rules applied to predetermined teams.

## Website Behavior

Route: `/tournament/generator`

Format value: `teamMexicano`

UI access: choose Mexicano, then enable Team Mode.

Main implementation:

- `src/tournament/scoring/teamMexicanoGenerator.ts`
- `src/components/tournament/TournamentConfig.tsx`
- `src/context/TournamentContext.tsx`

Minimum setup:

- At least 2 team entries.
- Court capacity is based on 2 team entries per court.

## First Round Logic

`generateTeamMexicanoFirstRound`:

1. Shuffles all team entries.
2. Creates matches from adjacent pairs.
3. Fills courts up to the configured court count.
4. Places remaining teams into byes.

Each match is represented as `team1: [team]` versus `team2: [team]`.

## Next Round Logic

`generateTeamMexicanoNextRound`:

1. Sorts teams by leaderboard points.
2. Removes manual byes.
3. Applies the selected pairing strategy.
4. Creates matches up to the court limit.
5. Places manual byes and unused teams into byes.

## Pairing Strategies

| Strategy   | Meaning                                                                               |
| ---------- | ------------------------------------------------------------------------------------- |
| `optimal`  | Pair closest ranked teams while trying to respect repeat limits from prior opponents. |
| `oneTwo`   | 1 versus 2, 3 versus 4.                                                               |
| `oneThree` | 1 versus 3, 2 versus 4.                                                               |
| `oneFour`  | 1 versus 4, 2 versus 3.                                                               |

Repeat avoidance reads `playedAgainst`, which is populated by the shared leaderboard update after each completed match.

## Scoring And Ranking

Team entries accumulate points from their match score. The next round uses the updated team leaderboard.

Team Mexicano should avoid draws if the organizer wants clean progression and clearer standings, but the shared stat model can record draws.

## Good Fit

Use Team Mexicano when:

- Pairs should stay together.
- The group has uneven team strength.
- You want competitive balancing without changing partners.

## Sources

- App code: `src/tournament/scoring/teamMexicanoGenerator.ts`
- PadelFast Mexicano, Team Mexicano section: https://www.padelfast.com/formats/mexicano
- Padel Americanos format overview: https://padelamericanos.com/
