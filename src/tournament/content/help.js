/**
 * Centralized Help Content
 * Contains HTML strings for various help modals in the application.
 */

export const HELP_FORMATS = `
<div style="display: flex; flex-direction: column; gap: 24px;">
  <section>
    <div style="font-weight: 700; font-size: 1.15em; color: var(--text-primary); margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
      <span>Americano</span>
    </div>
    <p style="color: var(--text-secondary); margin-bottom: 12px; line-height: 1.5;">The ultimate social format. You play with a different partner every round, ensuring everyone mixes and gets to know each other.</p>
    <div style="background: rgba(255, 255, 255, 0.04); padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);">
       <div style="margin-bottom: 8px; font-size: 0.9em;"><strong style="color: #4ade80;">✅ Social mixing:</strong> Perfect for corporate events or social clubs.</div>
       <div style="font-size: 0.9em; opacity: 0.8; display: flex; align-items: center; gap: 6px;">
         <span style="font-size: 1.1em;">ℹ️</span> <span>Players collect individual points for every game won.</span>
       </div>
    </div>
  </section>

  <hr style="border: none; border-top: 1px solid var(--border-color); margin: 0;">

  <section>
    <div style="font-weight: 700; font-size: 1.15em; color: var(--text-primary); margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
      <span>Mexicano</span>
    </div>
    <p style="color: var(--text-secondary); margin-bottom: 12px; line-height: 1.5;">Competitive and dynamic. The system matches players of similar skill levels. As the tournament progresses, matches become tighter and more exciting.</p>
    <div style="background: rgba(255, 255, 255, 0.04); padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);">
       <div style="margin-bottom: 8px; font-size: 0.9em;"><strong style="color: #60a5fa;">🏆 Level matches:</strong> Smart matchmaking based on current leaderboard rank.</div>
       <div style="font-size: 0.9em; opacity: 0.8; display: flex; align-items: center; gap: 6px;">
         <span style="font-size: 1.1em;">ℹ️</span> <span>"Winners play winners" logic keeps the competition fierce.</span>
       </div>
    </div>
  </section>

  <hr style="border: none; border-top: 1px solid var(--border-color); margin: 0;">

  <section>
    <div style="font-weight: 700; font-size: 1.15em; color: var(--text-primary); margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
      <span>Team Formats</span>
    </div>
    <p style="color: var(--text-secondary); margin-bottom: 12px; line-height: 1.5;">Bring your own partner. You stay together as a fixed duo throughout the entire tournament. Can be played using Americano or Mexicano rules.</p>
    <div style="background: rgba(255, 255, 255, 0.04); padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);">
       <div style="margin-bottom: 8px; font-size: 0.9em;"><strong style="color: #f472b6;">🤝 Fixed Teams:</strong> Ideal for club championships or pre-defined pairs.</div>
       <div style="font-size: 0.9em; opacity: 0.8; display: flex; align-items: center; gap: 6px;">
         <span style="font-size: 1.1em;">ℹ️</span> <span>The leaderboard tracks team performance instead of individuals.</span>
       </div>
    </div>
  </section>
</div>
`;

