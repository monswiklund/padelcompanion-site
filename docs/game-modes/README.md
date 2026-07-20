# Padel Companion Game Modes

This folder documents the game modes currently present on the website. It combines product behavior from the codebase with external padel format research.

Last reviewed: 2026-05-19.

## Modes

| Mode                                | Website route or selector                             | Main implementation                               |
| ----------------------------------- | ----------------------------------------------------- | ------------------------------------------------- |
| [Americano](americano.md)           | `/tournament/generator`, format `americano`           | `src/tournament/scoring/americanoCore.ts`         |
| [Team Americano](team-americano.md) | Legacy format `team`                                  | `src/tournament/scoring/americanoCore.ts`         |
| [Mexicano](mexicano.md)             | `/tournament/generator`, format `mexicano`            | `src/tournament/scoring/mexicanoGenerator.ts`     |
| [Team Mexicano](team-mexicano.md)   | `/tournament/generator`, Team Mode toggle on Mexicano | `src/tournament/scoring/teamMexicanoGenerator.ts` |
| [Division](division.md)             | `/tournament/division`, format `division`             | `src/tournament/scoring/divisionGenerator.ts`     |
| [Winners Court](winners-court.md)   | `/tournament/winners-court`                           | `src/tournament/winnersCourt/winnersCourtCore.ts` |
| [Bracket](bracket.md)               | `/tournament/bracket`                                 | `src/tournament/bracket/bracketCore.ts`           |

## Shared concepts

- Standard padel rules govern rallies, serving, lets, court play, and normal match scoring unless the event organizer chooses a social scoring variant.
- The website's round-based mixer modes support three scoring modes: total points, race to a target, and timed play.
- The default mixer preset is total points to 24.
- Leaderboards are usually based on accumulated points, with wins as a secondary sort in point-based modes.
- Division play uses match points: win = 3, draw = 1, loss = 0.
- Bracket and Winners Court need a winner for each match or court result.

See also: [Shared Padel Rules And Scoring](shared-padel-rules-and-scoring.md).

## Research Sources

- FIP official documents page: https://www.padelfip.com/documents/
- FIP Rules of Padel PDF: https://www.padelfip.com/wp-content/uploads/2025/12/FIP_Rules-of-Padel.pdf
- PadelFast Americano: https://www.padelfast.com/formats/americano
- PadelFast Mexicano: https://www.padelfast.com/formats/mexicano
- PadelFast Round Robin: https://www.padelfast.com/formats/roundrobin
- PadelFast Winners lane: https://www.padelfast.com/formats/winnerslane
- PadelFast Knockout: https://www.padelfast.com/formats/knockout
- Live For Padel King of the Court: https://www.liveforpadel.com/blog/padel-king-of-the-court
- Padel Playground Round Robin: https://padelplayground.io/round-robin-format-explained/
- Padel Americanos format overview: https://padelamericanos.com/
