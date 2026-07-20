# Winners Court

## What It Is

Winners Court is Padel Companion's king-of-the-hill mode. Winners move toward the top court, losers move down or toward the queue, and the goal is to finish on or keep defending the top court.

External padel references call nearby formats King of the Court or Winners lane. There is no single official governing rulebook for this social format; venues vary the queue, scoring, and partner-splitting rules.

## Website Behavior

Route: `/tournament/winners-court`

Main implementation:

- `src/tournament/pages/winnersCourt/WinnersCourtSetup.tsx`
- `src/tournament/winnersCourt/winnersCourtCore.ts`
- `src/tournament/pages/winnersCourt/WinnersCourtActiveView.tsx`

Minimum setup:

- At least 4 players total.
- In multi-pool setup, each pool needs at least 4 players.
- Single-pool mode can use a chosen court count or the maximum possible court count.

## Setup Options

| Option          | Behavior                                                                              |
| --------------- | ------------------------------------------------------------------------------------- |
| Pool count      | One or more independent pools, labelled A, B, C, etc.                                 |
| Courts per pool | Single pool can choose courts; multi-pool auto-calculates `floor(playersInPool / 4)`. |
| Skill levels    | If enabled, players are sorted by skill before generation.                            |
| Assignment      | Random or manual pool assignment.                                                     |
| Twist           | Splits partners in winner and loser groups before the next round is built.            |

## Initial Generation

`generateWinnersCourt`:

1. In multi-pool mode, filter players by pool.
2. Shuffle each pool's players.
3. Create as many courts as the pool supports.
4. Put four players on each court as two pairs.
5. Put remaining players into the pool queue.
6. In single-pool mode, ignore prior side assignments and treat everyone as pool A.

## Round Advancement

`advanceRound`:

1. Requires every court in the pool to have a winner.
2. Collects all winning teams' players.
3. Collects all losing teams' players.
4. Saves the completed courts to history.
5. If Twist is enabled, reorders winners and losers to split adjacent partners.
6. Builds the next court list from winners first, then queued players, then losers.
7. Keeps overflow players in the queue.
8. Increments the pool round.

This implementation is a promotion stack, not a strict per-court one-step ladder. Winning players are placed ahead of queued players and losing players for the next round.

## Scoring

The app records only which team won each court before advancing. If a match is tied, the organizer should play a deciding point or use a house rule to choose a winner.

## Good Fit

Use Winners Court when:

- You want fast, high-energy rounds.
- Players like promotion and relegation pressure.
- You have enough courts for most players to stay active.
- You want natural skill separation over time.

Use Twist when partner variety matters.

## Sources

- App code: `src/tournament/winnersCourt/winnersCourtCore.ts`
- PadelFast Winners lane: https://www.padelfast.com/formats/winnerslane
- Live For Padel King of the Court: https://www.liveforpadel.com/blog/padel-king-of-the-court