export const HELP_SCORING = `
<div style="display: flex; flex-direction: column; gap: 24px;">
  <section>
    <div style="font-weight: 700; font-size: 1.15em; color: var(--text-primary); margin-bottom: 6px;">Total Points</div>
    <p style="color: var(--text-secondary); margin-bottom: 12px; line-height: 1.5;">Every single point matters. You play a fixed number of points (e.g., 24), and the final score is recorded exactly as it ends.</p>
    <div style="background: rgba(255, 255, 255, 0.04); padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);">
       <div style="margin-bottom: 4px; font-size: 0.9em;"><strong>Example:</strong> Team A: 14, Team B: 10</div>
       <div style="font-size: 0.9em; opacity: 0.8;">These points are added directly to each player's global total.</div>
    </div>
  </section>

  <hr style="border: none; border-top: 1px solid var(--border-color); margin: 0;">

  <section>
    <div style="font-weight: 700; font-size: 1.15em; color: var(--text-primary); margin-bottom: 6px;">Race (First to X)</div>
    <p style="color: var(--text-secondary); margin-bottom: 12px; line-height: 1.5;">A classic match feel. The first team to reach the target score wins the match immediately.</p>
    <div style="background: rgba(255, 255, 255, 0.04); padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);">
       <div style="margin-bottom: 4px; font-size: 0.9em;"><strong>Example:</strong> First to 21 wins.</div>
       <div style="font-size: 0.9em; opacity: 0.8;">Perfect for keeping that "winning the set" excitement.</div>
    </div>
  </section>

  <hr style="border: none; border-top: 1px solid var(--border-color); margin: 0;">

  <section>
    <div style="font-weight: 700; font-size: 1.15em; color: var(--text-primary); margin-bottom: 6px;">Timed (Minutes)</div>
    <p style="color: var(--text-secondary); margin-bottom: 12px; line-height: 1.5;">Play against the clock. When the buzzer sounds, the team currently leading wins the match.</p>
    <div style="background: rgba(255, 255, 255, 0.04); padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);">
       <div style="margin-bottom: 4px; font-size: 0.9em;">⏱️ <strong>Strict Schedule:</strong> Ensures all matches finish at the exact same time.</div>
       <div style="font-size: 0.9em; opacity: 0.8;">Great for tournaments with limited court time.</div>
    </div>
  </section>
</div>
`;

export const HELP_MATCHUP = `
<div style="display: flex; flex-direction: column; gap: 24px;">
  <p style="color: var(--text-secondary); margin: 0; line-height: 1.5;">Fine-tune how the <strong>Mexicano</strong> engine pairs players together.</p>

  <section>
    <div style="font-weight: 700; font-size: 1.1em; color: var(--text-primary); margin-bottom: 6px;">Max Partner Repeats</div>
    <p style="color: var(--text-secondary); margin-bottom: 12px; font-size: 0.95em;">Controls variety. How many times can you play with the same partner?</p>
    <div style="background: rgba(255, 255, 255, 0.04); padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);">
       <div style="margin-bottom: 8px; font-size: 0.9em;">🔄 <strong>Set to 0:</strong> Maximum variety (never repeat if possible).</div>
       <div style="font-size: 0.9em; opacity: 0.8;">♾️ <strong>Unlimited:</strong> Purest competition (best pairing always used).</div>
    </div>
  </section>

  <hr style="border: none; border-top: 1px solid var(--border-color); margin: 0;">

  <section>
    <div style="font-weight: 700; font-size: 1.1em; color: var(--text-primary); margin-bottom: 6px;">Pairing Strategy</div>
    <p style="color: var(--text-secondary); margin-bottom: 12px; font-size: 0.95em;">How to form teams from the top 4 available players (Rank 1-4) each round.</p>
    <div style="display: flex; flex-direction: column; gap: 10px;">
      <div style="padding-left: 12px; border-left: 2px solid #60a5fa;">
        <div style="font-weight: 600; font-size: 0.95em; color: var(--text-primary);">Optimal (Smart)</div>
        <div style="font-size: 0.9em; color: var(--text-secondary);">AI analyzes all options to find the pair that best avoids partner repeats.</div>
      </div>
      <div style="padding-left: 12px; border-left: 2px solid rgba(255, 255, 255, 0.2);">
        <div style="font-weight: 600; font-size: 0.95em; color: var(--text-primary);">Standard (1&3 vs 2&4)</div>
        <div style="font-size: 0.9em; color: var(--text-secondary);">The classic Mexicano logic. Always pairs 1st with 3rd against 2nd & 4th.</div>
      </div>
    </div>
  </section>

  <hr style="border: none; border-top: 1px solid var(--border-color); margin: 0;">

  <section>
    <div style="font-weight: 700; font-size: 1.1em; color: var(--text-primary); margin-bottom: 6px;">Strict Pattern</div>
    <p style="color: var(--text-secondary); margin-bottom: 12px; font-size: 0.95em;">What happens when the "Standard" pattern conflicts with your "Max Repeats" setting?</p>
    <div style="background: rgba(255, 255, 255, 0.04); padding: 12px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08);">
       <div style="margin-bottom: 8px; font-size: 0.9em;">⬜ <strong>OFF (Smart):</strong> Pattern is broken to avoid repeats.</div>
       <div style="font-size: 0.9em;">✅ <strong>ON (Strict):</strong> Pattern is forced, even if it causes a repeat.</div>
    </div>
  </section>
</div>
`;

