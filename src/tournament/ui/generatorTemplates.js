import { getHistoryTemplate } from "./historyTemplate.js";

// Setup template removed as it is replaced by setup.js
// Only keeping History and Active template for index.js usage

export const getGeneratorActiveTemplate = () => `
  <!-- Schedule Section -->
  <div class="schedule-section" id="scheduleSection" style="display: none">
    <div class="sticky-wrapper">
      <div class="schedule-toolbar" id="scheduleToolbar">
        <span class="toolbar-label">View:</span>
        <div class="schedule-controls" id="scheduleControlsContent">
          <div class="control-group">
            <label for="gridColumns">Cols:</label>
            <input type="range" id="gridColumns" min="0" max="6" value="0" step="1" />
            <span id="gridColumnsLabel" class="range-value">Auto</span>
          </div>
          <div class="control-divider"></div>
          <div class="control-group">
            <label for="textSize">Text:</label>
            <input type="range" id="textSize" min="50" max="250" value="100" step="10" />
            <span id="textSizeLabel" class="range-value">100%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Match Timer -->
    <div id="matchTimerContainer" class="timer-container" style="display: none">
      <div class="timer-wrapper">
        <div class="timer-display" id="timerDisplay" title="Click to edit time" style="cursor: pointer;">12:00</div>
      </div>
      <div class="timer-controls">
        <button class="btn btn-primary btn-sm" id="timerStartBtn">Start</button>
        <button class="btn btn-secondary btn-sm" id="timerPauseBtn" style="display: none">Pause</button>
        <button class="btn btn-ghost btn-sm" id="timerResetBtn">Reset</button>
        <button class="btn btn-ghost btn-sm" id="timerSubBtn">-1m</button>
        <button class="btn btn-ghost btn-sm" id="timerAddBtn">+1m</button>
      </div>
    </div>

    <div class="schedule-header-row">
      <h2 class="section-title">Tournament Schedule</h2>
      <span class="status-badge" id="runningBadge" style="display: none;">Running</span>
    </div>
    
    <div id="gameDetails" class="game-details"></div>

    <div class="rounds-container" id="roundsContainer"></div>
  </div>

  <!-- Tournament Actions -->
  <div id="tournamentActionsSection" class="tournament-actions" style="display: none;">
    <div class="actions-header">
      <h3>Tournament Controls</h3>
    </div>
    <div class="actions-grid">
      <button class="btn btn-secondary action-btn" data-action="add-late-player" title="Add a player who arrived late">
        <span class="action-text">Add Late Player</span>
      </button>
      <button class="btn btn-secondary action-btn" id="undoBtn" title="Undo last action (Ctrl+Z)" disabled>
        <span class="action-text">Undo Last Action</span>
      </button>
      <button class="btn btn-secondary action-btn" id="resetBtn" title="Reset Tournament - Start over with same players">
        <span class="action-text">Reset Tournament</span>
      </button>
      <button class="btn btn-danger action-btn" data-action="end-tournament" title="End Tournament - Finalize results">
        <span class="action-text">End Tournament</span>
      </button>
    </div>
  </div>

  <!-- Leaderboard -->
  <div class="leaderboard-section" id="leaderboardSection" style="display: none">
    <div class="leaderboard-header">
      <div style="display: flex; align-items: center; gap: 8px;">
        <h3>Leaderboard</h3>
        <button type="button" class="help-icon always-enabled" id="helpLeaderboard">?</button>
      </div>
      <div class="leaderboard-controls">
        <div class="controls-left">
          <button id="togglePositionBtn" class="btn btn-secondary btn-sm toggle-off" data-action="toggle-position" title="Toggle rank change indicators">Ranks</button>
          <button id="toggleVisibilityBtn" class="btn btn-secondary btn-sm toggle-off" data-action="toggle-visibility" title="Toggle score visibility">Scores</button>
        </div>
        <div class="controls-right">
          <select id="rankingCriteria" class="form-select btn-sm">
            <option value="points" selected>Points</option>
            <option value="wins">Wins</option>
            <option value="winRatio">Win %</option>
            <option value="pointRatio">Pts %</option>
          </select>
          <button class="btn btn-secondary btn-sm" id="printBtn" title="Print Schedule/Result">Print</button>
        </div>
      </div>
    </div>
    <div class="table-responsive">
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Player</th>
            <th>Pts</th>
            <th>W</th>
            <th title="Score Difference">Diff</th>
            <th title="Win Rate">%</th>
            <th>Pl</th>
          </tr>
        </thead>
        <tbody id="leaderboardBody"></tbody>
      </table>
    </div>
  </div>

  <!-- History Section -->
  ${getHistoryTemplate()}
`;
