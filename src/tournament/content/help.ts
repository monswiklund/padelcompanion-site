/**
 * Help content for tournament modes.
 * Each entry includes: description, pros/cons, recommended setup
 */

export const HELP_SKILL_LEVELS = {
  title: "Skill Levels Guide",
  content: `
**1-3**: Beginner - Learning basics, inconsistent rallies
**4-5**: Intermediate - Consistent shots, developing strategy
**6-7**: Advanced - Strong technique, tactical awareness
**8-9**: Expert - Tournament level, excellent court coverage
**10**: Pro - Professional or semi-professional level
  `.trim(),
};

export const HELP_WINNERS_INTRO = {
  title: "Winners Court",
  content: `
**What is it?**
A skill-based court promotion system where winners move up and losers move down.

**How it works:**
• Court 1 is the "Winners Court" (highest)
• Win = move UP one court
• Lose = move DOWN one court
• Rankings adjust dynamically

**✅ Pros:**
• Competitive and exciting
• Natural skill separation
• Everyone plays at their level

**⚠️ Cons:**
• Can feel discouraging for beginners
• Needs 8+ players for best experience

**Recommended Setup:**
• 8-16 players
• 2-4 courts
• Enable "Twist Mode" for partner variety
  `.trim(),
};

export const HELP_AMERICANO = {
  title: "Americano Format",
  content: `
**What is it?**
A round-robin format where everyone plays WITH every other player at least once.

**How it works:**
• Partners rotate each round
• Fixed schedule generated upfront
• Individual points accumulate
• Highest total wins

**✅ Pros:**
• Fair - everyone plays together
• Social - meet all players
• Predictable duration

**⚠️ Cons:**
• Less competitive edge
• Fixed rounds (no adaptation)

**Recommended Setup:**
• 8-12 players (best with 8)
• 2 courts
• 24 points per match
• "Total Points" scoring
  `.trim(),
};

export const HELP_MEXICANO = {
  title: "Mexicano Format",
  content: `
**What is it?**
Dynamic pairing based on current rankings. Top plays with bottom, 2nd with 2nd-last, etc.

**How it works:**
• After each round, rankings update
• Next round: #1 partners with #last, #2 with #2nd-last...
• Creates balanced teams each round
• Highest total points wins

**✅ Pros:**
• Self-balancing teams
• Competitive throughout
• Good for mixed skill groups

**⚠️ Cons:**
• Less social mixing
• Requires ranking focus

**Recommended Setup:**
• 8-16 players
• 2-4 courts
• 24 points per match
• "Optimal" pairing strategy
  `.trim(),
};

export const HELP_TEAM = {
  title: "Team Americano",
  content: `
**What is it?**
Fixed teams play round-robin against all other teams.

**How it works:**
• Pre-set 2-person teams
• All teams play each other
• Team points accumulate
• Best team wins

**✅ Pros:**
• Team chemistry builds
• Clear team standings
• Great for couples/friends

**⚠️ Cons:**
• Skill imbalance possible
• Less variety

**Recommended Setup:**
• 4-8 teams (8-16 players)
• 2 courts
• 24 points per match
  `.trim(),
};

export const HELP_TEAM_MEXICANO = {
  title: "Team Mexicano",
  content: `
**What is it?**
Fixed teams with dynamic matchups based on rankings.

**How it works:**
• Pre-set teams stay together
• Matchups based on team rankings
• #1 team vs #last, etc.
• Creates balanced matches

**✅ Pros:**
• Team chemistry + competitive balance
• Exciting close matches

**⚠️ Cons:**
• Less variety in opponents

**Recommended Setup:**
• 4-8 teams
• 2 courts
• "Race to 21" scoring
  `.trim(),
};

export const HELP_BRACKET = {
  title: "Bracket Tournament",
  content: `
**What is it?**
Single or double elimination - lose and you're out!

**How it works:**
• Bracket seeding determines matchups
• Win to advance, lose and you're eliminated
• Finals determine the champion

**✅ Pros:**
• Classic tournament feel
• Clear winner
• High stakes excitement

**⚠️ Cons:**
• Eliminated players stop playing
• Short for some participants

**Recommended Setup:**
• 4, 8, or 16 teams (power of 2)
• Single elimination for speed
• Dual bracket for double chances
  `.trim(),
};

export const HELP_SCORING = {
  title: "Scoring Options",
  content: `
**Total Points**
Play to a fixed total (e.g., 24 points).
Good for consistent match lengths.

**Race To**
First to reach target wins (e.g., first to 21).
More competitive, variable length.

**Timed**
Play for set minutes, highest score wins.
Predictable timing for scheduling.
  `.trim(),
};

export const HELP_COURTS = {
  title: "Court Settings",
  content: `
**Number of Courts**
More courts = faster rounds, but needs more players.
Ideal: 4 players per court.

**Queue Rotation**
If players aren't divisible by 4, some sit out each round and rotate in next round.
  `.trim(),
};