export const HELP_LEADERBOARD = `
<div style="display: flex; flex-direction: column; gap: 20px;">
  <p style="color: var(--text-secondary); margin: 0; line-height: 1.5;">Track player standings throughout the tournament. Rankings update automatically after each round.</p>
  
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <section style="background: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 10px;">
      <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 4px;"># (Rank)</div>
      <div style="font-size: 0.9em; color: var(--text-secondary);">Current position based on your chosen criteria. Arrows indicate movement since the last round.</div>
    </section>

    <section style="background: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 10px;">
      <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">Pts (Points)</div>
      <div style="font-size: 0.9em; color: var(--text-secondary);">Total points won across all matches. This is the primary way players are ranked.</div>
    </section>

    <section style="background: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 10px;">
      <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">W (Wins)</div>
      <div style="font-size: 0.9em; color: var(--text-secondary);">The total number of matches you have won.</div>
    </section>

    <section style="background: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 10px;">
      <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">Diff (Difference)</div>
      <div style="font-size: 0.9em; color: var(--text-secondary);">Point difference (Points Won - Points Lost). Crucial for breaking ties in the rankings.</div>
    </section>

    <section style="background: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 10px;">
      <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">% (Win Rate)</div>
      <div style="font-size: 0.9em; color: var(--text-secondary);">Your efficiency. The percentage of wins compared to matches played.</div>
    </section>

    <section style="background: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 10px;">
      <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">Pl (Played)</div>
      <div style="font-size: 0.9em; color: var(--text-secondary);">Total matches played. Note: Bye rounds do not count as played matches.</div>
    </section>
  </div>
</div>
`;

export const HELP_POOL_ASSIGNMENT = `
<p><strong>How teams are distributed across pools:</strong></p>
<ul style="margin: 10px 0; padding-left: 20px;">
  <li><strong>🎲 Random</strong> – Teams are shuffled randomly into pools</li>
  <li><strong>↔️ Alternate</strong> – Team 1→A, Team 2→B, Team 3→C, etc.</li>
  <li><strong>½ Split by Pool</strong> – Teams divided evenly (first third to A, second to B, etc.)</li>
  <li><strong>✋ Manual</strong> – You set each team's pool using the A/B/C/D/E/F toggle on each team</li>
</ul>
<p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 10px;">💡 With <strong>Pair Finals</strong> enabled, each pair of pools (A vs B, C vs D) has its own final match!</p>
`;

