// ══════════════════════════════════════════
// drives.js — Drive grouping & history
// ══════════════════════════════════════════

function renderHistory() {
  const container = document.getElementById('history-list');
  if (!container) return;

  if (State.history.length === 0) {
    container.innerHTML = '<div class="history-empty">No plays recorded yet</div>';
    return;
  }

  let html = '';

  // ── Completed drives ──
  State.drives.forEach(drive => {
    html += `
      <div class="drive-header" onclick="this.nextElementSibling.classList.toggle('collapsed')">
        <span class="drive-num">Drive ${drive.driveNum}</span>
        <span class="drive-meta">${drive.plays} plays · ${drive.yards >= 0 ? '+' : ''}${drive.yards} yds</span>
        <span class="drive-outcome ${drive.outcome.includes('TD') ? 'outcome-td' : ''}">${drive.outcome}</span>
        <span class="drive-chevron">▾</span>
      </div>
      <div class="drive-plays collapsed">
        ${drive.playEntries.map((p, i) => _playItemHTML(p, i + 1)).join('')}
      </div>
    `;
  });

  // ── Current live drive ──
  const currentPlays = State.history.slice(State.currentDriveStart);
  if (currentPlays.length > 0) {
    const totalYards = currentPlays.reduce((s, p) => s + (p.yardsGained || 0), 0);
    html += `
      <div class="drive-header current-drive" onclick="this.nextElementSibling.classList.toggle('collapsed')">
        <span class="drive-num">Drive ${State.currentDrive} <span class="drive-live">LIVE</span></span>
        <span class="drive-meta">${currentPlays.length} plays · ${totalYards >= 0 ? '+' : ''}${totalYards} yds</span>
        <span class="drive-outcome">—</span>
        <span class="drive-chevron">▾</span>
      </div>
      <div class="drive-plays">
        ${[...currentPlays].reverse().map((p, i) => _playItemHTML(p, currentPlays.length - i)).join('')}
      </div>
    `;
  }

  container.innerHTML = html;
  container.scrollTop = 0;
}

function _playItemHTML(play, num) {
  const yd = play.yardDisplay !== undefined ? play.yardDisplay : formatYardLine(play.oppYardLine);
  const side = yd > 0 ? 'OPP' : 'OWN';
  const yardStr = `${side} ${Math.abs(yd)}`;

  // Formation: shorten to first 3 words for space
  const formationShort = (play.formationName || '')
    .split(' ').slice(0, 3).join(' ');

  // Yards display
  const yardsStr = play.yardsGained !== undefined
    ? (play.yardsGained > 0 ? `+${play.yardsGained}` : `${play.yardsGained}`)
    : '';

  // Result badge
  const resultClass = play.result
    ? `result-${play.result.toLowerCase().replace(/\s+/g, '-')}`
    : '';
  const resultHTML = play.result
    ? `<span class="tl-result ${resultClass}">${play.result}</span>`
    : '';

  // Defense summary
  const defParts = [
    play.selectedFront || '',
    play.selectedBlitz && play.selectedBlitz !== 'none' ? play.selectedBlitz : '',
    play.selectedCoverage || '',
  ].filter(Boolean);
  const defHTML = defParts.length
    ? `<span class="tl-def">${defParts.join(' · ')}</span>`
    : '';

  // Penalty
  const penaltyHTML = play.penalty
    ? `<span class="tl-penalty">⚑ ${play.penalty.team} ${play.penalty.yards}y</span>`
    : '';

  // Player
  const playerHTML = play.playerNumber
    ? `<span class="tl-meta-item">#${play.playerNumber}</span>`
    : '';

  return `
    <div class="tl-item" data-play-id="${play.timestamp}"
         onclick="PlayEditor.open('${play.timestamp}')">
      <div class="tl-main">
        <span class="tl-num">${num}</span>
        <span class="play-badge ${play.type}">${play.type.toUpperCase()}</span>
        <div class="tl-play-info">
          <span class="tl-formation">${formationShort}</span>
          <span class="tl-play-name">${play.playName || ''}</span>
        </div>
        <div class="tl-right">
          ${yardsStr ? `<span class="tl-yards ${play.yardsGained > 0 ? 'pos' : play.yardsGained < 0 ? 'neg' : ''}">${yardsStr}</span>` : ''}
          ${resultHTML}
        </div>
      </div>
      <div class="tl-sub">
        <span class="tl-meta-item">${play.down}&amp;${play.toFirst}</span>
        <span class="tl-meta-item">${yardStr}</span>
        ${playerHTML}
        ${penaltyHTML}
        ${defHTML}
        ${play.notes ? `<span class="tl-meta-item tl-notes">${play.notes}</span>` : ''}
      </div>
    </div>
  `;
}

function endDrive() {
  const currentPlays = State.history.slice(State.currentDriveStart);
  if (currentPlays.length === 0) return;

  const totalYards = currentPlays.reduce((s, p) => s + (p.yardsGained || 0), 0);
  const last = currentPlays[currentPlays.length - 1];
  const result = last.result || '';

  let outcome = 'Turnover on Downs';
  if (result === 'TD')       outcome = 'TD 🏈';
  else if (result === 'FG')  outcome = 'FG ✓';
  else if (result === 'Punt') outcome = 'Punt';
  else if (result === 'Turnover') outcome = 'Turnover';
  else if (result === 'Safety')   outcome = 'Safety';

  State.drives.push({
    driveNum:    State.currentDrive,
    plays:       currentPlays.length,
    yards:       totalYards,
    outcome,
    playEntries: [...currentPlays],
  });

  State.currentDrive      += 1;
  State.currentDriveStart  = State.history.length;
  renderHistory();
}
