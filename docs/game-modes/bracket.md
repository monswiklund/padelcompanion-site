# Bracket

## What It Is

Bracket mode is knockout tournament play. Teams or players are placed into a draw, winners advance, and the last remaining entrant wins.

The website supports single elimination, pool brackets with an optional shared final, and double elimination data structures.

## Website Behavior

Route: `/tournament/bracket`

Main implementation:

- `src/tournament/pages/bracket/BracketSetup.tsx`
- `src/tournament/bracket/bracketCore.ts`
- `src/tournament/bracket/bracketGeneration.ts`
- `src/tournament/bracket/matchProgression.ts`

Setup options:

| Option           | Values                             |
| ---------------- | ---------------------------------- |
| Entry mode       | Teams or players                   |
| Score type       | Points, games, or sets             |
| Pools            | Off or on                          |
| Pool count       | 2 or more when pools are enabled   |
| Assignment       | Random, alternate, half, or manual |
| Shared final     | Pool winners meet in a final       |
| Elimination type | Single or double                   |

## Single Elimination Logic

`generateSingleBracket`:

1. Requires at least 2 teams.
2. Expands the draw to the next power of 2.
3. Seeds teams in input order.
4. Creates first-round matches.
5. Auto-advances teams with byes.
6. Creates later rounds linked by previous match IDs.

`updateMatchResult` records scores and propagates the winner into the next match. A tied score produces no winner.

## Pool Bracket Logic

`generateMultiPoolBracket`:

1. Splits teams by `side` label A, B, C, etc.
2. Builds a single-elimination bracket inside each pool.
3. Optionally creates a grand final between the first two pool winners.
4. Links each pool final to the grand final.

Assignment strategies:

- `random`: shuffle, then split into pool-sized chunks.
- `alternate`: assign teams A, B, C, then repeat.
- `half`: fill each pool block before moving to the next.
- `manual`: keep explicit side labels.

## Double Elimination Logic

`generateDoubleEliminationBracket`:

1. Builds a winners bracket like single elimination.
2. Builds losers bracket rounds.
3. Links losers from winners-bracket matches into losers-bracket matches.
4. Links winners-bracket finalist and losers-bracket finalist into a grand final.

Implementation note: multi-pool double elimination currently returns winners matches and an empty losers match list for pool-level play. Plain double elimination has the fuller losers bracket generator.

## Scoring

Bracket score type is stored as configuration:

- `points`
- `games`
- `sets`

The bracket logic compares the two numeric scores. It does not enforce tennis or padel set validation; the organizer is responsible for entering a valid final score for the selected score type.

Draws do not advance a winner. Use a deciding point, golden point, tie-break, or super tie-break according to event rules.

## Good Fit

Use Bracket when:

- You need a clear champion.
- The event is competitive.
- Eliminated teams do not need guaranteed equal court time.
- Entrant counts are close to 4, 8, 16, or another power of 2.

Avoid a pure bracket for social club nights where everyone expects to keep playing.

## Sources

- App code: `src/tournament/bracket/bracketCore.ts`
- App code: `src/tournament/bracket/matchProgression.ts`
- PadelFast Knockout: https://www.padelfast.com/formats/knockout
- FIP Rules of Padel PDF: https://www.padelfip.com/wp-content/uploads/2025/12/FIP_Rules-of-Padel.pdf
