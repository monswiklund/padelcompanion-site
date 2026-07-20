# Shared Padel Rules And Scoring

## Purpose

This document captures the padel rules that matter across all Padel Companion modes. The app is a tournament scheduler and score tracker; it does not replace the official laws of padel.

## Official Rule Base

The International Padel Federation (FIP) is the governing body for padel rules. The FIP documents page lists "Rules of Padel" under sport and competitions, and the current public PDF is hosted on `padelfip.com`.

Core assumptions for every mode:

- Padel is normally played as doubles on a 20 x 10 metre enclosed court.
- Standard match scoring follows tennis-style point, game, set, and tie-break structure.
- Tie-break scoring is numeric and normally requires a two point margin.
- Organizers may use alternative scoring methods, such as mini sets, match tie-breaks, super tie-breaks, or social point-count formats.
- Social event formats such as Americano, Mexicano, and Winners Court are tournament structures, not separate official rulebooks.

## App Scoring Modes

Configured in `src/components/tournament/TournamentConfig.tsx`.

| Mode         | App meaning                                                                             | Default preset |
| ------------ | --------------------------------------------------------------------------------------- | -------------- |
| Total Points | Play a fixed total number of rally points. Both teams' scores should sum to the target. | 24             |
| Race To      | First team to reach the target wins.                                                    | 14             |
| Timed        | Play for a fixed number of minutes, then record the score.                              | 11 minutes     |

The app records scores as integers. Standard padel game scoring like 15, 30, 40 is therefore represented only indirectly unless a bracket match is manually scored as games or sets.

## Leaderboard Updates

Implemented in `src/tournament/scoring/playerStats.ts`.

For non-playoff round modes:

- Each player receives their team's scored points as `points`.
- Each player receives the opponent team's score as `pointsLost`.
- `played` increments by one per match.
- Wins, losses, and draws are counted from the recorded score.
- Match points are also tracked: win = 3, draw = 1, loss = 0.
- In doubles mixer modes, each player records the partner they played with in `playedWith`.
- Bye players receive an incremented `byeCount`.

Default leaderboard sorting uses total points, then wins. Division playoff qualification sorts by match points, then the configured tiebreaker.

## Practical Event Rules

Use these as organizer defaults unless a mode document says otherwise:

- Agree scoring before the first round starts.
- For point-count formats, use an even total such as 16, 24, or 32 so service rotations stay balanced.
- For timed formats, finish the active point when time expires.
- Avoid draws in Bracket and Winners Court. Use a deciding point if the score is tied.
- In casual mixer formats, prioritize equal play count and bye fairness over strict official match structure.

## Sources

- FIP documents: https://www.padelfip.com/documents/
- FIP Rules of Padel PDF: https://www.padelfip.com/wp-content/uploads/2025/12/FIP_Rules-of-Padel.pdf
- PadelFast Americano scoring examples: https://www.padelfast.com/formats/americano
- PadelFast Mexicano scoring examples: https://www.padelfast.com/formats/mexicano
