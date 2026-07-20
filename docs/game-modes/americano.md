# Americano

## What It Is

Americano is a social individual tournament played in pairs. Players rotate partners and opponents through a fixed schedule. The event normally ends when everyone has partnered with everyone at least once, or when the organizer stops after a chosen number of rounds.

External format references describe Americano as individual competition inside doubles matches: teams change each match, every rally point counts, and the player with the highest accumulated total wins.

## Website Behavior

Route: `/tournament/generator`

Format value: `americano`

Main implementation:

- `src/tournament/scoring/americanoCore.ts`
- `src/context/TournamentContext.tsx`
- `src/tournament/ui/setup/scheduleGeneration.ts`

Minimum setup:

- At least 4 players.
- Courts are capped at `floor(playerCount / 4)`.
- Recommended default is 8 players, 2 courts, total points to 24.

## Scheduling Logic

`generateAmericanoSchedule` builds the full schedule before the tournament starts.

Algorithm:

1. Copy the player list.
2. If the count is odd, add a BYE placeholder.
3. Keep the first player fixed and rotate the rest with the circle method.
4. In each logical round, pair players from opposite ends of the rotated list.
5. Combine two pairs into one doubles match.
6. Keep only the number of matches that fit on the configured courts.
7. Mark everyone not used in that round as a bye.

Important implementation detail: because court count can truncate a logical round, players can receive byes even when the total player count is even.

## Scoring And Ranking

Americano uses individual accumulated scoring:

- A player's team score is added to that player's total points.
- The opponent score is added to `pointsLost`.
- Wins, losses, and draws are tracked from the recorded score.
- Default sorting is total points, then wins.

Example with total points to 24:

- Team A wins 14-10.
- Both Team A players receive 14 points and a win.
- Both Team B players receive 10 points and a loss.

## Good Fit

Use Americano when:

- The group wants a fair social mixer.
- Player levels are reasonably close.
- Predictable duration matters.
- Everyone should meet many different partners.

Avoid or split groups when skill gaps are very large; Mexicano usually handles mixed levels better.

## Sources

- App code: `src/tournament/scoring/americanoCore.ts`
- PadelFast Americano: https://www.padelfast.com/formats/americano
- PadelFast Round Robin: https://www.padelfast.com/formats/roundrobin
