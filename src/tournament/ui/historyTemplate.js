export const getHistoryTemplate = () => `
  <section class="section history-section-page" id="historySectionPage" style="display: block; margin-top: var(--space-xl);">
    <div class="container">
      <div class="section-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md);">
         <h2>Past Tournaments</h2>
         <div class="search-wrapper">
           <input type="text" id="historySearch" placeholder="Filter by winner, date..." class="form-input search-input" />
         </div>
      </div>

      <div class="table-responsive history-table-wrapper">
        <table class="history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Format</th>
              <th>Winner</th>
              <th>Players</th>
              <th>Rounds</th>
              <th style="text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody id="historyTableBody"></tbody>
        </table>
        <div id="historyEmptyStatePage" class="empty-state-page" style="display: none; padding: 2rem; text-align: center;">
           <p class="text-muted">No history found.</p>
        </div>
      </div>
    </div>
  </section>
`;