export const HELP_BRACKET_GUIDE = `
<div style="text-align: left;">
  <h4 style="margin-bottom: 10px; color: var(--accent);">🏆 How It Works</h4>
  <p>Create a single-elimination bracket where teams compete head-to-head. Losers are eliminated, winners advance until one champion remains.</p>
  
  <hr style="margin: 12px 0; border-color: var(--border-color);">
  
  <h4 style="margin-bottom: 10px; color: var(--accent);">📋 Setup Tips</h4>
  <ul style="padding-left: 20px; margin-bottom: 12px;">
    <li><strong>Perfect sizes:</strong> 4, 8, 16, or 32 teams</li>
    <li><strong>Other sizes:</strong> "Byes" are assigned automatically</li>
    <li><strong>A/B Toggle:</strong> Pre-assign teams to bracket sides</li>
  </ul>
  
  <h4 style="margin-bottom: 10px; color: var(--warning);">🔀 A/B Side Toggle</h4>
  <p>Click the toggle next to each team to assign them:</p>
  <ul style="padding-left: 20px; margin-bottom: 12px;">
    <li><strong>A (Blue):</strong> Left side of bracket</li>
    <li><strong>B (Orange):</strong> Right side of bracket</li>
    <li><strong>Gray:</strong> Unassigned (auto-distributed)</li>
  </ul>
  
  <hr style="margin: 12px 0; border-color: var(--border-color);">
  
  <h4 style="margin-bottom: 10px; color: var(--success);">⚡ Dual Brackets Mode</h4>
  <p>Enable "Dual Brackets" for two separate brackets (A vs B) with a shared Grand Final where the winners of each side face off!</p>
</div>
`;

export const HELP_BRACKET_SIZES = `
<p><strong>Perfect bracket sizes:</strong> 4, 8, 16, or 32 teams</p>
<p>With these numbers, all teams play every round—no one gets a free pass!</p>
<hr style="margin: 12px 0; border-color: var(--border-color);">
<p><strong>What are "byes"?</strong></p>
<p>If you don't have a perfect number (e.g., 10 teams), some teams get a <strong>bye</strong>—they skip round 1 and go directly to round 2.</p>
<p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 8px;">Example: With 10 teams, 6 teams get byes (advance automatically), and 4 teams play in round 1.</p>
<hr style="margin: 12px 0; border-color: var(--border-color);">
<p><strong>Dual Brackets mode:</strong></p>
<p>Splits teams into Side A and Side B. Each side has its own bracket, and the winners face off in a Grand Final!</p>
`;

export const HELP_WINNERS_INTRO = `
<div style="font-size: 0.95rem; line-height: 1.6;">
  <p><strong>Winners Court (Americano Mexicano hybrid)</strong> is a fun, skill-based king of the hill format.</p>
  
  <h4 style="margin: 12px 0 6px; color: var(--accent);">How it works</h4>
  <ul style="padding-left: 20px; margin: 0;">
    <li><strong>Win match:</strong> Move UP one court (e.g. Court 2 → Court 1).</li>
    <li><strong>Lose match:</strong> Move DOWN one court (e.g. Court 1 → Court 2).</li>
    <li><strong>Top Court Winners</strong> stay on Court 1.</li>
    <li><strong>Bottom Court Losers</strong> stay on the last court.</li>
  </ul>

  <h4 style="margin: 12px 0 6px; color: var(--accent);">Twist Mode</h4>
  <p style="margin: 0;">If enabled, partners rotate every round so you play with different people on your court. Great for socializing!</p>

  <h4 style="margin: 12px 0 6px; color: var(--accent);">Tips</h4>
  <ul style="padding-left: 20px; margin: 0;">
    <li>Initial placement is based on the <strong>Skill Level</strong> you enter.</li>
    <li>Default skill is (-) which is treated as 0.</li>
  </ul>
</div>
`;

export const HELP_SKILL_LEVELS = `
<p><strong>Skill levels are optional!</strong></p>
<p>Use them to help create balanced teams for the <strong>first round</strong>:</p>
<ul style="margin: 12px 0; padding-left: 20px;">
  <li><strong>1-3:</strong> Beginner</li>
  <li><strong>4-6:</strong> Intermediate</li>
  <li><strong>7-9:</strong> Advanced</li>
  <li><strong>10:</strong> Pro</li>
  <li><strong>-:</strong> Unknown/Skip</li>
</ul>
<p style="color: var(--text-muted); font-size: 0.9rem;">After round 1, matchups are based on wins/losses only—skill ratings won't affect later rounds.</p>
`;
