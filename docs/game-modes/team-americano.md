# Team Americano

## What It Is

Team Americano is the fixed-team version of Americano. Instead of individual players rotating partners, each entered item is treated as a team and plays round robin matches against the other teams.

External Americano references describe Team Americano as the same structure as individual Americano, except competition happens in predetermined teams.

## Website Behavior

Format value: `team`

Main implementation:

- `src/tournament/scoring/americanoCore.ts`
- `src/tournament/ui/setup/scheduleGeneration.ts`
- `src/context/TournamentContext.tsx`

Product status:

- The logic still exists.
- The current React format selector mainly exposes Americano and Mexicano.
- Code comments in `TournamentConfig.tsx` describe `team` as effectively deprecated in the UI, but state normalization and schedule generation still support it.

## Scheduling Logic

`generateTeamSchedule` creates a fixed round robin over team entries.

Algorithm:

1. Copy the team list.
2. If the team count is odd, add a BYE placeholder.
3. Keep the first team fixed and rotate the rest.
4. Pair teams from opposite ends of the rotated list.
5. Each match is represented as `team1: [team]` versus `team2: [team]`.
6. Limit matches by available courts.
7. Mark teams not used in a round as byes.

This is 1v1 at the schedule entity level because each "player" record is actually a full team name or team entry.

## Scoring And Ranking

The app uses the same scoreboard and leaderboard update pipeline as Americano:

- Team entries receive their scored points.
- Wins, losses, draws, points lost, and played count are tracked.
- Default ranking is total points, then wins.

## Good Fit

Use Team Americano when:

- Pairs should stay together all event.
- You want a complete round robin.
- You have 4 to 8 teams and enough court time.

It is less suitable when you want player mixing or self-balancing competitive rounds.

## Sources

- App code: `src/tournament/scoring/americanoCore.ts`
- PadelFast Americano, Team Americano section: https://www.padelfast.com/formats/americano
